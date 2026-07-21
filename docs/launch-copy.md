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

There's also a GitHub Action (`uses: mfmp17/shipnotes@v1`): push a release
tag and it opens a PR updating your CHANGELOG.md with that release's notes.
Set it up once and the changelog maintains itself — ShipNotes' own changelog
is written this way, by its own Action.

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
- The Action is a composite action, no hosting or registration behind it: it
  runs the same CLI on the runner and opens the PR with the workflow's own
  GITHUB_TOKEN. Proof it works: our repo's CHANGELOG.md is maintained by it
  (https://github.com/mfmp17/shipnotes/pull/1 was its first PR).
- Next step is a hosted always-current changelog page (the CLI already emits
  JSON as the feed for it).

## Product Hunt

Tagline: Release notes straight from your git log

Description:

ShipNotes turns the commits since your last release into polished,
customer-facing release notes. One local command groups Breaking Changes,
Features, Fixes and Improvements, drops internal noise, and outputs Markdown
or a ready-to-host HTML page — or add the GitHub Action and get a changelog
PR automatically on every release tag. Free, open source, no signup;
optional Claude rewrite with your own API key.

First comment:

Maker here. ShipNotes started from a simple itch: we shipped constantly, but
writing release notes was always the task that got skipped. The CLI is the
free wedge: point it at a repo and it produces publishable notes from the git
history you already have. The automation layer is live too: a GitHub Action
(`uses: mfmp17/shipnotes@v1`) that opens a changelog PR on every release tag —
our own changelog is written by it. The demo and example on the landing page
are real CLI output regenerated at build time. Coming next: a hosted,
always-current changelog page — also free. ShipNotes is free, always.
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

6/ Don't want to run anything? Add the GitHub Action once:

uses: mfmp17/shipnotes@v1

Every release tag you push opens a PR updating your CHANGELOG.md. Our own
changelog is maintained this way — by our own Action.

7/ Everything is free, always — public or private repos, CLI and Action, and
the hosted changelog page that's coming next. Code is MIT:
https://github.com/mfmp17/shipnotes — issues, ideas and roasts welcome.

## Launch checklist

- [x] Confirm npm publish is done and the short command works:
      `npx @mfmp17/shipnotes generate` (2026-07-19)
- [x] Swap the install command in this file, README and site to
      `npx @mfmp17/shipnotes generate` (2026-07-19)
- [x] Regenerate demo + site (`npm run demo && npm run site`) and push
      (2026-07-19)
- [x] Copy + site advertise the GitHub Action; `v1` tag frozen so
      `uses: mfmp17/shipnotes@v1` is stable (2026-07-21)
- [ ] Post Show HN between 08:00 and 10:00 ET on a weekday
- [ ] Post the X thread and reply with the repo link
- [ ] Schedule Product Hunt for 00:01 PT on a Tuesday/Wednesday
