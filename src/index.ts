import { createColorMap } from './colors'
import { createChalk } from './create'
import { add, bgColor as bgColorWithMap, bold, color as colorWithMap } from './format'

const defaultColors = createColorMap()

export const chalk = createChalk()

export { add, bold, createChalk }
export { createColorMap, DEFAULT_COLORS, getBackgroundStyle, getForegroundStyle, resolveColor } from './colors'
export type {
  ChalkInstance,
  ColorMap,
  ColorName,
  ConsoleLike,
  CreateChalkOptions,
  CustomColorMap,
  FormattedText,
  LogHook,
  LogHookContext,
  LogLevelDefinition,
  LogMethod,
  PublicColorName,
  TextFormatter,
} from './types'

export function color(name: string, text: string) {
  return colorWithMap(defaultColors, name, text)
}

export function bgColor(name: string, text: string) {
  return bgColorWithMap(defaultColors, name, text)
}

export default chalk
