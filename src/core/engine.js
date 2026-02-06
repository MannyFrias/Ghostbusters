// src/core/engine.js
import { glob } from "glob";
import { matchRoutes } from "./matcher.js";
import { parseFrontend } from "../parsers/frontend.js";
import { parseBackend } from "../parsers/backend.js";

/**
 * @typedef {Object} EngineOptions
 * @property {string[]} frontendGlobs
 * @property {string[]} backendGlobs
 * @property {string[]=} ignore
 */

/**
 * Main engine function:
 * 1) parse frontend calls
 * 2) parse backend routes
 * 3) match them
 * 4) return a report + stats
 *
 * @param {EngineOptions} opts
 * @returns {Promise<import("./types.js").GhostbusterReport>}
 */
export async function runGhostbuster(opts) {
  //expand glob file paths
  const frontendFiles = await glob(opts.frontendGlobs, {ignore: opts.ignore || []});
  const backendFiles = await glob(opts.backendGlobs, {ignore: opts.ignore || []});

  console.log(`Found ${frontendFiles.length} frontend file(s)`);
  console.log(`Found ${backendFiles.length} backend file(s)`);

  const calls = [];
  for(const file of frontendFiles) {
    const result = await parseFrontend(file); 
    calls.push(...result); 
  }

  const routes = []; 
  for (const file of backendFiles) {
    const result = await parseBackend(file); 
    routes.push(...result)
  }




  const result = matchRoutes(calls, routes);

  return {
    ...result,
    stats: {
      frontendCalls: calls.length,
      backendRoutes: routes.length,
      matched: result.matched.length,
      unmatched: result.unmatched.length,
      unknown: result.unknown.length,
    },
  };
}
// placeholder file

// const runEngine = () => {
//     console.log("Engine logic is initialized...");
// }

// module.exports = { runEngine };
