/**
 * Smoke Test Script
 * This script runs a simple test to ensure that the Ghostbusters CLI is working correctly.
 * It creates a temporary JavaScript file with a known issue, runs the CLI against it, and checks the output.
 * This is a basic sanity check to catch any major issues before running the full test suite.
 */

import { exec } from 'node:child_process';
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

    //2. Setup: Create a frontend file with one safe route and one GHOST route 
    if (!fs.existsSync('src')) fs.mkdirSync('src');
    fs.writeFileSync(GHOST_FILE, `
        fetch('/api/safe-route'); // This should be fine
        axios.delete('/api/ghost-route/123'); // This should be a ghost
    `);

    console.log(chalk.blue('Ghost route planted, running CLI...'));

    //3. Execution: Run the actual CLI entry point
    //we use 'node bin/cli.js' to simulate user command
    exec('node bin/cli.js', (error, stdout, stderr) => {
        //4. Cleanup: remove the test files we created
        try {
            fs.unlinkSync(GHOST_FILE);
            fs.unlinkSync(BACKEND_FILE);
        }
        catch (e) {
            /*ignore clean up errors, we will log any issues but we don't want them to cause the test to fail since the main point is to test the CLI execution, not the cleanup process*/
        }

        //5. Verify: Check the CLI output for expected results
        //we EXPECT an error (code 1) because the ghost route exists
        if (error && error.code === 1) {
            console.log(stdout);
            if (stdout.includes('/api/ghost-route/')){
                console.log(chalk.green.bold("SUCCESS: CLI correctly identified ghost route and blocked commit"));
                process.exit(0);
        } else {
            console.log(chalk.red.bold("FAILURE: CLI did not behave as expected. exited with error."));
            process.exit(1);
        } 
    } else {
            console.log(chalk.red(`Error executing CLI, did not block commit(exit code was 0): ${error.message}`));
            console.log('STDOUT:', stdout);
            process.exit(1);
        }
    })

}

runTest();