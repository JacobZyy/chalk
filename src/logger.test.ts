import type { ConsoleLike } from './types'
import { describe, expect, it, vi } from 'vitest'
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

describe('logger', () => {
  it('does not log when debug is false', () => {
    const consoleSpy = createConsoleSpy()
    const logger = createLoggerMethods({
      console: consoleSpy,
      mode: 'background',
      isDebug: () => false,
      getHooks: emptyHooks,
    })

    logger.ready('server started')

    expect(consoleSpy.log).not.toHaveBeenCalled()
  })

  it('logs ready messages in background mode with unified style', () => {
    const consoleSpy = createConsoleSpy()
    const logger = createLoggerMethods({
      console: consoleSpy,
      mode: 'background',
      isDebug: () => true,
      getHooks: emptyHooks,
    })

    logger.ready('server started')

    const bgStyle = 'padding: 2px 4px; border-radius: 3px; color: #24273a; font-weight: bold; background:#a6da95;'
    expect(consoleSpy.log).toHaveBeenCalledWith(
      '%c[Ready]%c server started',
      bgStyle,
      bgStyle,
    )
  })

  it('logs ready messages in foreground mode with unified style', () => {
    const consoleSpy = createConsoleSpy()
    const logger = createLoggerMethods({
      console: consoleSpy,
      mode: 'foreground',
      isDebug: () => true,
      getHooks: emptyHooks,
    })

    logger.ready('server started')

    const fgStyle = 'color:#a6da95'
    expect(consoleSpy.log).toHaveBeenCalledWith(
      '%c[Ready]%c server started',
      fgStyle,
      fgStyle,
    )
  })

  it('uses console.error for error messages with unified style', () => {
    const consoleSpy = createConsoleSpy()
    const logger = createLoggerMethods({
      console: consoleSpy,
      mode: 'background',
      isDebug: () => true,
      getHooks: emptyHooks,
    })

    logger.error('failed', { code: 500 })

    const bgStyle = 'padding: 2px 4px; border-radius: 3px; color: #24273a; font-weight: bold; background:#ed8796;'
    expect(consoleSpy.error).toHaveBeenCalledWith(
      '%c[Error]%c failed',
      bgStyle,
      bgStyle,
      { code: 500 },
    )
  })

  it('falls back to console.log when the requested method is missing', () => {
    const log = vi.fn()
    const logger = createLoggerMethods({
      console: { log },
      mode: 'background',
      isDebug: () => true,
      getHooks: emptyHooks,
    })

    logger.warn('careful')

    const bgStyle = 'padding: 2px 4px; border-radius: 3px; color: #24273a; font-weight: bold; background:#eed49f;'
    expect(log).toHaveBeenCalledWith(
      '%c[Warn]%c careful',
      bgStyle,
      bgStyle,
    )
  })
})
