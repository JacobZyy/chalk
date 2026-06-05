import { describe, expect, it } from 'vitest'
import { createColorMap } from './colors'
import { add, bgColor, bold, color } from './format'

const colors = createColorMap()

const BG = 'background:rgba(0,0,0,0.15);padding:0 2px;border-radius:2px'

describe('format', () => {
  it('formats foreground text with original %c tuple', () => {
    expect(color(colors, 'red', 'text')).toEqual(['%ctext', `color:#f38ba8;${BG}`])
  })

  it('formats background text with original %c tuple', () => {
    expect(bgColor(colors, 'red', 'text')).toEqual([
      '%ctext',
      'padding: 2px 4px; border-radius: 3px; color: #1e1e2e; font-weight: bold; background:#f38ba8;',
    ])
  })

  it('formats bold text', () => {
    expect(bold('text')).toEqual(['%ctext', 'font-weight: bold;'])
  })

  it('merges multiple formatted tuples using the original add shape', () => {
    expect(add(color(colors, 'red', 'a'), color(colors, 'blue', 'b'))).toEqual([
      ' %ca %cb',
      `color:#f38ba8;${BG}`,
      `color:#89b4fa;${BG}`,
    ])
  })

  it('returns an empty template when adding no items', () => {
    expect(add()).toEqual(['%c', ''])
  })
})
