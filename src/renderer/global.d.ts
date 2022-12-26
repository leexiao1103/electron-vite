export declare global {
	interface Window {
		versions: {
			node: () => string;
			chrome: () => string;
			electron: () => string;
		};

		electron: {
			open: () => void;
		};
	}
}
