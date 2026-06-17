import {readFileSync} from 'fs';

interface Usage {
  input_tokens?: number;
  cache_creation_input_tokens?: number;
  cache_read_input_tokens?: number;
  output_tokens?: number;
}

function parseUsage(line: string): Usage | null {
  try {
    return (JSON.parse(line) as {message?: {usage?: Usage}}).message?.usage ?? null;
  } catch {
    return null;
  }
}

/**
 * Reads the session transcript (JSONL) and returns the current context size in
 * tokens, derived from the most recent message that carries usage data.
 * Returns null when the transcript is missing, empty or unreadable.
 */
export function readContextTokens(transcriptPath: string): number | null {
  let result: number | null = null;

  try {
    const lines = readFileSync(transcriptPath, 'utf8').split('\n');

    for (let i = lines.length - 1; i >= 0 && result === null; i--) {
      const line = lines[i].trim();
      if (!line) {
        continue;
      }

      const usage = parseUsage(line);
      if (usage) {
        result =
          (usage.input_tokens ?? 0) +
          (usage.cache_creation_input_tokens ?? 0) +
          (usage.cache_read_input_tokens ?? 0) +
          (usage.output_tokens ?? 0);
      }
    }
  } catch {
    result = null;
  }

  return result;
}