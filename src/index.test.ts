import { describe, expect, it } from 'vitest'
import chalk, { add, bgColor, bold, color, createChalk } from './index'

const BG = 'background:rgba(0,0,0,0.15);padding:0 2px;border-radius:2px'

describe('index exports', () => {
  it('exports a default chalk instance', () => {
    expect(chalk.red('text')).toEqual(['%ctext', `color:#f38ba8;${BG}`])
  })

  it('exports named helpers', () => {
    const local = createChalk({ isDebug: false })

    expect(bold('text')).toEqual(['%ctext', 'font-weight: bold;'])
    expect(add(local.red('a'), local.blue('b'))).toEqual([
      ' %ca %cb',
      `color:#f38ba8;${BG}`,
      `color:#89b4fa;${BG}`,
    ])
    expect(color('red', 'text')).toEqual(['%ctext', `color:#f38ba8;${BG}`])
    expect(bgColor('red', 'text')).toEqual([
      '%ctext',
      'padding: 2px 4px; border-radius: 3px; color: #1e1e2e; font-weight: bold; background:#f38ba8;',
    ])
  })
})
