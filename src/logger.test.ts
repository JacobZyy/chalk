import type { ConsoleLike } from './types'
import { describe, expect, it, vi } from 'vitest'
import { createColorMap } from './colors'
import { createLoggerMethods } from './logger'

function createConsoleSpy(): Required<ConsoleLike> {
  return {
    log: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }
}

const emptyHooks = () => [] as const

const BG = 'background:rgba(0,0,0,0.15);padding:0 2px;border-radius:2px'

describe('logger', () => {
  it('does not log when debug is false', () => {
    const consoleSpy = createConsoleSpy()
    const logger = createLoggerMethods({
      console: consoleSpy,
      colors: createColorMap(),
      isDebug: () => false,
      getHooks: emptyHooks,
    })

    logger.ready('server started')

    expect(consoleSpy.log).not.toHaveBeenCalled()
  })

  it('logs ready messages with bold green [Ready] label and colored message', () => {
    const consoleSpy = createConsoleSpy()
    const logger = createLoggerMethods({
      console: consoleSpy,
      colors: createColorMap(),
      isDebug: () => true,
      getHooks: emptyHooks,
    })

    logger.ready('server started')

    expect(consoleSpy.log).toHaveBeenCalledWith(
      '%c[Ready]%c server started',
      `color:#a6e3a1;${BG};font-weight: bold;`,
      `color:#a6e3a1;${BG}`,
    )
  })

  it('uses console.error for error messages with bold red label', () => {
    const consoleSpy = createConsoleSpy()
    const logger = createLoggerMethods({
      console: consoleSpy,
      colors: createColorMap(),
      isDebug: () => true,
      getHooks: emptyHooks,
    })

    logger.error('failed', { code: 500 })

    expect(consoleSpy.error).toHaveBeenCalledWith(
      '%c[Error]%c failed',
      `color:#f38ba8;${BG};font-weight: bold;`,
      `color:#f38ba8;${BG}`,
      { code: 500 },
    )
  })

  it('falls back to console.log when the requested method is missing', () => {
    const log = vi.fn()
    const logger = createLoggerMethods({
      console: { log },
      colors: createColorMap(),
      isDebug: () => true,
      getHooks: emptyHooks,
    })

    logger.warn('careful')

    expect(log).toHaveBeenCalledWith(
      '%c[Warn]%c careful',
      `color:#f9e2af;${BG};font-weight: bold;`,
      `color:#f9e2af;${BG}`,
    )
  })

  it('supports custom log levels and colors', () => {
    const consoleSpy = createConsoleSpy()
    const logger = createLoggerMethods({
      console: consoleSpy,
      colors: createColorMap({ trace: '#123456' }),
      isDebug: () => true,
      getHooks: emptyHooks,
      logLevels: [
        {
          name: 'trace',
          label: 'Trace',
          color: 'trace',
          method: 'debug',
        },
      ],
    })

    logger.trace('details')

    expect(consoleSpy.debug).toHaveBeenCalledWith(
      '%c[Trace]%c details',
      `color:#123456;${BG};font-weight: bold;`,
      `color:#123456;${BG}`,
    )
  })
})
