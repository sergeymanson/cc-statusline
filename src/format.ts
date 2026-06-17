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
 * Maps a quota usage percentage (0-100) to an ANSI color escape code.
 * Applied to both the 5-hour and weekly quota segments so the user can see at
 * a glance how close they are to the limit.
 */
const QUOTA_COLORS = [
  {min: 0, max: 50, color: GREEN},
  {min: 50, max: 80, color: YELLOW},
  {min: 80, max: Infinity, color: RED},
];
export function usageColor(pct: number): string {
  return QUOTA_COLORS.find(({min, max}) => pct >= min && pct < max)?.color ?? RED;
}

/**
 * Maps a context token count to an ANSI color escape code, so the user can see
 * at a glance how full the context window is. Thresholds target the standard
 * 200k window: green below 100k, yellow up to 175k, red above.
 */
const CONTEXT_COLORS = [
  {min: 0, max: 100_000, color: GREEN},
  {min: 100_000, max: 175_000, color: YELLOW},
  {min: 175_000, max: Infinity, color: RED},
];
export function contextColor(tokens: number): string {
  return CONTEXT_COLORS.find(({min, max}) => tokens >= min && tokens < max)!.color;
}