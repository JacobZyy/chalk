import type { ColorMap, CustomColorMap } from './types'

/**
 * Catppuccin Mocha palette — https://catppuccin.com/palette/
 */
export const DEFAULT_COLORS: ColorMap = {
  black: '#1e1e2e', // Base
  red: '#f38ba8', // Red
  green: '#a6e3a1', // Green
  yellow: '#f9e2af', // Yellow
  blue: '#89b4fa', // Blue
  magenta: '#cba6f7', // Mauve
  cyan: '#94e2d5', // Teal
  white: '#cdd6f4', // Text
  gray: '#6c7086', // Overlay0
}

/**
 * Colors that are dark enough to not need a background on dark consoles.
 * All other built-in Catppuccin Mocha colors are pastel and need a subtle bg.
 */
export const DARK_FG_COLORS: Record<string, true> = { black: true, gray: true }

export type ResolvedColorMap = Readonly<ColorMap & CustomColorMap>

export function createColorMap(customColors: CustomColorMap = {} as CustomColorMap): ResolvedColorMap {
  return {
    ...DEFAULT_COLORS,
    ...customColors,
  }
}

export function resolveColor(colors: Readonly<Record<string, string>>, name: string): string {
  const color = colors[name]
  if (color === undefined)
    throw new Error(`Unknown chalk color: ${name}`)
  return color
}

/** Returns true when the color is bright enough to need a background in dark consoles. */
function needsBackground(colors: Readonly<Record<string, string>>, name: string): boolean {
  if (DARK_FG_COLORS[name])
    return false
  const hex = colors[name]
  if (!hex)
    return true
  return getRelativeLuminance(hex) > 0.18
}

function getRelativeLuminance(hex: string): number {
  const h = hex.replace('#', '')
  const r = Number.parseInt(h.slice(0, 2), 16) / 255
  const g = Number.parseInt(h.slice(2, 4), 16) / 255
  const b = Number.parseInt(h.slice(4, 6), 16) / 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function getForegroundStyle(colors: Readonly<Record<string, string>>, name: string): string {
  const hex = resolveColor(colors, name)
  const parts = [`color:${hex}`]
  if (needsBackground(colors, name))
    parts.push('background:rgba(0,0,0,0.15)', 'padding:0 2px', 'border-radius:2px')
  return parts.join(';')
}

export function getBackgroundStyle(colors: Readonly<Record<string, string>>, name: string): string {
  const hex = resolveColor(colors, name)
  const textColor = '#1e1e2e'
  return `padding: 2px 4px; border-radius: 3px; color: ${textColor}; font-weight: bold; background:${hex};`
}
