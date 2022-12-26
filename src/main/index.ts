import { app, BrowserWindow, ipcMain, protocol, session } from "electron";
import { join, resolve } from "path";
import Remote from "@electron/remote/main";

const root = resolve(__dirname, "../");
const resourcesPath = resolve(root, "../resources");

Remote.initialize();

const mod = require("../../index.node");

mod.getSystemInfo();

app.on("ready", () => {
	const window = new BrowserWindow({
		width: 1400,
		height: 1200,
		webPreferences: {
			preload: join(root, "preload/main-preload.js"),
			webviewTag: true,
		},
	});

	if (app.isPackaged) {
		window.loadFile(join(root, "index.html"));
	} else {
		window.loadURL("http://localhost:5173/index.html");
	}

	protocol.registerFileProtocol("app", (request, callback) => {
		const url = new URL(request.url);
		const convert = join(resourcesPath, `app/${url.hostname}${url.pathname}`);
		console.log("file protocol", url);
		console.log("convert", convert);

		callback(convert);
	});

	const webContents = window.webContents;

	webContents.openDevTools();

	webContents.on("will-attach-webview", (e, webPreferences) => {});

	webContents.on("did-attach-webview", (e, webview) => {
		webview.session.protocol.registerFileProtocol(
			"app-resources",
			(request, callback) => {
				const url = new URL(request.url);
				const convert = join(
					resourcesPath,
					`app/${url.hostname}${url.pathname}`
				);
				console.log("webview resource", url);
				console.log("convert", convert);

				callback(convert);
			}
		);
	});
});

ipcMain.handle("open-second-window", (event, arg) => {
	const window = new BrowserWindow({
		webPreferences: {
			// preload: join(root, "preload/second-preload.js"),
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	if (app.isPackaged) {
		window.loadFile(join(root, "windows/second", "index.html"));
	} else {
		window.loadURL("http://localhost:5173/windows/second/index.html");
	}

	window.webContents.openDevTools();
});

ipcMain.handle("get-app-path", (event, arg) => {
	return app.getPath("userData");
});
