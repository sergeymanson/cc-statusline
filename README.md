# cc-statusline

A [Claude Code](https://claude.com/claude-code) status line that shows your model,
current context size, git branch, and subscription quota usage (5-hour and weekly windows)
at a glance.

```
Model: Opus | Ctx: 44.1k | ⎇ main | 5h: 23% | 7d: 61%
```

Quota segments are colour-coded: green below 50%, yellow at 50–79%, red at 80%+.

## Install

```bash
npm install -g @dartchuk-s/cc-statusline
```

This installs the `cc-statusline` binary.

## Configure Claude Code

Add a `statusLine` entry to `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "cc-statusline"
  }
}
```

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
