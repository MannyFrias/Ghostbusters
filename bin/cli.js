#!/usr/bin/env node

/**Ghostbusters CLI
 * The entry point for the Ghostbusters pre-commit hook.
 * 
 */

import { runGhostbusters } from '../src/core/engine.js';//if we are sticking to ghostbusters (plural) those changes need to be made in core/engine.js as well
import { formatReport } from '../src/core/format.js'
import { setupHusky } from './init.js';
import path from 'path';

//1. Parse CLI arguments
const args = process.argv.slice(2);//captures the arguments passed to the CLI, excluding the first two elements (node and script path)
const command = args[0];

//Flags(Boolean checks)
const isSilent=args.includes('--silent') || args.includes('-s');
const isJson=args.includes('--json')||args.includes('-j');

/**
 * Help Menu
 */

function showHelp() {
    console.log(`
    Ghostbusters 👻 - Detect unmatched API routes before they haunt production.

    Usage: 
        ghostbusters [command][options]

    Commands:
        (empty) Runs ghostbusters (default)
        init   Installs Husky and sets up the pre-commit hook
        --help, -h Shows this help message

    Options:
        --silent, -s  Suppresses console output (useful for CI/CD)
        --json, -j    Outputs the report in JSON format for automated parsing
    `); 
}
/** 
 * Execution Engine 
 */

async function main() {
     //1.Handle help
  if(command === '--help' || command === '-h') {
    showHelp();
    return;
  }
    //2. handle 'init' command, being specific to avoid over reach if someone has a file named 'init' in their project
  if(command === 'init') {
    try{
    //Logic for setupHusky, which will be in a separate file (init.js) to keep things organized and modular
        console.log('Initializing Ghostbusters 👻...');
        await setupHusky();
        console.log('Ghostbusters pre-commit hook successfully installed!');
        return;
     }catch(error){
        console.error(`Setup failed: ${error.message}`);
        process.exit(1);
     };
  };

  //3. Error Handling for unknown commands
  //if something other than 'init' or help is passed, show error
    if(command && command !== 'init') {
        console.error(`Unknown command: ${command}`);
        showHelp();
        process.exit(1);
    }

  //4. Default behavior: run Ghostbusters
  const config= {
    frontendGlobs: [path.join(process.cwd(), 'src/**/*.{js,jsx,ts,tsx}')],
    backendGlobs: [path.join(process.cwd(), 'server/**/*.{js}')],
    ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
  };
  try {
    if(!isSilent && !isJson) console.log('Running Ghostbusters 👻...');
    //We pass the config to our core engine
    const report = await runGhostbusters(config);

    //Output handling
    if(isJson) {
        //JSON output
        console.log(JSON.stringify(report, null, 2));
    } else if(!isSilent) {
        //Formatted terminal output
        const output = formatReport(report);
        console.log(output);
    }
  }
//Exit Logic
//If there are unmatched routes, we want to exit with a non-zero code to prevent the commit
  if(report && report.unmatched && report.unmatched.length > 0) {
    process.exit(1);
  } catch (error) {
    console.error(`Error running Ghostbusters: ${error.message}`);
    process.exit(1);
  } 
}

