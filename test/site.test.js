import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = join(root, "site");

test("npm run site assembles a self-contained landing page", () => {
  const out = execFileSync(process.execPath, [join(root, "scripts", "make-site.js")], {
    encoding: "utf8",
  });
  assert.match(out, /site\/ ready/);

  // example.html is real CLI output: grouped sections, no LLM, escaped HTML.
  const example = readFileSync(join(SITE, "example.html"), "utf8");
  assert.match(example, /<title>acme-app v1\.5\.0<\/title>/);
  assert.match(example, /Breaking Changes/);
  assert.match(example, /Features/);
  assert.match(example, /Fixes/);
  assert.match(example, /Improvements/);
  assert.match(example, /dark mode/);
  assert.doesNotMatch(example, /chore/i, "internal commits must be filtered out");

  // demo.svg must be an exact copy of the README demo.
  const siteDemo = readFileSync(join(SITE, "demo.svg"), "utf8");
  const docsDemo = readFileSync(join(root, "docs", "demo.svg"), "utf8");
  assert.equal(siteDemo, docsDemo);

  // index.html references only assets that exist (make-site enforces this,
  // but assert the two we depend on are actually referenced).
  const index = readFileSync(join(SITE, "index.html"), "utf8");
  assert.match(index, /src="demo\.svg"/);
  assert.match(index, /src="example\.html"/);
});
