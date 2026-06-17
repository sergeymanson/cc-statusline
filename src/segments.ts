import {execFileSync} from 'child_process';
import {RateLimitWindow, StatuslineInput} from './types';
import {readContextTokens} from './context';
import {DIM, RESET, formatTokens, usageColor} from './format';

function gitSegment(cwd: string): string {
  try {
    const branch = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
      cwd,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();

    return `⎇ ${branch}`;
  } catch {
    return `${DIM}⎇ no git${RESET}`;
  }
}

function quotaSegment(label: string, window?: RateLimitWindow): string | null {
  if (!window) {
    return null;
  }

  const pct = Math.round(window.used_percentage);
  const color = usageColor(window.used_percentage);

  return `${color}${label}: ${pct}%${RESET}`;
}

export function renderStatusline(input: StatuslineInput): string {
  const ctx = input.transcript_path ? readContextTokens(input.transcript_path) : null;

  const segments: Array<string | null> = [
    `Model: ${input.model.display_name}`,
    ctx !== null ? `Ctx: ${formatTokens(ctx)}` : null,
    gitSegment(input.workspace.current_dir),
    quotaSegment('5h', input.rate_limits?.five_hour),
    quotaSegment('7d', input.rate_limits?.seven_day),
  ];

  return segments.filter((segment): segment is string => Boolean(segment)).join(' | ');
}