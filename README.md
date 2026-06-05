# @jacob-z/chalk

Browser console coloring utilities — a modular, type-safe rewrite of `@alita/chalk`, themed with [Catppuccin Mocha](https://catppuccin.com/palette/).

## Features

- `%c` CSS tuple formatters for browser DevTools console output
- 9 foreground colors: `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `gray`
- 8 background colors: `bgBlack`, `bgRed`, `bgGreen`, `bgYellow`, `bgBlue`, `bgMagenta`, `bgCyan`, `bgWhite`
- Light foreground colors automatically get a subtle dark background for readability in dark-mode consoles
- `bold()` text formatting
- `add()` for merging multiple formatted tuples
- Debug-gated logger methods: `log`, `wait`, `error`, `warn`, `ready`, `info`, `event`, `debug`
- `hello(title, version)` version banner
- `image(url)` console image
- `createChalk(options?)` factory for dependency injection and custom colors
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
// → ['%ctext', 'color:#f38ba8']

chalk.yellow('text')
// → ['%ctext', 'color:#f9e2af;background:rgba(0,0,0,0.15);padding:0 2px;border-radius:2px']

chalk.bgRed('text')
// → ['%ctext', 'padding: 2px 4px; border-radius: 3px; color: #1e1e2e; font-weight: bold; background:#f38ba8;']

chalk.bold('text')
// → ['%ctext', 'font-weight: bold;']

chalk.add(chalk.red('a'), chalk.blue('b'))
// → [' %ca %cb', 'color:#f38ba8', 'color:#89b4fa']
```

Use with `console.log` spread:

```ts
console.log(...chalk.red('colored text'))
console.log(...chalk.add(chalk.red('error:'), chalk.bold(' not found')))
```

## Debug Logging

Logger methods only print when debugging is enabled. By default they read `globalThis.alitadebug`:

```ts
globalThis.alitadebug = true

chalk.ready('server started') // prints [Ready] in green
chalk.error('failed') // prints [Error] in red
```

For tests or controlled environments, use the factory:

```ts
import { createChalk } from '@jacob-z/chalk'

const chalk = createChalk({ console, isDebug: () => true })
chalk.info('loaded')
```

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

## Custom Colors

```ts
import { createChalk } from '@jacob-z/chalk'

const chalk = createChalk({
  colors: { brand: '#123456' },
})

chalk.color('brand', 'Brand text') // → ['%cBrand text', 'color:#123456']
chalk.bgColor('brand', 'Brand block') // → background with custom color
```

## Custom Log Levels

```ts
const chalk = createChalk({
  isDebug: true,
  colors: { trace: '#123456' },
  logLevels: [
    { name: 'trace', label: 'Trace', color: 'trace', method: 'debug' },
  ],
})

chalk.trace('details') // → [Trace] in custom color via console.debug
```

## Banner & Image

```ts
chalk.hello('MyApp', '1.0.0') // styled title + version banner
chalk.image('https://example.com/logo.png') // console CSS background image
```

## Architecture

```
src/
  types.ts    → All public & internal types
  colors.ts   → Color map, CSS generation (pure functions)
  format.ts   → %c format helpers, add(), bold()
  logger.ts   → Debug-gated logger factory
  banner.ts   → hello(), image()
  create.ts   → createChalk() factory
  index.ts    → Default instance + re-exports
```

Design principles vs the original `@alita/chalk`:

- **No `window` dependency** — uses `globalThis` with fallback
- **No global cache** — no `window.chalk` mutation
- **No module-level side effects** — factory pattern, pure functions
- **No `any` / `@ts-ignore`** — strict TypeScript throughout
- **Modular & extensible** — custom colors, custom log levels, injected console
- **Dark-mode friendly** — light foreground colors get a subtle background for readability

## License

MIT
