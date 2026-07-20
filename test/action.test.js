import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { mergeChangelog } from "../scripts/action/update-changelog.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const NOTES_V2 = `# v2.0.0

_2026-07-20_

## Features

- Add CSV export (\`abc1234\`)

## Fixes

- Handle expired session tokens (\`def5678\`)
`;

test("mergeChangelog creates a changelog from scratch", () => {
  const out = mergeChangelog(NOTES_V2, "");
  assert.match(out, /^# Changelog\n/);
  // every heading demoted one level so releases nest under the header
  assert.match(out, /\n## v2\.0\.0\n/);
  assert.match(out, /\n### Features\n/);
  assert.match(out, /Add CSV export/);
});

test("mergeChangelog puts the newest release first", () => {
  const existing = mergeChangelog(NOTES_V2.replaceAll("v2.0.0", "v1.0.0"), "");
  const out = mergeChangelog(NOTES_V2, existing);
  const v2 = out.indexOf("## v2.0.0");
  const v1 = out.indexOf("## v1.0.0");
  assert.ok(v2 !== -1 && v1 !== -1 && v2 < v1, `expected v2 before v1 in:\n${out}`);
});

test("mergeChangelog replaces an existing section for the same release", () => {
  const notesV1 = NOTES_V2.replaceAll("v2.0.0", "v1.0.0").replace("Add CSV export", "Add dark mode");
  const existing = mergeChangelog(NOTES_V2, mergeChangelog(notesV1, ""));
  const rerun = NOTES_V2.replace("Add CSV export", "Add CSV and JSON export");
  const out = mergeChangelog(rerun, existing);
  assert.equal(out.match(/## v2\.0\.0/g).length, 1, "re-running for a tag must not duplicate its section");
  assert.match(out, /Add CSV and JSON export/);
  assert.doesNotMatch(out, /Add CSV export \(/);
  assert.match(out, /## v1\.0\.0/, "other releases survive the replacement");
  assert.match(out, /Add dark mode/, "other releases keep their entries");
});

test("mergeChangelog rejects notes without a title heading", () => {
  assert.throws(() => mergeChangelog("just some text\n"), /title/);
});

test("action.yml only references files that exist", () => {
  const action = readFileSync(join(root, "action.yml"), "utf8");
  const refs = [...action.matchAll(/\$GITHUB_ACTION_PATH\/(\S+)/g)].map((m) => m[1].replace(/["')\]]+$/, ""));
  assert.ok(refs.length >= 2, "expected the action to run files from the repo");
  for (const ref of refs) {
    assert.ok(existsSync(join(root, ref)), `action.yml references missing file: ${ref}`);
  }
});
