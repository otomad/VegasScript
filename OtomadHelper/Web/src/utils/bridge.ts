class Bridge {
	private webViewBridge;

	private static instance = new Map<string, Bridge>();

	constructor(bridgeName: string) {
		const instance = Bridge.instance.get(bridgeName);
		if (instance) return instance;

		this.webViewBridge = window.chrome.webview.hostObjects[bridgeName];

		const availableMethods = window.chrome.webview.hostObjects.sync[bridgeName].GetMethods();

		availableMethods.forEach((methodName: string) => {
			const camelCaseMethodName = new VariableName(methodName).camel;

			(this as AnyObject)[camelCaseMethodName] = (...args: unknown[]) => this.runMethod(methodName, args);
		});

		Bridge.instance.set(bridgeName, this);
	}

	// Only works in WebView2 1.0.1293.44+
	private runMethod = async<TResult>(methodName: string, args: unknown[]): Promise<TResult> => {
		const argsJson = args.map(arg => JSON.stringify(arg));

		const returnJson = await this.webViewBridge!.RunMethod(methodName, JSON.stringify(argsJson));

		return JSON.parse(returnJson);
	};
}

const EMPTY = {};
type HostObjects = Window["chrome"]["webview"]["hostObjects"];
export const bridges = new Proxy(EMPTY, {
	get(_, bridgeName) {
		if (typeof bridgeName === "symbol") throw new TypeError("Cannot use symbol as bridge name");
		return new Bridge(bridgeName);
	},
}) as HostObjects;
globals.bridges = bridges;

/**
 * Post message to host (C#).
 * @param message - Message.
 */
export function postMessageToHost(message: Any) {
	window.chrome.webview.postMessage(message);
}
globals.postMessageToHost = postMessageToHost;

// Event of communication from native code to web page
window.isWebView = !!window.chrome.webview;
window.chrome ??= new VirtualObject();
window.chrome.webview ??= new VirtualObject();
window.chrome.webview.addEventListener("message", e => {
	const { type, ...data } = e.data;
	console.log(type, data);
	useEvent(`host:${type}`, data);
});

useListen("host:consoleLog", ({ severity, message }) => {
	console[severity]?.(message);
});
