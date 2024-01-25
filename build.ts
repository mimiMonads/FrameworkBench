const fs = require('fs').promises;
const path = require('path');

async function readJSONStructure(baseDir) {
    let result = {};
    try {
        const directories = await fs.readdir(baseDir);
        for (const dir of directories) {
            const dirPath = path.join(baseDir, dir);
            const stats = await fs.stat(dirPath);
            if (stats.isDirectory()) {
                result[dir] = {};
                const files = await fs.readdir(dirPath);
                for (const file of files) {
                    if (file.endsWith('.json')) {
                        const filePath = path.join(dirPath, file);
                        const fileContents = await fs.readFile(filePath, 'utf8');
                        result[dir][file] = JSON.parse(fileContents);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error reading JSON structure:', error);
    }
    return result;
}



function generateMarkdownTableFromData(data) {
    let totals = [];

    // Calculate totals for each framework
    Object.keys(data).forEach(framework => {
        let total = 0;
        for (const file of ['param.json', 'index.json', 'query.json', 'token.json']) {
            total += data[framework][file]?.statusCodeDistribution["200"] || 0;
        }
        totals.push({ framework, total });
    });

    // Sort frameworks by total
    totals.sort((a, b) => b.total - a.total);

    // Generate markdown table
    let markdownTable = '| Framework | param.json | index.json | query.json | token.json | Total |\n|-----------|------------|------------|------------|------------|-------|\n';
    totals.forEach(item => {
        markdownTable += `| ${item.framework} `;
        for (const file of ['param.json', 'index.json', 'query.json', 'token.json']) {
            const statusCodeCount = data[item.framework][file]?.statusCodeDistribution["200"] || 0;
            markdownTable += `| ${statusCodeCount} `;
        }
        markdownTable += `| ${item.total} |\n`;
    });

    return markdownTable;
}


const baseDirectory = './json/bun';

['bun', 'deno'].forEach(name => {
    readJSONStructure(`./json/${name}`)
        .then(data => generateMarkdownTableFromData(data))
        .then(table => {
            const resultsDir = `./results/`;
            return fs.mkdir(resultsDir, { recursive: true })
                .then(() => fs.writeFile(path.join(resultsDir, `${name}_results.md`), table))
        })
        .then(() => console.log(`Results written for ${name}`))
        .catch(err => console.error(`Error writing results for ${name}:`, err));
});

