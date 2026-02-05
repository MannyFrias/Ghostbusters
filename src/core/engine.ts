// src/core/engine.ts
import { GhostbusterReport } from "./types";
import { matchRoutes } from "./matcher";
//import { parseFrontend } from "../parsers/frontend";
//import { parseBackend } from "../parsers/backend";

// Engine options type
export type EngineOptions = {
  frontendGlobs: string[];
  backendGlobs: string[];
  ignore?: string[];
};
// Main engine function
export async function runGhostbuster(opts: EngineOptions): Promise<GhostbusterReport> {
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
