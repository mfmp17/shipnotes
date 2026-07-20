import { execFileSync } from "node:child_process";

const FIELD = "\x1f";
const RECORD = "\x1e";

/**
 * Read commits from a git repository as structured objects.
 * Range semantics match `git log`: `from..to` when `from` is given,
 * otherwise the full history reachable from `to`.
 */
export function readCommits({ repo = ".", from = null, to = "HEAD" } = {}) {
  const range = from ? `${from}..${to}` : to;
  const format = ["%H", "%h", "%an", "%aI", "%s", "%b"].join(FIELD);
  const out = execFileSync(
    "git",
    ["log", "--no-merges", `--pretty=format:${format}${RECORD}`, range],
    { cwd: repo, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
  );

  return out
    .split(RECORD)
    .map((rec) => rec.replace(/^\n/, ""))
    .filter((rec) => rec.trim().length > 0)
    .map((rec) => {
      const [hash, shortHash, author, date, subject, body = ""] = rec.split(FIELD);
      return {
        hash,
        shortHash,
        author,
        date,
        subject: subject.trim(),
        body: body.trim(),
      };
    });
}

/**
 * Most recent tag reachable from `to`, or null if there is none.
 * If `to` itself is tagged (e.g. running right after `git tag v2`, or in CI
 * on a tag push), that tag names the release being described — so the range
 * should start at the tag *before* it, not collapse to nothing.
 */
export function latestTag(repo = ".", to = "HEAD") {
  const tag = describe(repo, to);
  if (tag === null) return null;
  if (revision(repo, tag) === revision(repo, to)) {
    return describe(repo, `${to}^`);
  }
  return tag;
}

function describe(repo, ref) {
  try {
    return execFileSync("git", ["describe", "--tags", "--abbrev=0", ref], {
      cwd: repo,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

function revision(repo, ref) {
  try {
    return execFileSync("git", ["rev-parse", `${ref}^{commit}`], {
      cwd: repo,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

/** True if `path` is inside a git work tree. */
export function isGitRepo(repo = ".") {
  try {
    execFileSync("git", ["rev-parse", "--is-inside-work-tree"], {
      cwd: repo,
      stdio: "ignore",
    });
    return true;
  } catch {
    return false;
  }
}
