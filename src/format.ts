export const RESET = '\x1b[0m';
export const DIM = '\x1b[2m';
export const GREEN = '\x1b[32m';
export const YELLOW = '\x1b[33m';
export const RED = '\x1b[31m';

/**
 * Formats a raw token count for display, e.g. 44123 -> "44.1k".
 */
export function formatTokens(tokens: number): string {
  if (tokens >= 1000) {
    return `${(tokens / 1000).toFixed(1)}k`;
  }

  return String(tokens);
}

/**
 * Maps a quota usage percentage (0-100) to an ANSI colour escape code.
 * Applied to both the 5-hour and weekly quota segments so the user can see at
 * a glance how close they are to the limit.
 */
export function usageColor(pct: number): string {
  if (pct >= 80) {
    return RED;
  }

  if (pct >= 50) {
    return YELLOW;
  }

  return GREEN;
}