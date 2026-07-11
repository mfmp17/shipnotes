#!/usr/bin/env node
import { main } from "../src/cli.js";

main().then(
  (code) => process.exit(code),
  (err) => {
    process.stderr.write(`shipnotes: unexpected error — ${err?.stack ?? err}\n`);
    process.exit(1);
  },
);
