import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const BIN = join(here, "..", "bin", "shipnotes.js");

let repo;

function git(...args) {
  return execFileSync("git", args, { cwd: repo, encoding: "utf8" });
}

function commit(message) {
  git("commit", "--allow-empty", "-m", message);
}

function run(args, env = {}) {
  return execFileSync(process.execPath, [BIN, "generate", "--repo", repo, ...args], {
    encoding: "utf8",
    // Force the heuristic path: e2e tests must not hit the network.
    env: { ...process.env, ANTHROPIC_API_KEY: "", PATH: process.env.PATH },
  });
}

before(() => {
  repo = mkdtempSync(join(tmpdir(), "shipnotes-e2e-"));
  execFileSync("git", ["init", "-q", "-b", "main"], { cwd: repo });
  git("config", "user.email", "test@example.com");
  git("config", "user.name", "Test");

  writeFileSync(join(repo, "README.md"), "# fixture\n");
  git("add", ".");
  commit("chore: initial commit");
  git("tag", "v1.0.0");
  commit("feat: add CSV export");
  commit("fix(auth): handle expired session tokens");
  commit("perf: cache parsed git log");
  commit("chore: bump dependencies");
  commit("feat!: drop support for Node 14");
});

after(() => {
  rmSync(repo, { recursive: true, force: true });
});

test("generates markdown since the latest tag", () => {
  const out = run(["--no-llm"]);
  assert.match(out, /^# .* — release notes/);
  assert.match(out, /## Breaking Changes/);
  assert.match(out, /Drop support for Node 14/);
  assert.match(out, /## Features/);
  assert.match(out, /Add CSV export/);
  assert.match(out, /## Fixes/);
  assert.match(out, /Handle expired session tokens/);
  assert.match(out, /## Improvements/);
  // internal chores excluded by default
  assert.doesNotMatch(out, /bump dependencies/i);
  // initial commit is before the tag
  assert.doesNotMatch(out, /initial commit/);
});

test("--since-tag overrides the detected tag", () => {
  const out = run(["--no-llm", "--since-tag", "v1.0.0"]);
  assert.match(out, /Add CSV export/);
});

test("--all includes internal commits", () => {
  const out = run(["--no-llm", "--all"]);
  assert.match(out, /## Internal/);
  assert.match(out, /Bump dependencies/);
});

test("html format produces a standalone page", () => {
  const out = run(["--no-llm", "--format", "html"]);
  assert.match(out, /^<!doctype html>/);
  assert.match(out, /<h2>Features<\/h2>/);
  assert.match(out, /Add CSV export/);
});

test("without ANTHROPIC_API_KEY it degrades to heuristics (no crash)", () => {
  // no --no-llm flag: the key is blanked in run(), so the CLI must warn and continue
  const out = run([]);
  assert.match(out, /Add CSV export/);
});

test("non-repo path exits with error", () => {
  const dir = mkdtempSync(join(tmpdir(), "shipnotes-notrepo-"));
  try {
    assert.throws(() =>
      execFileSync(process.execPath, [BIN, "generate", "--repo", dir], { encoding: "utf8" }),
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
