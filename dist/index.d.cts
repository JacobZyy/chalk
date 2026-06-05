//#region src/types.d.ts
type ConsoleMethodName = 'log' | 'info' | 'warn' | 'error' | 'debug';
interface ConsoleLike {
  log: (...data: unknown[]) => void;
  info?: (...data: unknown[]) => void;
  warn?: (...data: unknown[]) => void;
  error?: (...data: unknown[]) => void;
  debug?: (...data: unknown[]) => void;
}
type FormattedText = [template: `%c${string}`, ...styles: string[]];
type ColorName = 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'gray';
type PublicColorName = Exclude<ColorName, 'gray'>;
type ColorMap = Readonly<Record<ColorName, string>>;
type CustomColorMap = Readonly<Record<string, string>>;
type DebugPredicate = () => boolean;
interface LogLevelDefinition {
  name: string;
  label: string;
  color: ColorName | string;
  method: ConsoleMethodName;
}
interface CreateChalkOptions {
  console?: ConsoleLike;
  isDebug?: boolean | DebugPredicate;
  colors?: CustomColorMap;
  logLevels?: readonly LogLevelDefinition[];
}
type TextFormatter = (text: string) => FormattedText;
type LogMethod = (message: string, ...args: unknown[]) => void;
interface ChalkInstance {
  add: (...items: readonly FormattedText[]) => FormattedText;
  bold: TextFormatter;
  hello: (title: string, version: string) => void;
  image: (url: string) => void;
  log: LogMethod;
  wait: LogMethod;
  error: LogMethod;
  warn: LogMethod;
  ready: LogMethod;
  info: LogMethod;
  event: LogMethod;
  debug: LogMethod;
  black: TextFormatter;
  red: TextFormatter;
  green: TextFormatter;
  yellow: TextFormatter;
  blue: TextFormatter;
  magenta: TextFormatter;
  cyan: TextFormatter;
  white: TextFormatter;
  bgBlack: TextFormatter;
  bgRed: TextFormatter;
  bgGreen: TextFormatter;
  bgYellow: TextFormatter;
  bgBlue: TextFormatter;
  bgMagenta: TextFormatter;
  bgCyan: TextFormatter;
  bgWhite: TextFormatter;
  color: (name: string, text: string) => FormattedText;
  bgColor: (name: string, text: string) => FormattedText;
}
//#endregion
//#region src/create.d.ts
declare function createChalk(options?: CreateChalkOptions): ChalkInstance;
//#endregion
//#region src/format.d.ts
declare function bold(text: string): FormattedText;
declare function add(...items: readonly FormattedText[]): FormattedText;
//#endregion
//#region src/colors.d.ts
/**
 * Catppuccin Mocha palette — https://catppuccin.com/palette/
 */
declare const DEFAULT_COLORS: ColorMap;
type ResolvedColorMap = Readonly<ColorMap & CustomColorMap>;
declare function createColorMap(customColors?: CustomColorMap): ResolvedColorMap;
declare function resolveColor(colors: Readonly<Record<string, string>>, name: string): string;
declare function getForegroundStyle(colors: Readonly<Record<string, string>>, name: string): string;
declare function getBackgroundStyle(colors: Readonly<Record<string, string>>, name: string): string;
//#endregion
//#region src/index.d.ts
declare const chalk: ChalkInstance;
declare function color(name: string, text: string): FormattedText;
declare function bgColor(name: string, text: string): FormattedText;
//#endregion
export { type ChalkInstance, type ColorMap, type ColorName, type ConsoleLike, type CreateChalkOptions, type CustomColorMap, DEFAULT_COLORS, type FormattedText, type LogLevelDefinition, type LogMethod, type PublicColorName, type TextFormatter, add, bgColor, bold, chalk, chalk as default, color, createChalk, createColorMap, getBackgroundStyle, getForegroundStyle, resolveColor };
//# sourceMappingURL=index.d.cts.map