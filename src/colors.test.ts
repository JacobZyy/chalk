import { describe, expect, it } from 'vitest'
import { createColorMap, DEFAULT_COLORS, getBackgroundStyle, getForegroundStyle } from './colors'

describe('colors', () => {
  it('contains Catppuccin Mocha palette colors', () => {
    expect(DEFAULT_COLORS).toEqual({
      black: '#1e1e2e',
      red: '#f38ba8',
      green: '#a6e3a1',
      yellow: '#f9e2af',
      blue: '#89b4fa',
      magenta: '#cba6f7',
      cyan: '#94e2d5',
      white: '#cdd6f4',
      gray: '#6c7086',
    })
  })

  it('creates plain foreground CSS for dark colors', () => {
    expect(getForegroundStyle(DEFAULT_COLORS, 'black')).toBe('color:#1e1e2e')
    expect(getForegroundStyle(DEFAULT_COLORS, 'gray')).toBe('color:#6c7086')
  })

  it('adds background for pastel foreground colors', () => {
    expect(getForegroundStyle(DEFAULT_COLORS, 'red')).toBe(
      'color:#f38ba8;background:rgba(0,0,0,0.15);padding:0 2px;border-radius:2px',
    )
    expect(getForegroundStyle(DEFAULT_COLORS, 'yellow')).toBe(
      'color:#f9e2af;background:rgba(0,0,0,0.15);padding:0 2px;border-radius:2px',
    )
    expect(getForegroundStyle(DEFAULT_COLORS, 'white')).toBe(
      'color:#cdd6f4;background:rgba(0,0,0,0.15);padding:0 2px;border-radius:2px',
    )
    expect(getForegroundStyle(DEFAULT_COLORS, 'green')).toBe(
      'color:#a6e3a1;background:rgba(0,0,0,0.15);padding:0 2px;border-radius:2px',
    )
    expect(getForegroundStyle(DEFAULT_COLORS, 'blue')).toBe(
      'color:#89b4fa;background:rgba(0,0,0,0.15);padding:0 2px;border-radius:2px',
    )
    expect(getForegroundStyle(DEFAULT_COLORS, 'cyan')).toBe(
      'color:#94e2d5;background:rgba(0,0,0,0.15);padding:0 2px;border-radius:2px',
    )
    expect(getForegroundStyle(DEFAULT_COLORS, 'magenta')).toBe(
      'color:#cba6f7;background:rgba(0,0,0,0.15);padding:0 2px;border-radius:2px',
    )
  })

  it('creates background CSS with dark text', () => {
    expect(getBackgroundStyle(DEFAULT_COLORS, 'red')).toBe(
      'padding: 2px 4px; border-radius: 3px; color: #1e1e2e; font-weight: bold; background:#f38ba8;',
    )
  })

  it('merges custom colors without mutating defaults', () => {
    const colors = createColorMap({ brand: '#123456' })
    expect(colors.brand).toBe('#123456')
    expect(DEFAULT_COLORS).not.toHaveProperty('brand')
  })

  it('throws for unknown color names', () => {
    expect(() => getForegroundStyle(DEFAULT_COLORS, 'nonexistent')).toThrow('Unknown chalk color: nonexistent')
  })
})
