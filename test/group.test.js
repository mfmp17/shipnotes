import { test } from "node:test";
import assert from "node:assert/strict";
import { classify, groupCommits, isEmpty } from "../src/group.js";

const commit = (subject, body = "") => ({
  hash: "a".repeat(40),
  shortHash: "abc1234",
  author: "Test",
  date: "2026-07-12T00:00:00+00:00",
  subject,
  body,
});

test("conventional feat goes to features", () => {
  assert.deepEqual(classify(commit("feat: add CSV export")), {
    section: "features",
    text: "Add CSV export",
  });
});

test("conventional fix with scope goes to fixes", () => {
  const { section, text } = classify(commit("fix(auth): handle expired tokens"));
  assert.equal(section, "fixes");
  assert.equal(text, "Handle expired tokens");
});

test("bang marker means breaking", () => {
  assert.equal(classify(commit("feat!: drop Node 14 support")).section, "breaking");
});

test("BREAKING CHANGE in body means breaking", () => {
  const c = commit("refactor: rework config loading", "BREAKING CHANGE: config keys renamed");
  assert.equal(classify(c).section, "breaking");
});

test("chore/docs/ci are internal", () => {
  for (const s of ["chore: update deps", "docs: fix typo", "ci: cache node_modules"]) {
    assert.equal(classify(commit(s)).section, "internal", s);
  }
});

test("perf and refactor are improvements", () => {
  assert.equal(classify(commit("perf: cache git log output")).section, "improvements");
  assert.equal(classify(commit("refactor: split renderer")).section, "improvements");
});

test("non-conventional heuristics", () => {
  assert.equal(classify(commit("Add dark mode toggle")).section, "features");
  assert.equal(classify(commit("Fixed crash on empty input")).section, "fixes");
  assert.equal(classify(commit("Speed up startup by lazy-loading")).section, "improvements");
});

test("noise commits are skipped", () => {
  for (const s of ["wip", "Bump version to 1.2.3", "Release 2.0.0", "1.4.2", "Merge branch main"]) {
    assert.equal(classify(commit(s)).section, "skip", s);
  }
});

test("unknown conventional type falls back to improvements", () => {
  assert.equal(classify(commit("weird: do something")).section, "improvements");
});

test("groupCommits excludes internal by default, includes with flag", () => {
  const commits = [commit("feat: add x"), commit("chore: tidy")];
  const def = groupCommits(commits);
  assert.equal(def.features.length, 1);
  assert.equal(def.internal.length, 0);
  const all = groupCommits(commits, { includeInternal: true });
  assert.equal(all.internal.length, 1);
});

test("groupCommits keeps hash metadata", () => {
  const [entry] = groupCommits([commit("feat: add x")]).features;
  assert.equal(entry.hash, "abc1234");
  assert.equal(entry.author, "Test");
});

test("isEmpty", () => {
  assert.equal(isEmpty(groupCommits([])), true);
  assert.equal(isEmpty(groupCommits([commit("feat: x")])), false);
});
