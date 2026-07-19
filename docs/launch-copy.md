# Launch copy drafts

Links:
- Product: https://mfmp17.github.io/shipnotes/
- Code: https://github.com/mfmp17/shipnotes

## Show HN

Title: Show HN: ShipNotes — release notes generated from your git log

Body:

I built ShipNotes because my changelogs kept going stale. It reads the commits
since your last release tag, groups them into Breaking Changes / Features /
Fixes / Improvements, filters out version bumps and chores, and prints clean
Markdown or a standalone HTML page.

Try it on any repo:

    npx @mfmp17/shipnotes generate

It runs locally, needs no signup, and works offline. Conventional commits map
directly to sections; plain subject lines are classified heuristically. If you
set ANTHROPIC_API_KEY, an optional Claude pass rewrites the grouped entries
into benefit-first customer language and merges duplicates — without the key
you still get the grouped notes.

The site demo and example page are generated from real CLI runs at build time,
so they cannot drift from what the tool actually outputs:
https://mfmp17.github.io/shipnotes/

Code is MIT: https://github.com/mfmp17/shipnotes

First comment:

Happy to answer questions. A few implementation notes:

- Range detection is just `git describe --tags --abbrev=0`, so it works with
  existing tag-based release habits; `--since-tag`/`--from`/`--to` override it.
- Output is Markdown by default, `--format html` gives a dependency-free page
  you can host anywhere.
- The LLM rewrite is strictly optional and fails open: API errors fall back to
  the heuristic grouping rather than losing your notes.
- Next step is a GitHub App that opens a release-notes PR on each tag, so the
  notes write themselves as part of the release flow.

## Product Hunt

Tagline: Release notes straight from your git log

Description:

ShipNotes turns the commits since your last release into polished,
customer-facing release notes. One local command groups Breaking Changes,
Features, Fixes and Improvements, drops internal noise, and outputs Markdown
or a ready-to-host HTML page. Free, open source, no signup; optional Claude
rewrite with your own API key.

First comment:

Maker here. ShipNotes started from a simple itch: we shipped constantly, but
writing release notes was always the task that got skipped. The CLI is the
free wedge: point it at a repo and it produces publishable notes from the git
history you already have. The demo and example on the landing page are real
CLI output regenerated at build time. Pro (coming next) is the automation
layer: a GitHub App that opens a release-notes PR on every tag, plus a hosted
always-current changelog page — free for public repos, $9/mo per private repo.
Feedback very welcome.

## X thread

1/ Your changelog should not be a writing assignment. ShipNotes reads the
commits since your last release tag and turns them into customer-facing
release notes. One command, runs locally, MIT licensed.

2/ Try it on any repo:

npx @mfmp17/shipnotes generate

No signup. No config. No commit-message policing.

3/ Out of the box you get grouped sections: Breaking Changes, Features, Fixes,
Improvements. Version bumps, merges, chores and CI noise are filtered out.

4/ Output is Markdown for your CHANGELOG, or `--format html` for a standalone
page you can host anywhere. The example on the site is real CLI output,
regenerated every build: https://mfmp17.github.io/shipnotes/

5/ Optional upgrade: set ANTHROPIC_API_KEY and a Claude pass rewrites the
entries into benefit-first customer language, merges duplicates, and drops
changes users will never notice. No key? You still get clean grouped notes.

6/ Next: a GitHub App that opens a release-notes PR automatically on every
tag. Free for public repos; $9/mo per private repo is the v1 Pro hypothesis.

7/ Code is open: https://github.com/mfmp17/shipnotes — issues, ideas and
roasts welcome.

## Launch checklist

- [x] Confirm npm publish is done and the short command works:
      `npx @mfmp17/shipnotes generate` (2026-07-19)
- [x] Swap the install command in this file, README and site to
      `npx @mfmp17/shipnotes generate` (2026-07-19)
- [x] Regenerate demo + site (`npm run demo && npm run site`) and push
      (2026-07-19)
- [ ] Post Show HN between 08:00 and 10:00 ET on a weekday
- [ ] Post the X thread and reply with the repo link
- [ ] Schedule Product Hunt for 00:01 PT on a Tuesday/Wednesday
