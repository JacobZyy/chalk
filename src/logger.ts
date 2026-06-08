import type { ChalkMode, ConsoleLike, ConsoleMethodName, LogHook, LogHookContext, LogLevelDefinition, LogMethod } from './types'
import { DEFAULT_COLORS, getStyle } from './colors'

export const DEFAULT_LOG_LEVELS = [
  { name: 'log', label: 'Log', color: 'black', method: 'log' },
  { name: 'wait', label: 'Wait', color: 'cyan', method: 'log' },
  { name: 'error', label: 'Error', color: 'red', method: 'error' },
  { name: 'warn', label: 'Warn', color: 'yellow', method: 'warn' },
  { name: 'ready', label: 'Ready', color: 'green', method: 'log' },
  { name: 'info', label: 'Info', color: 'blue', method: 'info' },
  { name: 'event', label: 'Event', color: 'magenta', method: 'log' },
  { name: 'debug', label: 'Debug', color: 'gray', method: 'debug' },
] satisfies readonly LogLevelDefinition[]

export interface CreateLoggerMethodsOptions {
  console: ConsoleLike
  mode: ChalkMode
  logLevels?: readonly LogLevelDefinition[]
  getHooks: () => readonly LogHook[]
}

function getConsoleMethod(consoleLike: ConsoleLike, method: ConsoleMethodName): (...data: unknown[]) => void {
  return consoleLike[method] ?? consoleLike.log
}

function createLogMethod(
  consoleLike: ConsoleLike,
  level: LogLevelDefinition,
  mode: ChalkMode,
  getHooks: () => readonly LogHook[],
): LogMethod {
  return (message: string, ...args: unknown[]): void => {
    const method = getConsoleMethod(consoleLike, level.method)
    const style = getStyle(DEFAULT_COLORS, level.color, mode)
    method(`%c[${level.label}]%c ${message}`, style, style, ...args)

    const hooks = getHooks()
    if (hooks.length > 0) {
      const ctx: LogHookContext = {
        level: level.name,
        label: level.label,
        message,
        args,
      }
      for (const hook of hooks) {
        hook(ctx)
      }
    }
  }
}

export function createLoggerMethods(options: CreateLoggerMethodsOptions): Record<string, LogMethod> {
  const levels = options.logLevels ?? DEFAULT_LOG_LEVELS
  return Object.fromEntries(
    levels.map(level => [
      level.name,
      createLogMethod(options.console, level, options.mode, options.getHooks),
    ]),
  )
}
