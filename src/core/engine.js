// src/core/engine.js
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
  const calls = await parseFrontend(opts.frontendGlobs, opts.ignore);
  const routes = await parseBackend(opts.backendGlobs, opts.ignore);

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
