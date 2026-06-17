import {execFileSync} from 'child_process';
import {CostInfo, RateLimitWindow, StatuslineInput} from './types';
import {readContextTokens} from './context';
import {DIM, RESET, YELLOW, contextColor, formatDuration, formatTokens, usageColor} from './format';

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

function dirSegment(cwd: string): string | null {
  const name = cwd.split('/').filter(Boolean).pop();

  return name ? `${DIM}${name}${RESET}` : null;
}

function costSegment(cost?: CostInfo): string | null {
  if (!cost) {
    return null;
  }

  const parts: string[] = [];
  if (typeof cost.total_cost_usd === 'number') {
    parts.push(`$${cost.total_cost_usd.toFixed(2)}`);
  }
  if (typeof cost.total_duration_ms === 'number') {
    parts.push(formatDuration(cost.total_duration_ms));
  }

  return parts.length ? `${DIM}${parts.join(' · ')}${RESET}` : null;
}

function quotaSegment(label: string, window?: RateLimitWindow): string | null {
  if (!window) {
    return null;
  }

  const pct = Math.round(window.used_percentage);
  const color = usageColor(window.used_percentage);

  return `${color}${label}: ${pct}%${RESET}`;
}

function contextSegment(input: StatuslineInput): string | null {
  const ctx = input.transcript_path ? readContextTokens(input.transcript_path) : null;
  if (ctx === null) {
    return null;
  }

  const pct = input.context_window?.used_percentage;
  const suffix = typeof pct === 'number' ? ` (${Math.round(pct)}%)` : '';

  return `${contextColor(ctx)}Ctx: ${formatTokens(ctx)}${suffix}${RESET}`;
}

function joinSegments(segments: Array<string | null>): string {
  return segments.filter((segment): segment is string => Boolean(segment)).join(' | ');
}

export function renderStatusline(input: StatuslineInput): string {
  const cwd = input.workspace.current_dir || input.cwd || '';

  const primary = joinSegments([
    `Model: ${YELLOW}${input.model.display_name}${RESET}`,
    contextSegment(input),
    quotaSegment('5h', input.rate_limits?.five_hour),
    quotaSegment('7d', input.rate_limits?.seven_day),
    costSegment(input.cost),
  ]);

  const secondary = joinSegments([dirSegment(cwd), gitSegment(cwd)]);

  return [primary, secondary].filter(Boolean).join('\n');
}