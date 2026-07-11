import Anthropic from "@anthropic-ai/sdk";

const ENTRY_SCHEMA = {
  type: "array",
  items: {
    type: "object",
    properties: {
      hash: { type: "string" },
      text: { type: "string" },
    },
    required: ["hash", "text"],
    additionalProperties: false,
  },
};

const OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    breaking: ENTRY_SCHEMA,
    features: ENTRY_SCHEMA,
    fixes: ENTRY_SCHEMA,
    improvements: ENTRY_SCHEMA,
  },
  required: ["breaking", "features", "fixes", "improvements"],
  additionalProperties: false,
};

const SYSTEM = `You rewrite raw git commit subjects into polished, customer-facing release notes.

Rules:
- Rewrite each entry as a short, clear sentence a non-technical customer understands. Lead with the benefit or the visible behavior change, not the implementation.
- Keep each entry's "hash" exactly as given — it links the entry back to its commit.
- You may merge entries that describe the same user-visible change: keep one entry with the hash of the most representative commit, and drop the duplicates.
- You may move an entry to a more fitting section (e.g. a "refactor" commit that actually adds a user-visible feature belongs in features).
- Drop entries with no customer-visible effect (internal renames, CI tweaks) by omitting them.
- Never invent changes that are not in the input.`;

export function hasApiKey(env = process.env) {
  return Boolean(env.ANTHROPIC_API_KEY);
}

/**
 * Rewrite grouped entries into customer language via the Claude API.
 * Returns groups in the same shape, or throws on failure — the caller
 * decides whether to fall back to the heuristic grouping.
 */
export async function rewriteWithClaude(groups, { model = "claude-opus-4-8" } = {}) {
  const client = new Anthropic();

  const input = {
    breaking: groups.breaking.map(({ hash, text }) => ({ hash, text })),
    features: groups.features.map(({ hash, text }) => ({ hash, text })),
    fixes: groups.fixes.map(({ hash, text }) => ({ hash, text })),
    improvements: groups.improvements.map(({ hash, text }) => ({ hash, text })),
  };

  const response = await client.messages.create({
    model,
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    system: SYSTEM,
    output_config: { format: { type: "json_schema", schema: OUTPUT_SCHEMA } },
    messages: [
      {
        role: "user",
        content: `Rewrite these grouped release-note entries:\n\n${JSON.stringify(input, null, 2)}`,
      },
    ],
  });

  if (response.stop_reason === "refusal") {
    throw new Error("Claude declined to process this content");
  }
  if (response.stop_reason === "max_tokens") {
    throw new Error("Claude response was truncated (max_tokens)");
  }

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock) throw new Error("No text content in Claude response");
  const rewritten = JSON.parse(textBlock.text);

  // Map rewritten text back onto the original entries by hash so
  // metadata (author, date) survives the rewrite.
  const byHash = new Map();
  for (const section of Object.keys(input)) {
    for (const entry of groups[section]) byHash.set(entry.hash, entry);
  }

  const result = { breaking: [], features: [], fixes: [], improvements: [], internal: groups.internal ?? [] };
  for (const section of ["breaking", "features", "fixes", "improvements"]) {
    for (const entry of rewritten[section] ?? []) {
      const original = byHash.get(entry.hash);
      result[section].push({ ...(original ?? {}), hash: entry.hash, text: entry.text });
    }
  }
  return result;
}

export { Anthropic };
