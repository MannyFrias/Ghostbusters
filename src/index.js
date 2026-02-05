const { runGhostbuster } = require('./core/engine');

async function scan(config) {
    return await runGhostbuster(config);
}

module.exports = { scan };


// old code from before UPDATE
/*
const { runEngine } = require('./core/engine');

const scan = () => {
    try {
        console.log("Scanning for ghost routes...");
        runEngine();
        console.log("Success: No ghost routes found.")
        process.exit(0);
    } catch (error) {
        console.error("Error", error.message);
        process.exit(1);
    }
}

// Husky calls this file directly, so the below function call is needed
scan();

module.exports = { scan };
*/