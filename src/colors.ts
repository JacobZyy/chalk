import type { ChalkMode, ColorMap } from './types'

/**
 * Catppuccin Macchiato palette — https://catppuccin.com/palette/
 */
export const DEFAULT_COLORS: ColorMap = {
  black: '#24273a', // Base
  red: '#ed8796', // Red
  green: '#a6da95', // Green
  yellow: '#eed49f', // Yellow
  blue: '#8aadf4', // Blue
  magenta: '#c6a0f6', // Mauve
  cyan: '#8bd5ca', // Teal
  white: '#cad3f5', // Text
  gray: '#6e738d', // Overlay0
}

export function resolveColor(colors: Readonly<Record<string, string>>, name: string): string {
  const color = colors[name]
  if (color === undefined)
    throw new Error(`Unknown chalk color: ${name}`)
  return color
}

export function getForegroundStyle(colors: Readonly<Record<string, string>>, name: string): string {
  const hex = resolveColor(colors, name)
  return `color:${hex}`
}

export function getBackgroundStyle(colors: Readonly<Record<string, string>>, name: string): string {
  const hex = resolveColor(colors, name)
  const textColor = name === 'black' ? (colors.blue ?? '#8aadf4') : '#24273a'
  return `padding: 2px 4px; border-radius: 3px; color: ${textColor}; font-weight: bold; background:${hex};`
}

export function getStyle(colors: Readonly<Record<string, string>>, name: string, mode: ChalkMode): string {
  return mode === 'background'
    ? getBackgroundStyle(colors, name)
    : getForegroundStyle(colors, name)
}
