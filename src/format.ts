import type { ChalkMode, FormattedText } from './types'
import { DEFAULT_COLORS, getStyle } from './colors'

export function formatText(text: string, style: string): FormattedText {
  return [`%c${text}`, style]
}

export function coloredText(name: string, text: string, mode: ChalkMode): FormattedText {
  return formatText(text, getStyle(DEFAULT_COLORS, name, mode))
}

export function bold(text: string): FormattedText {
  return formatText(text, 'font-weight: bold;')
}

export function add(...items: readonly FormattedText[]): FormattedText {
  if (items.length === 0)
    return ['%c', '']
  const template = items.map(item => ` ${item[0]}`).join('')
  const styles = items.flatMap(([, ...itemStyles]) => itemStyles)
  return [template, ...styles] as FormattedText
}
