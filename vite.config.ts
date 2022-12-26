import react from "@vitejs/plugin-react";
import { rmSync } from "fs";
import path, { resolve } from "path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import autoCssModule from "./vite-build/plugins/vite-plugin-auto-css-module";
import electron from "./vite-build/plugins/vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";

rmSync(path.join(__dirname, "dist"), { recursive: true, force: true });

const root = resolve(__dirname, "src/renderer");
const outDir = resolve(__dirname, "dist");

// https://vitejs.dev/config/
export default defineConfig({
	root,
	plugins: [
		svgr(),
		react(),
		autoCssModule(),
		electron(),
		renderer({ nodeIntegration: true }),
	],
	// plugins: [react()],
	build: {
		outDir,
		copyPublicDir: false,
		emptyOutDir: true,
		sourcemap: true,
		rollupOptions: {
			input: {
				main: resolve(root, "index.html"),
				second: resolve(root, "windows/second", "index.html"),
			},
		},
	},
	resolve: {
		alias: {
			"@": path.join(__dirname, "src"),
			"@main": path.join(__dirname, "src/main"),
			"@renderer": path.join(__dirname, "src/renderer"),
			"@assets": path.join(__dirname, "src/renderer/assets"),
		},
	},
});
