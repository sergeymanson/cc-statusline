# cc-statusline

[![npm](https://img.shields.io/npm/v/@dartchuk-s/cc-statusline)](https://www.npmjs.com/package/@dartchuk-s/cc-statusline)
[![downloads](https://img.shields.io/npm/dm/@dartchuk-s/cc-statusline)](https://www.npmjs.com/package/@dartchuk-s/cc-statusline)
[![license](https://img.shields.io/npm/l/@dartchuk-s/cc-statusline)](./LICENSE)
[![node](https://img.shields.io/node/v/@dartchuk-s/cc-statusline)](https://nodejs.org)
[![install size](https://packagephobia.com/badge?p=@dartchuk-s/cc-statusline)](https://packagephobia.com/result?p=@dartchuk-s/cc-statusline)

A [Claude Code](https://claude.com/claude-code) status line that shows your model,
current context size, git branch, and subscription quota usage (5-hour and weekly windows)
at a glance.

Published on npm: [`@dartchuk-s/cc-statusline`](https://www.npmjs.com/package/@dartchuk-s/cc-statusline).

```
Model: Opus | Ctx: 44.1k | ⎇ main | 5h: 23% | 7d: 61%
```

Quota segments are colour-coded: green below 50%, yellow at 50–79%, red at 80%+.

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

| Segment   | Source                                                        |
|-----------|---------------------------------------------------------------|
| `Model`   | `model.display_name`                                          |
| `Ctx`     | Token count from the latest usage entry in the session transcript |
| `⎇ branch` | `git rev-parse --abbrev-ref HEAD` in the workspace dir         |
| `5h`      | `rate_limits.five_hour.used_percentage`                       |
| `7d`      | `rate_limits.seven_day.used_percentage`                       |

Any segment without data is omitted.

## Requirements

- Node.js >= 24

## Development

```bash
npm install
npm run build        # tsc -> dist/

# smoke test
echo '{"model":{"display_name":"Opus"},"workspace":{"current_dir":"."}}' | node dist/index.js
```

## License

[MIT](./LICENSE)
