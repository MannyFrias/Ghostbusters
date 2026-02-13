/**
 * Smoke Test Script
 * This script runs a simple test to ensure that the Ghostbusters CLI is working correctly.
 * It creates a temporary JavaScript file with a known issue, runs the CLI against it, and checks the output.
 * This is a basic sanity check to catch any major issues before running the full test suite.
 */

import { exec } from 'child_process';
import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';

const GHOST_FILE = path.join(process.cwd(), 'src/smoke-test-ghost.js');
const BACKEND_FILE = path.join(process.cwd(), 'server/routes.js');

async function runTest() {
    console.log(chalk.bold.cyan('\n Running Smoke Test for Ghostbusters CLI...'));

    //1. Setup: Create a backend Route that DOES exist
    if (!fs.existsSync('server')) fs.mkdirSync('server');
        fs.writeFileSync(BACKEND_FILE, `
            router.get('/api/safe-route', (req, res) => res.send('OK'));
        `);

}