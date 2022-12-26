import { ReactComponent as ElectronTitleLogo } from "@assets/electron.svg";
import classNames from "classnames";
import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";
import "./App.css";
import styles from "./test.css";
import styles2 from "./test2.module.css";
// const classNames = require("classnames");
// const { ipcRenderer } = require("electron");

function App() {
	const [path, setPath] = useState("");

	useEffect(() => {
		const getAppPath = async () => {
			const path = await ipcRenderer.invoke("get-app-path");

			setPath(path);
		};

		getAppPath();
	}, []);

	return (
		<div>
			<div>
				<a href="https://www.electronjs.org/" target="_blank">
					<ElectronTitleLogo />
				</a>
			</div>
			<h1>SECOND WINDOW</h1>
			<div className="card">
				<p className="read-the-docs testModule">
					node: {process.versions.node}
				</p>
				<p className={classNames("read-the-docs", styles.testModule)}>
					chrome: {process.versions.chrome}
				</p>
				<p className={classNames("read-the-docs", styles2.testModule)}>
					electron: {process.versions.electron}
				</p>
				<p className={classNames("read-the-docs")}>path: {path}</p>
			</div>
		</div>
	);
}

export default App;
