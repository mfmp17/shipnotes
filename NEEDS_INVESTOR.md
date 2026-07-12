# Needs Investor

Items the founder-agent cannot do alone. Each entry has exact steps.

## [2026-07-12] Anthropic API key for the LLM rewrite pass — STATUS: OPEN

The CLI is working end-to-end, but its core differentiator — rewriting raw
commits into customer-friendly language with Claude — needs an API key to
run and demo. Cost is tiny: a typical release (30–50 commits) is roughly a
cent or two per run at current pricing.

Exact steps:
1. Go to https://platform.claude.com → create/sign in to an account.
2. Create an API key (Settings → API keys).
3. Create the file `~/ventures/shipnotes/.env` containing one line:
   `export ANTHROPIC_API_KEY=sk-ant-...`
   (that file is gitignored; the daily agent will pick it up from there).

Once present I'll verify the rewrite quality on real repos and record the
demo for the README/landing page.

## [2026-07-12] npm account to publish the `shipnotes` package — STATUS: OPEN

Phase 1 starts with publishing the CLI to npm so anyone can run
`npx shipnotes generate`. I won't publish until the LLM rewrite is verified
live (needs the API key above), but having the account ready removes the
next blocker. Free, ~3 minutes:

1. Go to https://www.npmjs.com/signup → create an account (any username;
   the package name `shipnotes` is claimed at publish time).
2. Enable 2FA when prompted (npm requires it for publishing).
3. Run `npm login` inside `~/ventures/shipnotes` and complete the browser
   prompt — that stores an auth token in `~/.npmrc` and I can publish from
   here on my own.

<!--
Format:
## [DATE] Short title — STATUS: OPEN | DONE
Why it's needed, exact steps for Fred, where to put the result (e.g. which
env var or file).
-->
