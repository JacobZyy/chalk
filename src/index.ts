import { createChalk } from './create'
import { add, bold } from './format'

export const chalk = createChalk()

export { add, bold, createChalk }
export { DEFAULT_COLORS, getBackgroundStyle, getForegroundStyle, getStyle, resolveColor } from './colors'
export type {
  ChalkInstance,
  ChalkMode,
  ColorMap,
  ColorName,
  ConsoleLike,
  CreateChalkOptions,
  FormattedText,
  LogHook,
  LogHookContext,
  LogLevelDefinition,
  LogMethod,
  PublicColorName,
  TextFormatter,
} from './types'

export default chalk
