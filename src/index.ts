#!/usr/bin/env node
import {StatuslineInput} from './types';
import {renderStatusline} from './segments';

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }

  return Buffer.concat(chunks).toString('utf8');
}

async function main(): Promise<void> {
  let line = '';

  try {
    const input = JSON.parse(await readStdin()) as StatuslineInput;
    line = renderStatusline(input);
  } catch {
    line = '';
  }

  process.stdout.write(line + '\n');
}

void main();
