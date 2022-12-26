import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
	open: () => {
		ipcRenderer.invoke("open-second-window");
	},
});
