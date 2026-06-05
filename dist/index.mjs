//#region src/colors.ts
/**
* Catppuccin Mocha palette — https://catppuccin.com/palette/
*/
const DEFAULT_COLORS = {
	black: "#1e1e2e",
	red: "#f38ba8",
	green: "#a6e3a1",
	yellow: "#f9e2af",
	blue: "#89b4fa",
	magenta: "#cba6f7",
	cyan: "#94e2d5",
	white: "#cdd6f4",
	gray: "#6c7086"
};
/**
* Colors that are dark enough to not need a background on dark consoles.
* All other built-in Catppuccin Mocha colors are pastel and need a subtle bg.
*/
const DARK_FG_COLORS = {
	black: true,
	gray: true
};
function createColorMap(customColors = {}) {
	return {
		...DEFAULT_COLORS,
		...customColors
	};
}
function resolveColor(colors, name) {
	const color$2 = colors[name];
	if (color$2 === void 0) throw new Error(`Unknown chalk color: ${name}`);
	return color$2;
}
/** Returns true when the color is bright enough to need a background in dark consoles. */
function needsBackground(colors, name) {
	if (DARK_FG_COLORS[name]) return false;
	const hex = colors[name];
	if (!hex) return true;
	return getRelativeLuminance(hex) > .18;
}
function getRelativeLuminance(hex) {
	const h = hex.replace("#", "");
	const r = Number.parseInt(h.slice(0, 2), 16) / 255;
	const g = Number.parseInt(h.slice(2, 4), 16) / 255;
	const b = Number.parseInt(h.slice(4, 6), 16) / 255;
	return .2126 * r + .7152 * g + .0722 * b;
}
function getForegroundStyle(colors, name) {
	const parts = [`color:${resolveColor(colors, name)}`];
	if (needsBackground(colors, name)) parts.push("background:rgba(0,0,0,0.15)", "padding:0 2px", "border-radius:2px");
	return parts.join(";");
}
function getBackgroundStyle(colors, name) {
	return `padding: 2px 4px; border-radius: 3px; color: #1e1e2e; font-weight: bold; background:${resolveColor(colors, name)};`;
}

//#endregion
//#region src/banner.ts
function createBannerMethods(consoleLike, isDebug) {
	return {
		hello(title, version) {
			if (!isDebug()) return;
			consoleLike.log(`%c ${title} %c V${version} `, "padding: 2px 1px; border-radius: 3px 0 0 3px; color: #cdd6f4; background: #45475a; font-weight: bold;", "padding: 2px 1px; border-radius: 0 3px 3px 0; color: #1e1e2e; background: #a6e3a1; font-weight: bold;");
		},
		image(url) {
			if (!url) return;
			if (!isDebug()) return;
			consoleLike.log("%c ", `font-size: 1px; padding: 100px 100px; background: url(${url}) no-repeat center / contain; color: transparent;`);
		}
	};
}

//#endregion
//#region src/format.ts
function formatText(text, style) {
	return [`%c${text}`, style];
}
function color$1(colors, name, text) {
	return formatText(text, getForegroundStyle(colors, name));
}
function bgColor$1(colors, name, text) {
	return formatText(text, getBackgroundStyle(colors, name));
}
function bold(text) {
	return formatText(text, "font-weight: bold;");
}
function add(...items) {
	if (items.length === 0) return ["%c", ""];
	return [items.map((item) => ` ${item[0]}`).join(""), ...items.flatMap(([, ...itemStyles]) => itemStyles)];
}

//#endregion
//#region src/logger.ts
const DEFAULT_LOG_LEVELS = [
	{
		name: "log",
		label: "Log",
		color: "black",
		method: "log"
	},
	{
		name: "wait",
		label: "Wait",
		color: "cyan",
		method: "log"
	},
	{
		name: "error",
		label: "Error",
		color: "red",
		method: "error"
	},
	{
		name: "warn",
		label: "Warn",
		color: "yellow",
		method: "warn"
	},
	{
		name: "ready",
		label: "Ready",
		color: "green",
		method: "log"
	},
	{
		name: "info",
		label: "Info",
		color: "blue",
		method: "info"
	},
	{
		name: "event",
		label: "Event",
		color: "magenta",
		method: "log"
	},
	{
		name: "debug",
		label: "Debug",
		color: "gray",
		method: "debug"
	}
];
function getConsoleMethod(consoleLike, method) {
	return consoleLike[method] ?? consoleLike.log;
}
function createLogMethod(consoleLike, colors, isDebug, level) {
	return (message, ...args) => {
		if (!isDebug()) return;
		const method = getConsoleMethod(consoleLike, level.method);
		const labelStyle = `${getForegroundStyle(colors, level.color)};font-weight: bold;`;
		const messageStyle = getForegroundStyle(colors, level.color);
		method(`%c[${level.label}]%c ${message}`, labelStyle, messageStyle, ...args);
	};
}
function createLoggerMethods(options) {
	const levels = options.logLevels ?? DEFAULT_LOG_LEVELS;
	return Object.fromEntries(levels.map((level) => [level.name, createLogMethod(options.console, options.colors, options.isDebug, level)]));
}

//#endregion
//#region src/create.ts
const noopConsole = { log: () => {} };
function readGlobalDebugFlag() {
	return Object.prototype.hasOwnProperty.call(globalThis, "alitadebug") && Boolean(globalThis.alitadebug);
}
function resolveConsole(consoleLike) {
	return consoleLike ?? globalThis.console ?? noopConsole;
}
function resolveDebugPredicate(isDebug) {
	if (typeof isDebug === "function") return isDebug;
	if (typeof isDebug === "boolean") return () => isDebug;
	return readGlobalDebugFlag;
}
function createChalk(options = {}) {
	const consoleLike = resolveConsole(options.console);
	const colors = createColorMap(options.colors);
	const isDebug = resolveDebugPredicate(options.isDebug);
	const banner = createBannerMethods(consoleLike, isDebug);
	const loggers = createLoggerMethods({
		console: consoleLike,
		colors,
		isDebug,
		logLevels: options.logLevels
	});
	return {
		add,
		bold,
		...banner,
		black: (text) => color$1(colors, "black", text),
		red: (text) => color$1(colors, "red", text),
		green: (text) => color$1(colors, "green", text),
		yellow: (text) => color$1(colors, "yellow", text),
		blue: (text) => color$1(colors, "blue", text),
		magenta: (text) => color$1(colors, "magenta", text),
		cyan: (text) => color$1(colors, "cyan", text),
		white: (text) => color$1(colors, "white", text),
		bgBlack: (text) => bgColor$1(colors, "black", text),
		bgRed: (text) => bgColor$1(colors, "red", text),
		bgGreen: (text) => bgColor$1(colors, "green", text),
		bgYellow: (text) => bgColor$1(colors, "yellow", text),
		bgBlue: (text) => bgColor$1(colors, "blue", text),
		bgMagenta: (text) => bgColor$1(colors, "magenta", text),
		bgCyan: (text) => bgColor$1(colors, "cyan", text),
		bgWhite: (text) => bgColor$1(colors, "white", text),
		color: (name, text) => color$1(colors, name, text),
		bgColor: (name, text) => bgColor$1(colors, name, text),
		log: loggers.log,
		wait: loggers.wait,
		error: loggers.error,
		warn: loggers.warn,
		ready: loggers.ready,
		info: loggers.info,
		event: loggers.event,
		debug: loggers.debug
	};
}

//#endregion
//#region src/index.ts
const defaultColors = createColorMap();
const chalk = createChalk();
function color(name, text) {
	return color$1(defaultColors, name, text);
}
function bgColor(name, text) {
	return bgColor$1(defaultColors, name, text);
}
var src_default = chalk;

//#endregion
export { DEFAULT_COLORS, add, bgColor, bold, chalk, color, createChalk, createColorMap, src_default as default, getBackgroundStyle, getForegroundStyle, resolveColor };
//# sourceMappingURL=index.mjs.map