import { describe, expect, it } from 'vitest'
import { DEFAULT_COLORS, getBackgroundStyle, getForegroundStyle, getStyle } from './colors'

describe('colors', () => {
  it('contains Catppuccin Macchiato palette colors', () => {
    expect(DEFAULT_COLORS).toEqual({
      black: '#24273a',
      red: '#ed8796',
      green: '#a6da95',
      yellow: '#eed49f',
      blue: '#8aadf4',
      magenta: '#c6a0f6',
      cyan: '#8bd5ca',
      white: '#cad3f5',
      gray: '#6e738d',
    })
  })

  it('creates pure foreground CSS without background', () => {
    expect(getForegroundStyle(DEFAULT_COLORS, 'black')).toBe('color:#24273a')
    expect(getForegroundStyle(DEFAULT_COLORS, 'red')).toBe('color:#ed8796')
    expect(getForegroundStyle(DEFAULT_COLORS, 'yellow')).toBe('color:#eed49f')
    expect(getForegroundStyle(DEFAULT_COLORS, 'white')).toBe('color:#cad3f5')
    expect(getForegroundStyle(DEFAULT_COLORS, 'blue')).toBe('color:#8aadf4')
  })

  it('creates background CSS with dark text', () => {
    expect(getBackgroundStyle(DEFAULT_COLORS, 'red')).toBe(
      'padding: 2px 4px; border-radius: 3px; color: #24273a; font-weight: bold; background:#ed8796;',
    )
  })

  it('creates background CSS with blue text for black', () => {
    expect(getBackgroundStyle(DEFAULT_COLORS, 'black')).toBe(
      'padding: 2px 4px; border-radius: 3px; color: #8aadf4; font-weight: bold; background:#24273a;',
    )
  })

  it('getStyle delegates to foreground mode', () => {
    expect(getStyle(DEFAULT_COLORS, 'red', 'foreground')).toBe('color:#ed8796')
  })

  it('getStyle delegates to background mode', () => {
    expect(getStyle(DEFAULT_COLORS, 'red', 'background')).toBe(
      'padding: 2px 4px; border-radius: 3px; color: #24273a; font-weight: bold; background:#ed8796;',
    )
  })

  it('throws for unknown color names', () => {
    expect(() => getForegroundStyle(DEFAULT_COLORS, 'nonexistent')).toThrow('Unknown chalk color: nonexistent')
  })
})
