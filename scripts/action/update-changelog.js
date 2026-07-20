import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { pathToFileURL } from "node:url";

/**
 * Merge freshly generated release notes into a changelog document.
 *
 * The notes (as produced by `shipnotes generate`) start with a `# <title>`
 * heading; every heading is demoted one level so the release nests under the
 * changelog's own `# Changelog` header. If a section for the same release
 * already exists it is replaced in place (re-running for a tag is idempotent);
 * otherwise the new release is inserted right below the top-level header, so
 * the newest release always comes first.
 */
export function mergeChangelog(notesMd, existing = "") {
  const notes = String(notesMd).trim();
  const titleMatch = notes.match(/^# (.+)$/m);
  if (!titleMatch) throw new Error("notes must start with a '# <title>' heading");
  const title = titleMatch[1].trim();
  const section = notes.replace(/^(#{1,5}) /gm, "$1# ");

  const changelog = String(existing ?? "").trim() || "# Changelog";
  const lines = changelog.split("\n");

  const heading = `## ${title}`;
  const start = lines.findIndex((line) => line.trim() === heading);
  if (start !== -1) {
    let end = lines.findIndex((line, i) => i > start && /^## /.test(line));
    if (end === -1) end = lines.length;
    lines.splice(start, end - start, ...section.split("\n"), "");
  } else {
    let insertAt = lines.findIndex((line) => /^# /.test(line));
    insertAt = insertAt === -1 ? 0 : insertAt + 1;
    lines.splice(insertAt, 0, "", ...section.split("\n"));
  }
  return lines.join("\n").trim() + "\n";
}

const invokedDirectly =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  const [notesFile, changelogFile = "CHANGELOG.md"] = process.argv.slice(2);
  if (!notesFile) {
    process.stderr.write("usage: update-changelog.js <notes.md> [changelog-file]\n");
    process.exit(2);
  }
  const notes = readFileSync(notesFile, "utf8");
  const existing = existsSync(changelogFile) ? readFileSync(changelogFile, "utf8") : "";
  writeFileSync(changelogFile, mergeChangelog(notes, existing));
  process.stderr.write(`shipnotes: updated ${changelogFile}\n`);
}
