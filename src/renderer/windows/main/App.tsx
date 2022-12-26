import { ReactComponent as ReactLogo } from "@assets/react.svg";
import { ReactComponent as ViteLogo } from "@assets/vite.svg";
import "./App.css";
import { useEffect, useRef } from "react";

function App() {
	const webview = useRef<Electron.WebviewTag>(null);

	useEffect(() => {
		if (webview.current) {
			webview.current.addEventListener("dom-ready", () => {
				// webview.current?.loadURL("app://hello-world/index.html");
				webview.current?.openDevTools();
			});
		}
	}, []);

	return (
		<div>
			<div className="logo">
				<a href="https://vitejs.dev" target="_blank">
					<ViteLogo />
				</a>
				<a href="https://reactjs.org" target="_blank">
					<ReactLogo className="spin react" />
				</a>
			</div>
			<h1>VITE + ELECTRON + REACT</h1>
			<div className="card">
				<button onClick={window.electron.open}>Open Second Window</button>
			</div>
			<p className="read-the-docs">
				Below is webview, that is load by custom protocol.
			</p>
			<webview
				id="webview"
				ref={webview}
				className="webview"
				src="app://hello-world/index.html"
			></webview>
		</div>
	);
}

export default App;
