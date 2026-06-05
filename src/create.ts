import type { ChalkInstance, ConsoleLike, CreateChalkOptions, DebugPredicate } from './types'
import { createBannerMethods } from './banner'
import { createColorMap } from './colors'
import { add, bgColor, bold, color } from './format'
import { createLoggerMethods } from './logger'

const noopConsole: ConsoleLike = {
  log: () => {},
}

function readGlobalDebugFlag(): boolean {
  return Object.prototype.hasOwnProperty.call(globalThis, 'alitadebug')
    && Boolean(globalThis.alitadebug)
}

function resolveConsole(consoleLike: ConsoleLike | undefined): ConsoleLike {
  return consoleLike ?? globalThis.console ?? noopConsole
}

function resolveDebugPredicate(isDebug: CreateChalkOptions['isDebug']): DebugPredicate {
  if (typeof isDebug === 'function')
    return isDebug
  if (typeof isDebug === 'boolean')
    return () => isDebug
  return readGlobalDebugFlag
}

export function createChalk(options: CreateChalkOptions = {}): ChalkInstance {
  const consoleLike = resolveConsole(options.console)
  const colors = createColorMap(options.colors)
  const isDebug = resolveDebugPredicate(options.isDebug)
  const banner = createBannerMethods(consoleLike, isDebug)
  const loggers = createLoggerMethods({
    console: consoleLike,
    colors,
    isDebug,
    logLevels: options.logLevels,
  })

  return {
    add,
    bold,
    ...banner,
    black: text => color(colors, 'black', text),
    red: text => color(colors, 'red', text),
    green: text => color(colors, 'green', text),
    yellow: text => color(colors, 'yellow', text),
    blue: text => color(colors, 'blue', text),
    magenta: text => color(colors, 'magenta', text),
    cyan: text => color(colors, 'cyan', text),
    white: text => color(colors, 'white', text),
    bgBlack: text => bgColor(colors, 'black', text),
    bgRed: text => bgColor(colors, 'red', text),
    bgGreen: text => bgColor(colors, 'green', text),
    bgYellow: text => bgColor(colors, 'yellow', text),
    bgBlue: text => bgColor(colors, 'blue', text),
    bgMagenta: text => bgColor(colors, 'magenta', text),
    bgCyan: text => bgColor(colors, 'cyan', text),
    bgWhite: text => bgColor(colors, 'white', text),
    color: (name, text) => color(colors, name, text),
    bgColor: (name, text) => bgColor(colors, name, text),
    log: loggers.log,
    wait: loggers.wait,
    error: loggers.error,
    warn: loggers.warn,
    ready: loggers.ready,
    info: loggers.info,
    event: loggers.event,
    debug: loggers.debug,
  }
}
