// Builds the "acme-app" fixture repo that the demo and site generators run
// the real CLI against. Shared so the README demo and the landing-page
// example can never drift apart.

import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";

export function buildFixtureRepo(dir) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });

  const git = (...args) =>
    execFileSync("git", args, { cwd: dir, encoding: "utf8" });
  const commit = (message) => git("commit", "--allow-empty", "-m", message);

  execFileSync("git", ["init", "-q", "-b", "main"], { cwd: dir });
  git("config", "user.email", "demo@shipnotes.dev");
  git("config", "user.name", "ShipNotes Demo");
  git("config", "commit.gpgsign", "false");

  commit("chore: release v1.4.0");
  git("tag", "v1.4.0");
  commit("feat: add dark mode across the dashboard");
  commit("feat(exports): add CSV and Excel export for reports");
  commit("fix: stop the dropdown menu closing while scrolling on mobile");
  commit("fix(billing): correct proration when upgrading mid-cycle");
  commit("perf: load the dashboard twice as fast on large workspaces");
  commit("chore: bump dependencies");
  commit("feat!: remove the legacy v1 API");
}
