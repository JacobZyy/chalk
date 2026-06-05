import type { ConsoleLike } from './types'
import { describe, expect, it, vi } from 'vitest'
import { createChalk } from './create'

function createConsoleSpy(): Required<ConsoleLike> {
  return {
    log: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }
}

describe('createChalk', () => {
  it('creates foreground and background methods', () => {
    const chalk = createChalk({ isDebug: false })

    expect(chalk.red('text')).toEqual(['%ctext', 'color:#ed8796'])
    expect(chalk.bgRed('text')).toEqual([
      '%ctext',
      'padding: 2px 4px; border-radius: 3px; color: #24273a; font-weight: bold; background:#ed8796;',
    ])
  })

  it('foreground methods output pure color without background', () => {
    const chalk = createChalk({ isDebug: false })

    expect(chalk.black('text')).toEqual(['%ctext', 'color:#24273a'])
    expect(chalk.red('text')).toEqual(['%ctext', 'color:#ed8796'])
    expect(chalk.blue('text')).toEqual(['%ctext', 'color:#8aadf4'])
  })

  it('exposes add and bold helpers', () => {
    const chalk = createChalk({ isDebug: false })

    expect(chalk.bold('text')).toEqual(['%ctext', 'font-weight: bold;'])
    expect(chalk.add(chalk.red('a'), chalk.blue('b'))).toEqual([
      ' %ca %cb',
      'color:#ed8796',
      'color:#8aadf4',
    ])
  })

  it('uses injected console and debug predicate for loggers in background mode', () => {
    const consoleSpy = createConsoleSpy()
    const chalk = createChalk({
      console: consoleSpy,
      mode: 'background',
      isDebug: () => true,
    })

    chalk.info('loaded')

    const bgStyle = 'padding: 2px 4px; border-radius: 3px; color: #24273a; font-weight: bold; background:#8aadf4;'
    expect(consoleSpy.info).toHaveBeenCalledWith(
      '%c[Info]%c loaded',
      bgStyle,
      bgStyle,
    )
  })

  it('uses foreground mode for loggers when mode is foreground', () => {
    const consoleSpy = createConsoleSpy()
    const chalk = createChalk({
      console: consoleSpy,
      mode: 'foreground',
      isDebug: () => true,
    })

    chalk.info('loaded')

    expect(consoleSpy.info).toHaveBeenCalledWith(
      '%c[Info]%c loaded',
      'color:#8aadf4',
      'color:#8aadf4',
    )
  })

  it('defaults to background mode', () => {
    const consoleSpy = createConsoleSpy()
    const chalk = createChalk({
      console: consoleSpy,
      isDebug: () => true,
    })

    chalk.ready('started')

    const bgStyle = 'padding: 2px 4px; border-radius: 3px; color: #24273a; font-weight: bold; background:#a6da95;'
    expect(consoleSpy.log).toHaveBeenCalledWith(
      '%c[Ready]%c started',
      bgStyle,
      bgStyle,
    )
  })
})
