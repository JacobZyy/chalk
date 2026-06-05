import type { FormattedText } from './types'
import { getBackgroundStyle, getForegroundStyle } from './colors'

export function formatText(text: string, style: string): FormattedText {
  return [`%c${text}`, style]
}

export function color(colors: Readonly<Record<string, string>>, name: string, text: string): FormattedText {
  return formatText(text, getForegroundStyle(colors, name))
}

export function bgColor(colors: Readonly<Record<string, string>>, name: string, text: string): FormattedText {
  return formatText(text, getBackgroundStyle(colors, name))
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
