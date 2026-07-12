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
