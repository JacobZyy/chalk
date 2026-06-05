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

const BG = 'background:rgba(0,0,0,0.15);padding:0 2px;border-radius:2px'

describe('createChalk', () => {
  it('creates foreground and background methods for original public colors', () => {
    const chalk = createChalk({ isDebug: false })

    expect(chalk.red('text')).toEqual(['%ctext', `color:#f38ba8;${BG}`])
    expect(chalk.bgRed('text')).toEqual([
      '%ctext',
      'padding: 2px 4px; border-radius: 3px; color: #1e1e2e; font-weight: bold; background:#f38ba8;',
    ])
  })

  it('dark foreground colors get no background', () => {
    const chalk = createChalk({ isDebug: false })

    expect(chalk.black('text')).toEqual(['%ctext', 'color:#1e1e2e'])
  })

  it('exposes add and bold helpers', () => {
    const chalk = createChalk({ isDebug: false })

    expect(chalk.bold('text')).toEqual(['%ctext', 'font-weight: bold;'])
    expect(chalk.add(chalk.red('a'), chalk.blue('b'))).toEqual([
      ' %ca %cb',
      `color:#f38ba8;${BG}`,
      `color:#89b4fa;${BG}`,
    ])
  })

  it('uses injected console and debug predicate for loggers', () => {
    const consoleSpy = createConsoleSpy()
    const chalk = createChalk({
      console: consoleSpy,
      isDebug: () => true,
    })

    chalk.info('loaded')

    expect(consoleSpy.info).toHaveBeenCalledWith(
      '%c[Info]%c loaded',
      `color:#89b4fa;${BG};font-weight: bold;`,
      `color:#89b4fa;${BG}`,
    )
  })

  it('uses custom colors through generic color helpers', () => {
    const chalk = createChalk({
      isDebug: false,
      colors: {
        brand: '#123456',
      },
    })

    expect(chalk.color('brand', 'custom')).toEqual(['%ccustom', `color:#123456;${BG}`])
    expect(chalk.bgColor('brand', 'custom')).toEqual([
      '%ccustom',
      'padding: 2px 4px; border-radius: 3px; color: #1e1e2e; font-weight: bold; background:#123456;',
    ])
  })
})
