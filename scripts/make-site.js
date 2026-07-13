#!/usr/bin/env node
// Assembles the deployable landing page in site/ from real artifacts:
//   site/index.html    — hand-written (this script only sanity-checks it)
//   site/demo.svg      — copy of docs/demo.svg (the README terminal demo)
//   site/example.html  — actual `shipnotes generate --format html` output,
//                        run against the shared fixture repo
// Like the demo, the example can never lie or go stale: it is regenerated
// from a real CLI run every time.

import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, readFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildFixtureRepo } from "./fixture-repo.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const SITE = join(root, "site");
const BIN = join(root, "bin", "shipnotes.js");
const TMP = join(root, ".site-tmp");
const FIXTURE = join(TMP, "acme-app");

const INDEX = join(SITE, "index.html");
if (!existsSync(INDEX)) {
  throw new Error("site/index.html is missing — it is hand-written, not generated");
}

// 1. demo.svg — reuse the README demo so the two never diverge.
const demoSrc = join(root, "docs", "demo.svg");
if (!existsSync(demoSrc)) {
  throw new Error("docs/demo.svg is missing — run `npm run demo` first");
}
copyFileSync(demoSrc, join(SITE, "demo.svg"));

// 2. example.html — a real CLI run in HTML mode.
buildFixtureRepo(FIXTURE);
const run = spawnSync(
  process.execPath,
  [
    BIN, "generate",
    "--repo", FIXTURE,
    "--no-llm", "--no-hashes",
    "--format", "html",
    "--title", "acme-app v1.5.0",
    "-o", join(SITE, "example.html"),
  ],
  { encoding: "utf8", env: { ...process.env, ANTHROPIC_API_KEY: "" } },
);
rmSync(TMP, { recursive: true, force: true });
if (run.status !== 0) {
  console.error(run.stderr || run.stdout);
  throw new Error(`shipnotes exited with ${run.status}`);
}

// 3. Sanity: every local asset index.html references must exist.
const html = readFileSync(INDEX, "utf8");
const refs = [...html.matchAll(/(?:src|href)="(?!https?:|#|mailto:)([^"]+)"/g)]
  .map((m) => m[1].split(/[?#]/)[0]);
for (const ref of refs) {
  if (!existsSync(join(SITE, ref))) {
    throw new Error(`site/index.html references missing file: ${ref}`);
  }
}

console.log(`site/ ready: index.html + demo.svg + example.html (checked ${refs.length} local refs)`);
