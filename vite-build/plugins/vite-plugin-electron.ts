import { builtinModules } from "module";
import { InlineConfig, Plugin, build as viteBuild, mergeConfig } from "vite";
import { takeAllFileName } from "../utils/path";

const generatePreloadConfig = () => {
	const preloadFiles = takeAllFileName("./src/preload");
	const result: InlineConfig[] = [];

	for (let file of preloadFiles) {
		const config: InlineConfig = {
			build: {
				outDir: "./dist/preload",
				lib: {
					entry: `./src/preload/${file}`,
				},
			},
		};

		result.push(config);
	}

	return result;
};

const configs: InlineConfig[] = [
	...generatePreloadConfig(),
	{
		build: {
			outDir: "./dist/main",
			lib: {
				entry: "./src/main/index.ts",
			},
		},
	},
];

export default function electron(): Plugin[] {
	return [
		{
			name: "vite-plugin-electron",
			apply: "serve",
			configureServer(server) {
				server.httpServer?.once("listening", async () => {
					for (const config of configs) {
						await build({ mode: server.config.mode, ...config });
					}
					startElectron();
				});
			},
		},
		{
			name: "vite-plugin-electron",
			apply: "build",
			config(config, env) {
				// Make sure that Electron can be loaded into the local file using `loadFile` after packaging.
				config.base = "./";
			},
			closeBundle() {
				for (const config of configs) {
					build(config);
				}
			},
		},
	];
}

const build = (config: InlineConfig) => {
	const finalConfig = mergeConfig(
		{
			root: process.cwd(),
			publicDir: false,
			configFile: false,
			build: {
				sourcemap: true,
				emptyOutDir: false,
				lib: {
					formats: ["cjs"],
					fileName: () => "[name].js",
				},
				rollupOptions: {
					external: ["electron", ...builtinModules],
				},
			},
			resolve: {
				mainFields: ["module", "jsnext:main", "jsnext"],
			},
		},
		config
	);

	return viteBuild(finalConfig);
};

const startElectron = async (argv = [".", "--no-sandbox"]) => {
	const { spawn } = await import("child_process");
	const electron = await import("electron");
	const electronPath = <string>(<unknown>(electron.default ?? electron));

	if (process.electronApp) {
		process.electronApp.removeAllListeners();
		process.electronApp.kill();
	}

	// Start Electron.app
	process.electronApp = spawn(electronPath, argv, { stdio: "inherit" });
	// Exit command after Electron.app exits
	process.electronApp.once("exit", process.exit);
};
