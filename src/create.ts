import type { ChalkInstance, ConsoleLike, CreateChalkOptions, LogHook } from './types'
import { createBannerMethods } from './banner'
import { add, bold, coloredText } from './format'
import { createLoggerMethods } from './logger'

const noopConsole: ConsoleLike = {
  log: () => {},
}

function resolveConsole(consoleLike: ConsoleLike | undefined): ConsoleLike {
  return consoleLike ?? globalThis.console ?? noopConsole
}

export function createChalk(options: CreateChalkOptions = {}): ChalkInstance {
  const consoleLike = resolveConsole(options.console)
  const mode = options.mode ?? 'background'
  const banner = createBannerMethods(consoleLike)
  const hooks: LogHook[] = []
  const getHooks = (): readonly LogHook[] => hooks
  const loggers = createLoggerMethods({
    console: consoleLike,
    mode,
    logLevels: options.logLevels,
    getHooks,
  })

  const fg = (name: string) => (text: string) => coloredText(name, text, 'foreground')
  const bg = (name: string) => (text: string) => coloredText(name, text, 'background')

  const instance: ChalkInstance = {
    add,
    bold,
    ...banner,
    black: fg('black'),
    red: fg('red'),
    green: fg('green'),
    yellow: fg('yellow'),
    blue: fg('blue'),
    magenta: fg('magenta'),
    cyan: fg('cyan'),
    white: fg('white'),
    bgBlack: bg('black'),
    bgRed: bg('red'),
    bgGreen: bg('green'),
    bgYellow: bg('yellow'),
    bgBlue: bg('blue'),
    bgMagenta: bg('magenta'),
    bgCyan: bg('cyan'),
    bgWhite: bg('white'),
    log: loggers.log,
    wait: loggers.wait,
    error: loggers.error,
    warn: loggers.warn,
    ready: loggers.ready,
    info: loggers.info,
    event: loggers.event,
    debug: loggers.debug,
    use(hook: LogHook): ChalkInstance {
      hooks.push(hook)
      return instance
    },
  }

  return instance
}
