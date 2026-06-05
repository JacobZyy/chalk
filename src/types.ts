export type ConsoleMethodName = 'log' | 'info' | 'warn' | 'error' | 'debug'

export interface ConsoleLike {
  log: (...data: unknown[]) => void
  info?: (...data: unknown[]) => void
  warn?: (...data: unknown[]) => void
  error?: (...data: unknown[]) => void
  debug?: (...data: unknown[]) => void
}

export type FormattedText = [template: `%c${string}`, ...styles: string[]]

export type ColorName
  = | 'black'
    | 'red'
    | 'green'
    | 'yellow'
    | 'blue'
    | 'magenta'
    | 'cyan'
    | 'white'
    | 'gray'

export type PublicColorName = Exclude<ColorName, 'gray'>

export type ColorMap = Readonly<Record<ColorName, string>>

export type CustomColorMap = Readonly<Record<string, string>>

export type DebugPredicate = () => boolean

export interface LogLevelDefinition {
  name: string
  label: string
  color: ColorName | string
  method: ConsoleMethodName
}

export interface CreateChalkOptions {
  console?: ConsoleLike
  isDebug?: boolean | DebugPredicate
  colors?: CustomColorMap
  logLevels?: readonly LogLevelDefinition[]
}

export type TextFormatter = (text: string) => FormattedText

export type LogMethod = (message: string, ...args: unknown[]) => void

export interface LogHookContext {
  level: string
  label: string
  message: string
  args: unknown[]
  isDebug: boolean
}

export type LogHook = (ctx: LogHookContext) => void

export interface ChalkInstance {
  add: (...items: readonly FormattedText[]) => FormattedText
  bold: TextFormatter
  hello: (title: string, version: string) => void
  image: (url: string) => void
  log: LogMethod
  wait: LogMethod
  error: LogMethod
  warn: LogMethod
  ready: LogMethod
  info: LogMethod
  event: LogMethod
  debug: LogMethod
  black: TextFormatter
  red: TextFormatter
  green: TextFormatter
  yellow: TextFormatter
  blue: TextFormatter
  magenta: TextFormatter
  cyan: TextFormatter
  white: TextFormatter
  bgBlack: TextFormatter
  bgRed: TextFormatter
  bgGreen: TextFormatter
  bgYellow: TextFormatter
  bgBlue: TextFormatter
  bgMagenta: TextFormatter
  bgCyan: TextFormatter
  bgWhite: TextFormatter
  color: (name: string, text: string) => FormattedText
  bgColor: (name: string, text: string) => FormattedText
  use: (hook: LogHook) => ChalkInstance
}
