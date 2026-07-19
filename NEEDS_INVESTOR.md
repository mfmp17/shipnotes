# Needs Investor

Items the founder-agent cannot do alone. Each entry has exact steps.

## [2026-07-12] Anthropic API key for the LLM rewrite pass — STATUS: DONE (2026-07-19)

Fred stored the key in the macOS login Keychain (service `shipnotes-anthropic`);
`scripts/daily-run.sh` exports it at session launch, so no `.env` file exists.
Verified live 2026-07-19: the rewrite pass ran against a real local repo with
`claude-opus-4-8` and produced customer-friendly notes (it also dropped the two
most internal-sounding entries — by design, but watch entry counts in demos).
Original ask kept below for the record.

The CLI is working end-to-end, but its core differentiator — rewriting raw
commits into customer-friendly language with Claude — needs an API key to
run and demo. Cost is tiny: a typical release (30–50 commits) is roughly a
cent or two per run at current pricing.

Exact steps:
1. Go to https://platform.claude.com → create/sign in to an account.
2. Create an API key (Settings → API keys). Optional but recommended: create
   it inside a dedicated workspace with a small monthly spend limit ($5–10)
   so the cost is hard-capped no matter what.
3. Store the key in the macOS login Keychain (the command prompts for the
   key, so it never touches shell history or any file in this repo):
   `security add-generic-password -a "$USER" -s shipnotes-anthropic -w`
   The daily session reads it from the Keychain at launch (see
   `scripts/daily-run.sh`); no `.env` file needed.

Once present I'll verify the rewrite quality on real repos and record the
demo for the README/landing page.

## [2026-07-12] npm account to publish the `shipnotes` package — STATUS: DONE (2026-07-19)

Fred created the account (`mfmp17`, 2FA enabled) and completed `npm login` —
`npm whoami` confirms, token in `~/.npmrc` (0600). Registry note: the name
`shipnotes` shows "Unpublished on 2025-10-26" — past the 24h reuse block, so
it should be claimable; if publish is rejected for name similarity, fall back
to `@mfmp17/shipnotes`. Original ask kept below for the record.

Phase 1 starts with publishing the CLI to npm so anyone can run
`npx shipnotes generate`. Interim workaround is already live — the site and
README advertise `npx github:mfmp17/shipnotes generate`, which works today —
but the short npm name is what we launch on. I won't publish until the LLM
rewrite is verified live (needs the API key above), but having the account
ready removes the next blocker. Free, ~3 minutes:

1. Go to https://www.npmjs.com/signup → create an account (any username;
   the package name `shipnotes` is claimed at publish time).
2. Enable 2FA when prompted (npm requires it for publishing).
3. Run `npm login` inside `~/ventures/shipnotes` and complete the browser
   prompt — that stores an auth token in `~/.npmrc` and I can publish from
   here on my own.

## [2026-07-13] GitHub account/repo to host the code + landing page — STATUS: DONE (2026-07-14)

Fred ran `gh auth login` as `mfmp17` — that was all I needed. I created the
public repo myself, pushed the code, and deployed the landing page:
code https://github.com/mfmp17/shipnotes · site https://mfmp17.github.io/shipnotes/

Original ask kept below for the record.

The landing page is built (`site/`, see today's journal entry) and the code
is launch-ready, but both need a public home. One free GitHub repo solves
three things at once: the "Show HN"/Product Hunt link target, free hosting
for the landing page (GitHub Pages), and the open-source credibility the
free tier sells on. Free, ~5 minutes:

1. Sign in / create an account at https://github.com (the local git user is
   already `mfmp17` — if that's yours, just use it).
2. Create a public repo named `shipnotes` (no README/license — we have both).
3. Run `gh auth login` (or add an SSH key), then tell me the repo URL in
   this file — I'll push, enable Pages for `site/`, and wire the links.

Not urgent-blocking: tomorrow's work (launch copy drafts) needs no accounts.

<!--
Format:
## [DATE] Short title — STATUS: OPEN | DONE
Why it's needed, exact steps for Fred, where to put the result (e.g. which
env var or file).
-->
