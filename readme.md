# Benchmarking Project

## Overview
This project benchmarks web frameworks using Deno, Bun, and Oha. Benchmark results are stored in the `result` directory.

## Prerequisites
- **Deno**: Ensure Deno is installed.
- **Bun**: Version ^1.0.24 or higher.
- **Oha**: A Rust-based tool for benchmarking.

## Scripts
Use the following scripts for benchmarking and generating results:
- **Build and Benchmark**: `bun build.ts && bun bench.ts`
- **Generate Markdown Table**: `bun build.ts`
- **Build Only**: `bun build.ts`

## Important Note
- The benchmark uses **port 3000**. Ensure it is available before running the tests. The script may attempt to terminate processes occupying this port.

## Results
- Check the `result` directory for detailed benchmarking results.
