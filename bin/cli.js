#!/usr/bin/env node

/**
 * Ghostbusters CLI
 * The entry point for the Ghostbusters pre-commit hook.
 */
//running singular ghostbusters as plural; if core/engine.js gets changed to plural, remove 'runGhostbuster as'
import { runGhostbuster as runGhostbusters } from "../src/core/engine.js";
import { formatReport } from "../src/core/format.js";
import { setupHusky } from "./init.js";
import path from "path";
import chalk from "chalk";

//1. Parse CLI arguments
const args = process.argv.slice(2); //captures the arguments passed to the CLI, excluding the first two elements (node and script path)
const command = args[0];

//Flags(Boolean checks)
const isSilent = args.includes("--silent") || args.includes("-s");
const isJson = args.includes("--json") || args.includes("-j");

/**
 * Help Menu
 */

function showHelp() {
  console.log(`
    Ghostbusters 👻 - Detects unmatched API routes before they haunt production.

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
  //--1.Handle help--
  if (command === "--help" || command === "-h") {
    showHelp();
    return;
  }
  //--2. Handle 'init'-- //being specific to avoid overreach if someone has a file named 'init' in their project
  if (command === "init") {
    try {
      //Logic for setupHusky, which will be in a separate file (init.js) to keep things organized and modular
      if (!isSilent) console.log(chalk.blue("Initializing Ghostbusters 👻..."));
      await setupHusky();

      if (!isSilent)
        console.log(
          chalk.green("Ghostbusters pre-commit hook successfully installed!"),
        );
      return;
    } catch (error) {
      console.error(chalk.red(`Setup failed: ${error.message}`));
      process.exit(1);
    }
  }

  //--3. Error Handling for unknown commands--
  //if something other than 'init' or help is passed, show error
  if (command && command !== "init") {
    console.error(chalk.red(`Unknown command: ${command}`));
    showHelp();
    process.exit(1);
  }

  //--4. Default: run Ghostbusters--
  const config = {
    frontendGlobs: [path.join(process.cwd(), "**/*.{js,jsx,ts,tsx}")],
    backendGlobs: [path.join(process.cwd(), "**/*.{js,ts}")],
    ignore: ["**/node_modules/**", "**/dist/**", "**/build/**"],
  };

  try {
    if (!isSilent && !isJson)
      console.log(chalk.blue("Running Ghostbusters 👻..."));
    //We pass the config to our core engine
    const report = await runGhostbusters(config);

    //Output handling
    //Safety check: make sure Enginve actually returned something
    if (!report) {
      throw new Error("Engine returned no report.");
    }

    if (isJson) {
      //JSON output
      console.log(JSON.stringify(report, null, 2));
    } else if (!isSilent) {
      //Formatted terminal output
      console.table(report.stats);
      
      const output = formatReport(report);
      console.log(output);
    }

    //--5.Exit Logic--
    //If there are unmatched routes, we want to exit with a non-zero code to prevent the commit

    //check for ghosts using chaining for safety
    const ghostCount = report.unmatched?.length || 0;

    if (ghostCount > 0) {
      //only log if we aren't in slient/json mode (let the earler output speak)
      if (!isSilent && !isJson) {
        console.log(
          chalk.red.bold(
            `Commit blocked: ${ghostCount} ghost route(s) detected.`,
          ),
        );
        console.log(
          chalk.yellow("Please fix the unmatched routes before committing."),
        );
      }
      process.exit(1); //stop the commit
    }
    //Success
    if (!isSilent && !isJson) {
      console.log("No ghost routes found. Safe to commit! ✅");
    }
    process.exit(0);
  } catch (error) {
    console.error(chalk.red(`Error running Ghostbusters: ${error.message}`));
    process.exit(1);
  }
}

main();
