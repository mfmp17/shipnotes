import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { latestTag } from "../src/gitlog.js";

let repo;

function git(...args) {
  return execFileSync("git", args, { cwd: repo, encoding: "utf8" });
}

function commit(message) {
  git("commit", "--allow-empty", "-m", message);
}

before(() => {
  repo = mkdtempSync(join(tmpdir(), "shipnotes-gitlog-"));
  execFileSync("git", ["init", "-q", "-b", "main"], { cwd: repo });
  git("config", "user.email", "test@example.com");
  git("config", "user.name", "Test");
});

after(() => {
  rmSync(repo, { recursive: true, force: true });
});

test("latestTag walks the repo's tag history correctly", () => {
  commit("chore: initial commit");
  // No tags at all → null (full history).
  assert.equal(latestTag(repo), null);

  // The only tag points at HEAD → the release has no predecessor → null.
  git("tag", "v1.0.0");
  assert.equal(latestTag(repo), null);

  // HEAD moved past the tag → the tag is the range start.
  commit("feat: add exports");
  commit("fix: handle timeouts");
  assert.equal(latestTag(repo), "v1.0.0");

  // HEAD is tagged again (the tag-push/CI case): the range must start at the
  // previous tag, not collapse to v2.0.0..v2.0.0. Annotated tag on purpose —
  // it must deref to the commit for the comparison to work.
  git("tag", "-a", "v2.0.0", "-m", "release v2");
  assert.equal(latestTag(repo), "v1.0.0");

  // Explicit `to` at a tag behaves the same even when HEAD is elsewhere.
  commit("feat: unreleased work");
  assert.equal(latestTag(repo, "v2.0.0"), "v1.0.0");
  // ...and an untagged `to` still finds the tag before it.
  assert.equal(latestTag(repo), "v2.0.0");
});
