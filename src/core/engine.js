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
 * @param {EngineOptions} opts
 * @returns {Promise<import("./types.js").GhostbusterReport>}
 */
export async function runGhostbuster(opts) {
  const ignore = opts.ignore || ["**/node_modules/**", "**/dist/**"];

  const frontendFiles = await glob(opts.frontendGlobs, { ignore });
  const backendFiles = await glob(opts.backendGlobs, { ignore });

  console.log(`Found ${frontendFiles.length} frontend file(s)`);
  console.log(`Found ${backendFiles.length} backend file(s)`);

  const calls = (await Promise.all(frontendFiles.map(parseFrontend))).flat();
  const backendItems = (await Promise.all(backendFiles.map(parseBackend))).flat();

  // Ignore MOUNT_POINT objects for now (until you fully support prefix resolving)
  const routesOnly = backendItems.filter(
    (r) => typeof r.method === "string" && typeof r.path === "string"
  );

  const result = matchRoutes(calls, routesOnly);

  return {
    ...result,
    stats: {
      frontendCalls: calls.length,
      backendRoutes: routesOnly.length,
      matched: result.matched.length,
      unmatched: result.unmatched.length,
      unknown: result.unknown.length,
    },
  };
}
