import { $ } from "bun";
const { spawn } = require('child_process');


const bench = async (elements) => {
    const bench = spawn(elements.rt, [...elements.flags,elements.route]);
     
    const killProcess  = async () => {
        if (bench && bench.pid && !bench.killed) {
            try {
                //being polite
                bench.kill('SIGTERM');
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for graceful shutdown
                if (!bench.killed) {
                    bench.kill('SIGKILL');
                    await new Promise(resolve => setTimeout(resolve, 1000)); // please
                    if (!bench.killed) {
                        const result = await $`lsof -i tcp:3000 -t`.text();
                        const pids = result.trim().split('\n').join(' ');
                        if(pids.length != 0){
                            // killing anything lisening to that port 
                            await $`kill -9 ${pids}`.quiet();
                        }
                    }
                }
            } catch (error) {
                console.error(`Error killing process for ${elements.name}:`, error);
            }
        }
    };

    // Execute benchmarking
    try {
        await $`oha --no-tui --json -z 2s -c 100 'http://localhost:3000/' `.quiet()
        await $`oha --no-tui --json -z 10s -c 100  'http://localhost:3000/' > ./json/${elements.rt}/${elements.name}/index.json`
        await $`oha --no-tui --json -z 10s -c 100 'http://localhost:3000/id/id' > ./json/${elements.rt}/${elements.name}/param.json`
        await $`oha --no-tui --json -z 10s -c 100  'http://localhost:3000/query?bench=world' > ./json/${elements.rt}/${elements.name}/query.json`
        await $`oha --no-tui --json -z 10s -c 100  'http://localhost:3000/token/token' > ./json/${elements.rt}/${elements.name}/token.json`
        await killProcess();

    } catch (error) {
        console.error(`Benchmark failed for ${elements.name}:`, error);
        await killProcess();
    } finally {
        await killProcess()
        console.log(`${elements.name} has finished using ${elements.rt}`)
    }
   
};

export const bun_frameworks = [
    {route: './src/bun/vixeny.ts', name: 'vixeny', rt: 'bun', flags: []},
    {route: './src/bun/hono.ts', name: 'hono', rt: 'bun' , flags: []},
    {route: './src/bun/elysia.ts', name: 'elysia', rt: 'bun', flags: []},
    {route: './src/deno/vixeny.ts', name: 'vixeny', rt: 'deno', flags: ['run', '-A' ]},
    {route: './src/deno/hono.ts', name: 'hono', rt: 'deno', flags: ['run', '-A' ]},
];


// Run benchmarks in sequence
(async () => {
    for (const el of bun_frameworks) {
        await bench(el);
    }
})();


  
