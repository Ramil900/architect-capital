import OpenAI from "openai";

let _client: OpenAI | null = null;

// Lazy singleton — only initialised if OPENAI_API_KEY is present.
// Returns null if the key is missing so callers can gracefully fallback.
export function getOpenAIClient(): OpenAI | null {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  if (!_client) {
    _client = new OpenAI({ apiKey: key });
  }
  return _client;
}
