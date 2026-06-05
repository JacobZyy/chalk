import { describe, expect, it } from 'vitest'
import chalk, { add, bold, createChalk } from './index'

describe('index exports', () => {
  it('exports a default chalk instance with background mode by default', () => {
    expect(chalk.red('text')).toEqual(['%ctext', 'color:#ed8796'])
  })

  it('exports named helpers', () => {
    const local = createChalk({ isDebug: false })

    expect(bold('text')).toEqual(['%ctext', 'font-weight: bold;'])
    expect(add(local.red('a'), local.blue('b'))).toEqual([
      ' %ca %cb',
      'color:#ed8796',
      'color:#8aadf4',
    ])
  })
})
