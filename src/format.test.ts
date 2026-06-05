import { describe, expect, it } from 'vitest'
import { add, bold, coloredText } from './format'

describe('format', () => {
  it('formats foreground colored text', () => {
    expect(coloredText('red', 'text', 'foreground')).toEqual(['%ctext', 'color:#ed8796'])
  })

  it('formats background colored text', () => {
    expect(coloredText('red', 'text', 'background')).toEqual([
      '%ctext',
      'padding: 2px 4px; border-radius: 3px; color: #24273a; font-weight: bold; background:#ed8796;',
    ])
  })

  it('formats bold text', () => {
    expect(bold('text')).toEqual(['%ctext', 'font-weight: bold;'])
  })

  it('merges multiple formatted tuples', () => {
    expect(add(coloredText('red', 'a', 'foreground'), coloredText('blue', 'b', 'foreground'))).toEqual([
      ' %ca %cb',
      'color:#ed8796',
      'color:#8aadf4',
    ])
  })

  it('returns an empty template when adding no items', () => {
    expect(add()).toEqual(['%c', ''])
  })
})
