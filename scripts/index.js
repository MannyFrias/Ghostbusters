const { scan } = require('../src/index');

// Tells the tool what to look at in the repo that gets checked
// Will need to adjust paths to point to app being tested, not our tool's own source code
const CONFIG = {
    frontendGlobs: ['./src/frontend/**/*.js'],  // Do we need a File Walker to create a list of actual files?
    backendGlobs: ['./src/backend/**/*.js']
}

async function catchGhost() {
    console.log("Ghostbuster: Looking for unmatched routes...");

    try {
        // Calls the engine
        const report = await scan(CONFIG);
        // Logs stats
        console.table(report.stats);
        // Handles ghost routes
        if (report.unmatched.length > 0) {
            console.error("Found ghost routes:");

            report.unmatched.forEach((ghost) => {
                // Uses data from parser
                console.error(`[${ghost.method}] ${ghost.route}`);
                console.error(` Source: ${ghost.file} (Line ${ghost.line})`);
            })
            // Stops the process with an error code
            process.exit(1);
        }
        // If this line is reached, everything is good
        console.log("Success: No ghost routes found!");
        process.exit(0);
    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
}
// Calls the function
catchGhost();

// OLD
/*
//#!/usr/bin/env node
// const { scan } = require('../src/index')
// scan();
*/