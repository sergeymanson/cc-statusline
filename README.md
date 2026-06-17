# cc-statusline

[![npm](https://img.shields.io/npm/v/@dartchuk-s/cc-statusline)](https://www.npmjs.com/package/@dartchuk-s/cc-statusline)
[![downloads](https://img.shields.io/npm/dm/@dartchuk-s/cc-statusline)](https://www.npmjs.com/package/@dartchuk-s/cc-statusline)
[![license](https://img.shields.io/npm/l/@dartchuk-s/cc-statusline)](./LICENSE)
[![node](https://img.shields.io/node/v/@dartchuk-s/cc-statusline)](https://nodejs.org)
[![install size](https://packagephobia.com/badge?p=@dartchuk-s/cc-statusline)](https://packagephobia.com/result?p=@dartchuk-s/cc-statusline)

A minimal, zero-config [Claude Code](https://claude.com/claude-code) status line that shows your
model, working directory, context usage, git branch, subscription quota, and session cost — all in
a single colour-coded line. No setup, no config file, no TUI: point Claude Code at it and it just
works.

Published on npm: [`@dartchuk-s/cc-statusline`](https://www.npmjs.com/package/@dartchuk-s/cc-statusline).

```
Model: Opus 4.8 | cc-statusline | Ctx: 44.1k (22%) | ⎇ main | 5h: 23% | 7d: 61% | $0.42 · 12m
```

## Features

- **Model** — current model name, always highlighted.
- **Directory** — the working directory (folder name).
- **Context** — live context size with the percentage of the window used; colour-coded by size
  (green < 100k, yellow 100k–175k, red > 175k tokens).
- **Git branch** — current branch in the workspace, or a dimmed `no git` outside a repo.
- **Quota** — 5-hour and weekly subscription usage, colour-coded (green < 50%, yellow 50–79%,
  red 80%+).
- **Session cost** — estimated cost in USD and elapsed session time.
- **Zero config** — a single static line, sensible colours, no settings to maintain. Any segment
  without data is silently omitted.

## Configure Claude Code

Add a `statusLine` entry to `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "npx -y @dartchuk-s/cc-statusline@latest",
    "padding": 0,
    "refreshInterval": 10
  }
}
```

`npx` fetches and caches the package on first run; `@latest` keeps it up to date.
Claude Code pipes its status JSON to the command on stdin; the binary prints a single
formatted line to stdout.

## Segments

| Segment       | Source                                                            |
|---------------|-------------------------------------------------------------------|
| `Model`       | `model.display_name`                                              |
| directory     | folder name of `workspace.current_dir`                            |
| `Ctx`         | token count from the latest usage entry in the session transcript |
| `(NN%)`       | `context_window.used_percentage` (when provided)                  |
| `⎇ branch`     | `git rev-parse --abbrev-ref HEAD` in the workspace dir            |
| `5h`          | `rate_limits.five_hour.used_percentage`                           |
| `7d`          | `rate_limits.seven_day.used_percentage`                           |
| `$cost · time` | `cost.total_cost_usd` and `cost.total_duration_ms`               |

Any segment without data is omitted.

## Requirements

- Node.js >= 24

## Development

```bash
npm install
npm run build        # tsc -> dist/

# smoke test
echo '{"model":{"display_name":"Opus"},"workspace":{"current_dir":"."},"context_window":{"used_percentage":22},"cost":{"total_cost_usd":0.42,"total_duration_ms":720000}}' | node dist/index.js
```

## License

[MIT](./LICENSE)
