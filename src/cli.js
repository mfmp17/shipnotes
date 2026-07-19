import { parseArgs } from "node:util";
import { readFileSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { readCommits, latestTag, isGitRepo } from "./gitlog.js";
import { groupCommits, isEmpty } from "./group.js";
import { renderMarkdown, renderHtml, renderJson } from "./render.js";
import { hasApiKey, rewriteWithClaude, Anthropic } from "./llm.js";

const HELP = `shipnotes — turn git history into customer-facing release notes

Usage:
  shipnotes generate [options]

Options:
  --since-tag <tag>   Start of the commit range (defaults to the latest tag)
  --from <ref>        Alias for --since-tag (any git ref)
  --to <ref>          End of the commit range (default: HEAD)
  --repo <path>       Path to the git repository (default: current directory)
  --format <fmt>      Output format: md | html | json (default: md)
  -o, --output <file> Write to a file instead of stdout
  --title <title>     Notes title (default: "<repo> — release notes")
  --no-llm            Skip the Claude rewrite pass, use heuristic grouping only
  --model <id>        Claude model for the rewrite pass (default: claude-opus-4-8)
  --all               Include internal changes (chores, docs, CI)
  --no-hashes         Omit commit hashes from the output
  -h, --help          Show this help
  -v, --version       Show version

The LLM rewrite runs only when ANTHROPIC_API_KEY is set; without it,
shipnotes still produces grouped notes from commit messages alone.`;

export async function main(argv = process.argv.slice(2)) {
  let opts;
  try {
    ({ values: opts } = parseArgs({
      args: argv,
      allowPositionals: true,
      options: {
        "since-tag": { type: "string" },
        from: { type: "string" },
        to: { type: "string", default: "HEAD" },
        repo: { type: "string", default: "." },
        format: { type: "string", default: "md" },
        output: { type: "string", short: "o" },
        title: { type: "string" },
        model: { type: "string", default: "claude-opus-4-8" },
        "no-llm": { type: "boolean", default: false },
        all: { type: "boolean", default: false },
        "no-hashes": { type: "boolean", default: false },
        help: { type: "boolean", short: "h", default: false },
        version: { type: "boolean", short: "v", default: false },
      },
    }));
  } catch (err) {
    process.stderr.write(`shipnotes: ${err.message}\n\n${HELP}\n`);
    return 2;
  }

  if (opts.help) {
    process.stdout.write(HELP + "\n");
    return 0;
  }
  if (opts.version) {
    // readFileSync instead of a JSON import: `with { type: "json" }` only
    // parses at runtime on Node >= 20.10, and engines promises 18.3.
    const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
    process.stdout.write(pkg.version + "\n");
    return 0;
  }
  if (!["md", "html", "json"].includes(opts.format)) {
    process.stderr.write(`shipnotes: unknown format "${opts.format}" (expected md, html or json)\n`);
    return 2;
  }

  const repo = resolve(opts.repo);
  if (!isGitRepo(repo)) {
    process.stderr.write(`shipnotes: ${repo} is not a git repository\n`);
    return 2;
  }

  let from = opts["since-tag"] ?? opts.from ?? null;
  let fromNote = "";
  if (!from) {
    from = latestTag(repo);
    fromNote = from
      ? ` (since latest tag ${from})`
      : " (no tags found — using full history)";
  }

  let commits;
  try {
    commits = readCommits({ repo, from, to: opts.to });
  } catch (err) {
    process.stderr.write(`shipnotes: git log failed — ${firstLine(err.message)}\n`);
    return 1;
  }

  if (commits.length === 0) {
    process.stderr.write(`shipnotes: no commits in range${fromNote}\n`);
    return 0;
  }
  process.stderr.write(`shipnotes: ${commits.length} commit(s)${fromNote}\n`);

  let groups = groupCommits(commits, { includeInternal: opts.all });
  if (isEmpty(groups)) {
    process.stderr.write("shipnotes: all commits in range were internal/noise — nothing to publish\n");
    return 0;
  }

  if (!opts["no-llm"]) {
    if (hasApiKey()) {
      try {
        process.stderr.write(`shipnotes: rewriting with ${opts.model}...\n`);
        groups = await rewriteWithClaude(groups, { model: opts.model });
      } catch (err) {
        const reason =
          err instanceof Anthropic.AuthenticationError ? "invalid ANTHROPIC_API_KEY"
          : err instanceof Anthropic.RateLimitError ? "rate limited"
          : err instanceof Anthropic.APIError ? `API error ${err.status ?? ""}`.trim()
          : firstLine(err.message);
        process.stderr.write(`shipnotes: LLM rewrite failed (${reason}) — using heuristic grouping\n`);
      }
    } else {
      process.stderr.write("shipnotes: ANTHROPIC_API_KEY not set — using heuristic grouping (pass --no-llm to silence)\n");
    }
  }

  const title = opts.title ?? `${basename(repo)} — release notes`;
  const now = new Date();
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const renderOpts = { title, date, showHashes: !opts["no-hashes"] };
  const out = opts.format === "html"
    ? renderHtml(groups, renderOpts)
    : opts.format === "json"
      ? renderJson(groups, renderOpts)
      : renderMarkdown(groups, renderOpts);

  if (opts.output) {
    writeFileSync(opts.output, out);
    process.stderr.write(`shipnotes: wrote ${opts.output}\n`);
  } else {
    process.stdout.write(out);
  }
  return 0;
}

function firstLine(s = "") {
  return String(s).split("\n")[0];
}
