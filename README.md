# @jacob-z/chalk

Browser console coloring utilities — a modular, type-safe rewrite of `@alita/chalk`, themed with [Catppuccin Macchiato](https://catppuccin.com/palette/).

## Features

- `%c` CSS tuple formatters for browser DevTools console output
- 9 foreground colors: `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `gray`
- 8 background colors: `bgBlack`, `bgRed`, `bgGreen`, `bgYellow`, `bgBlue`, `bgMagenta`, `bgCyan`, `bgWhite`
- Mode switching (`foreground` / `background`) controls logger output style globally
- `bold()` text formatting
- `add()` for merging multiple formatted tuples
- Logger methods: `log`, `wait`, `error`, `warn`, `ready`, `info`, `event`, `debug`
- `hello(title, version)` version banner
- `image(url)` console image
- `createChalk(options?)` factory for dependency injection
- Zero runtime dependencies, fully tree-shakeable

## Install

```bash
pnpm add @jacob-z/chalk
```

## Basic Usage

Color formatters return `console.log`-ready tuples:

```ts
import chalk from '@jacob-z/chalk'

chalk.red('text')
// → ['%ctext', 'color:#ed8796']

chalk.bgRed('text')
// → ['%ctext', 'padding: 2px 4px; border-radius: 3px; color: #24273a; font-weight: bold; background:#ed8796;']

chalk.bold('text')
// → ['%ctext', 'font-weight: bold;']

chalk.add(chalk.red('a'), chalk.blue('b'))
// → [' %ca %cb', 'color:#ed8796', 'color:#8aadf4']
```

Use with `console.log` spread:

```ts
console.log(...chalk.red('colored text'))
console.log(...chalk.add(chalk.red('error:'), chalk.bold(' not found')))
```

### Foreground vs Background Methods

- **Foreground** (`red`, `green`, `blue`, …) — pure `color:<hex>`, no background or padding
- **Background** (`bgRed`, `bgGreen`, `bgBlue`, …) — `background:<hex>; color:#24273a; font-weight: bold; padding: 2px 4px; border-radius: 3px;`
- **bgBlack** special case — dark base background with blue text `#8aadf4`

These are fixed regardless of the `mode` setting. Mode only affects logger output.

## Mode Switching

`createChalk({ mode })` controls how logger methods render. Default is `'background'`.

```ts
import { createChalk } from '@jacob-z/chalk'

const bgChalk = createChalk({ console, mode: 'background' })
const fgChalk = createChalk({ console, mode: 'foreground' })

// background mode: label + message share same styled background
bgChalk.info('loaded')
// → %c[Info]%c loaded   (both segments use background style)

// foreground mode: label + message share same foreground color
fgChalk.info('loaded')
// → %c[Info]%c loaded   (both segments use color:<hex> only)
```

Logger label and message body use the **same style** — no separate styling for the tag vs the content.

## Logger Methods

| Method  | Label    | Color   | Console Method  |
| ------- | -------- | ------- | --------------- |
| `log`   | `[Log]`  | black   | `console.log`   |
| `wait`  | `[Wait]` | cyan    | `console.log`   |
| `error` | `[Error]`| red     | `console.error` |
| `warn`  | `[Warn]` | yellow  | `console.warn`  |
| `ready` | `[Ready]`| green   | `console.log`   |
| `info`  | `[Info]` | blue    | `console.info`  |
| `event` | `[Event]`| magenta | `console.log`   |
| `debug` | `[Debug]`| gray    | `console.debug` |

If a console method is unavailable, the logger falls back to `console.log`.

## Custom Log Levels

Extend the logger with additional methods using built-in color names:

```ts
const chalk = createChalk({
  logLevels: [
    { name: 'trace', label: 'Trace', color: 'blue', method: 'debug' },
  ],
})

chalk.trace('details') // → [Trace] in blue via console.debug
```

`color` must be a built-in `ColorName`: `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `gray`.

## Banner & Image

```ts
chalk.hello('MyApp', '1.0.0') // styled title + version banner
chalk.image('https://example.com/logo.png') // console CSS background image
```

## API

### `createChalk(options?)`

| Option       | Type                        | Default                         | Description                           |
| ------------ | --------------------------- | ------------------------------- | ------------------------------------- |
| `console`    | `Console`                   | `globalThis.console`            | Console instance for output           |
| `mode`       | `'foreground' \| 'background'` | `'background'`             | Logger output style                   |
| `logLevels`  | `LogLevelDefinition[]`      | (built-in 8 levels)            | Custom logger level definitions       |

### `getStyle(colors, name, mode)`

Low-level utility to get CSS style string for a given color name and mode:

```ts
import { getStyle, DEFAULT_COLORS } from '@jacob-z/chalk'

getStyle(DEFAULT_COLORS, 'red', 'foreground')
// → 'color:#ed8796'

getStyle(DEFAULT_COLORS, 'red', 'background')
// → 'padding: 2px 4px; border-radius: 3px; color: #24273a; font-weight: bold; background:#ed8796;'
```

## Architecture

```
src/
  types.ts    → All public & internal types (ChalkMode, ColorName, LogLevelDefinition)
  colors.ts   → Macchiato palette, getStyle() (pure functions)
  format.ts   → %c format helpers, add(), bold(), coloredText()
  logger.ts   → Debug-gated logger factory (mode-aware)
  banner.ts   → hello(), image()
  create.ts   → createChalk() factory
  index.ts    → Default instance + re-exports
```

Design principles vs the original `@alita/chalk`:

- **No `window` dependency** — uses `globalThis` with fallback
- **No global cache** — no `window.chalk` mutation
- **No module-level side effects** — factory pattern, pure functions
- **No `any` / `@ts-ignore`** — strict TypeScript throughout
- **Mode-driven styling** — single `mode` option controls all logger output
- **Dark-mode friendly** — Catppuccin Macchiato palette with proper contrast

## License

MIT
