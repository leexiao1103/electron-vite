import { readFileSync } from "fs";
import { extname, dirname, join, parse, resolve } from "path";
import { Plugin, ResolvedConfig } from "vite";



export default function autoCssModule(): Plugin {
	const fileMap = new Map<string, string>(); // <key: absolute file path, value: resolve id>
	const AUTO_CSS_MODULE_SUFFIX = "?inject-auto-css-module";
	let viteConfig: ResolvedConfig;

	const toFullPath = (path: string) => {
		return path.startsWith(viteConfig.root)
			? path
			: join(viteConfig.root, path);
	};

	return {
		name: "vite-plugin-auto-css-module",
		enforce: "pre",

		configResolved(config) {
			viteConfig = config;
			// console.log(viteConfig);
		},

		resolveId(source, importer, options) {
			if (options.isEntry) return null;

			const fullPath = resolve(dirname(importer), source);
			const cache = fileMap.get(fullPath);

			if (cache) return toFullPath(cache);

			if (needResolve(source)) {
				const convert = toCssModulePath(fullPath);
				const result = `${convert}${AUTO_CSS_MODULE_SUFFIX}`;

				console.log("[auto-css-module] resolve", source);
				console.log("[auto-css-module] resolve convert to", result);

				return result;
			}

			return null;
		},

		load(id, options) {
			if (id.endsWith(AUTO_CSS_MODULE_SUFFIX)) {
				const entryId = id.slice(0, -AUTO_CSS_MODULE_SUFFIX.length);
				const convert = toCssPath(entryId);
				const fullPath = toFullPath(convert);

				console.log("[auto-css-module] load", id);
				console.log("[auto-css-module] load convert to", fullPath);

				fileMap.set(fullPath, id);

				return readFileSync(fullPath, "utf-8");
			}

			return null;
		},

		handleHotUpdate({ server, file, modules }) {
			const id = fileMap.get(file);

			if (id) {
				const module = server.moduleGraph.getModuleById(id);

				console.log("[auto-css-module] hmr handle", file);
				console.log("[auto-css-module] hmr handle id", id);

				return [module];
			}
		},
	};
}

const cssFile = `\.(css|scss|styl|stylus|pcss|postcss)($|\\?)`;
const cssFileRegExp = new RegExp(cssFile);
const cssModuleRegExp = new RegExp(`\.module${cssFile}`);

const needResolve = (source: string) => {
	const fileName = parse(source).name;
	const isCssFile = cssFileRegExp.test(source);
	const notNodeModules = !source.includes("node_modules");
	const notCssModule = !cssModuleRegExp.test(source);

	return (
		isCssFile &&
		notNodeModules &&
		notCssModule &&
		fileName !== "index" &&
		fileName !== "App"
	);
};

const toCssModulePath = (filePath: string) => {
	// for production build
	const clean = filePath.replace("?used", "");
	const ext = extname(clean);

	return clean.replace(cssFileRegExp, `.module${ext}`);
};

const toCssPath = (filePath: string) => {
	// for production build
	const clean = filePath.replace("?used", "");
	const ext = extname(clean);

	return filePath.replace(cssModuleRegExp, `${ext}`);
};
