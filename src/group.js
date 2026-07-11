const CONVENTIONAL = /^(\w+)(\([^)]*\))?(!)?:\s*(.+)$/;

const TYPE_TO_SECTION = {
  feat: "features",
  feature: "features",
  fix: "fixes",
  bugfix: "fixes",
  hotfix: "fixes",
  revert: "fixes",
  perf: "improvements",
  refactor: "improvements",
  style: "internal",
  docs: "internal",
  doc: "internal",
  test: "internal",
  tests: "internal",
  chore: "internal",
  ci: "internal",
  build: "internal",
  release: "internal",
};

// Commits nobody wants in customer-facing notes.
const NOISE = /^(wip|merge|bump|bumping|release|releasing|version|v\d+\.\d+|update (deps|dependencies|lockfile)|\d+\.\d+\.\d+)\b/i;

const FEATURE_HINT = /^(add|adds|added|introduce|introduces|implement|implements|support|supports|allow|allows|enable|enables|new)\b/i;
const FIX_HINT = /^(fix|fixes|fixed|resolve|resolves|resolved|correct|corrects|repair|patch)\b|\bbug\b/i;

function cleanSubject(subject) {
  const trimmed = subject.replace(/\.+$/, "").trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/**
 * Classify one commit. Returns {section, text} where section is one of
 * breaking | features | fixes | improvements | internal | skip.
 */
export function classify(commit) {
  const { subject, body } = commit;
  const m = subject.match(CONVENTIONAL);

  if (m) {
    const [, type, , bang, rest] = m;
    const breaking = Boolean(bang) || /BREAKING[ -]CHANGE/i.test(body);
    const section = breaking ? "breaking" : TYPE_TO_SECTION[type.toLowerCase()] ?? "improvements";
    return { section, text: cleanSubject(rest) };
  }

  if (/BREAKING[ -]CHANGE/i.test(body)) return { section: "breaking", text: cleanSubject(subject) };
  if (NOISE.test(subject)) return { section: "skip", text: cleanSubject(subject) };
  if (FIX_HINT.test(subject)) return { section: "fixes", text: cleanSubject(subject) };
  if (FEATURE_HINT.test(subject)) return { section: "features", text: cleanSubject(subject) };
  return { section: "improvements", text: cleanSubject(subject) };
}

/**
 * Group commits into release-note sections. Each entry keeps the source
 * commit hash so an LLM rewrite pass can be mapped back reliably.
 */
export function groupCommits(commits, { includeInternal = false } = {}) {
  const groups = { breaking: [], features: [], fixes: [], improvements: [], internal: [] };

  for (const commit of commits) {
    const { section, text } = classify(commit);
    if (section === "skip") continue;
    if (section === "internal" && !includeInternal) continue;
    groups[section].push({ text, hash: commit.shortHash, author: commit.author, date: commit.date });
  }

  return groups;
}

export const SECTION_TITLES = {
  breaking: "Breaking Changes",
  features: "Features",
  fixes: "Fixes",
  improvements: "Improvements",
  internal: "Internal",
};

export function isEmpty(groups) {
  return Object.values(groups).every((entries) => entries.length === 0);
}
