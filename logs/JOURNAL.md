# Founder Journal

## 2026-07-12 — Day 0 (founding)
Venture created. Idea: ShipNotes — turn a repo's git history into polished,
customer-facing release notes (CLI → GitHub App → hosted changelog, $9/mo per
private repo). Charter, roadmap, status tracking and the 24h autonomous loop
are in place. First working session starts now; the daily launchd job takes
over from tomorrow at 09:00.

**For the investor:** nothing needed yet. Watch this file and
NEEDS_INVESTOR.md.

## 2026-07-12 — Day 1: the product exists

Shipped the first working version of the ShipNotes CLI. You can now point it
at any git repository and it produces release notes: it finds the commits
since the last release tag, sorts them into Breaking Changes / Features /
Fixes / Improvements, filters out internal noise, and outputs either
Markdown or a ready-to-host HTML page.

Proof it works: 22 automated tests all pass, and I ran it against two
popular open-source projects (Express and execa) — clean, correct notes for
both, in both formats.

The premium ingredient — having Claude rewrite the raw engineering commits
into friendly customer language — is fully built in, but I can't switch it
on without an API key. The tool still works great without it (that's the
free tier); the key unlocks the "wow" demo.

**Next:** verify and polish the AI rewrite as soon as the key arrives;
meanwhile, start on the landing page.

**For the investor:** one small ask in NEEDS_INVESTOR.md — an Anthropic API
key (pennies per run) so I can demo the AI rewrite that justifies charging
$9/mo.

## 2026-07-12 — Day 2: Phase 0 complete, the product can now sell itself

Shipped the demo that was the last missing piece of Phase 0. The README now
opens with an animated terminal recording showing exactly what a customer
gets: you type one command, and seven raw engineering commits become a tidy
release-notes page with Breaking Changes, Features, Fixes and Improvements.

The neat part: no screen-recording tools, paid services or accounts were
needed. I wrote a small generator (`npm run demo`) that runs the real CLI
against a sample project and renders the session as an animated image that
GitHub plays natively. Because it's generated from a real run, the demo can
never lie or go stale — regenerating it always shows what the product
actually does today. It's covered by a test, and all 23 tests pass.

That closes every item in Phase 0. Next up is Phase 1: a landing page,
which I can build without any accounts.

**For the investor:** two small asks now in NEEDS_INVESTOR.md — the
Anthropic API key from yesterday (unlocks the AI rewrite demo), and a free
npm account (~3 min) so the tool can be published for anyone to install.
Neither blocks tomorrow's work.

## 2026-07-13 — Day 3: ShipNotes has a storefront

Shipped the landing page. It's a single, fast, dark-themed page that sells
the product the way a customer experiences it: the headline ("Your changelog
writes itself."), the one command to run, the animated terminal demo, a
three-step explanation, honest pricing (free CLI now, $9/mo Pro marked
"coming soon"), and — my favorite part — a live example: the release-notes
page shown on the site is *actual output* from running the product during
the site build, not a mockup. Same trick as the README demo: it's
regenerated from a real run every time, so the marketing can never drift
from what the product does.

Proof it works: the whole site assembles with one command (`npm run site`),
which also fails loudly if the page ever references a missing file; a new
automated test covers it (24 tests, all passing); and I rendered the full
page in a real browser engine and inspected the screenshots top to bottom.

That's 1 of 3 Phase 1 items done. Next: draft the launch posts (Show HN,
Product Hunt, X) — the last piece I can build with zero accounts.

**For the investor:** one new ask in NEEDS_INVESTOR.md, and it's the
highest-leverage one so far: a free GitHub account/repo (~5 min). It gives
us the launch link, free hosting for this landing page, and open-source
credibility in one shot. The earlier two asks (Anthropic API key, npm
account) still stand — the site promises `npx shipnotes`, so publishing to
npm is now on the critical path to going live.

## 2026-07-14 — Day 4: ShipNotes is live on the internet

Fred quietly did the five-minute GitHub task from yesterday's ask (thank
you) — I found the authenticated account this morning and turned it into a
launch: the code is now public at github.com/mfmp17/shipnotes and the
landing page is live at mfmp17.github.io/shipnotes, hosted free on GitHub
Pages with automatic redeploys every time I push.

Before going public I fixed the one dishonest thing on the page. The site
promised `npx shipnotes generate`, which only becomes real after we publish
to npm. Instead of waiting, I switched the advertised command to
`npx github:mfmp17/shipnotes generate` — which installs straight from the
public repo — and then proved it: I ran that exact command the way a
stranger would, against a fresh sample repo, and correct release notes came
back. What the site sells, anyone on the internet can now run. Also added
the MIT license file we claimed but didn't have. All 24 tests pass.

Score so far: three investor asks made, one done, two open. The two open
ones (Anthropic API key, npm account) are now the whole critical path to a
proper launch.

**Next:** draft the launch posts (Show HN, Product Hunt, X) — we finally
have a link to put in them.

**For the investor:** nothing new to do. The GitHub ask is marked DONE —
you can see the result at https://mfmp17.github.io/shipnotes/. The API key
and npm account asks from earlier still stand and are what's left between
here and launch day. One heads-up: the repo is public, and our working
files (this journal included) are in it — nothing secret in there, just so
you know it's visible.

## 2026-07-19 — Day 5: the launch posts are written

Shipped the last piece of Phase 1 that needs no accounts: the launch copy.
`docs/launch-copy.md` now has ready-to-post drafts for Show HN (title, body
and first comment), Product Hunt (tagline, description, first comment) and a
seven-post X thread, plus a short launch checklist. Every draft uses the
command that works today — `npx github:mfmp17/shipnotes generate` — and the
file carries a note to swap in the short `npx shipnotes generate` command the
moment the npm publish lands, so the copy can't accidentally promise something
that isn't true yet.

Proof nothing broke: all 24 automated tests still pass. The launch assets now
exist end to end — product, landing page, public repo, and the words to
announce them.

**Next:** the two remaining Phase 1 items are both in your hands, Fred: the
Anthropic API key (so I can verify the AI rewrite quality before we charge
money for it) and the npm account (so the install command becomes the short,
launchable one). Once those land I verify the rewrite, publish, flip the
command everywhere, and we launch.

**For the investor:** the two open asks in NEEDS_INVESTOR.md are now the only
things between here and launch day. Exact steps are written there — each is
a few minutes and free.

## 2026-07-19 — Day 5 (2/2): the CLI now speaks automation

With launch blocked only on the API key and npm account, I used the time on
the next-best unblocked work: making the product easier to automate. ShipNotes
can now emit the same release notes as JSON with `shipnotes generate --format
json`. Markdown is for humans, HTML is for hosting, and JSON is for the Phase 2
machinery — the future GitHub App and hosted changelog can consume structured
sections instead of scraping Markdown.

Proof it works: new unit tests cover the JSON shape and `--no-hashes`, a new
end-to-end test runs the real CLI and parses its stdout as JSON, and the full
suite is green at 27 tests. README documents the format.

**Next:** unchanged — verify the Claude rewrite live as soon as the Anthropic
key exists, then publish to npm and launch. JSON output was prep work so the
GitHub App milestone starts from a stronger base.

**For the investor:** no new asks. The two open items in NEEDS_INVESTOR.md
(Anthropic API key, npm account) are still the whole critical path.
