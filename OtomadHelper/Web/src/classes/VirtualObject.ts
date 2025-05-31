/**
 * A class representing a Virtual Object.
 *
 * The constructor of this class will return a proxy instead of the instance of the class.
 *
 * The object returned ensures that no errors occur when getting, setting, or checking existence on it, its properties, or its descendants.
 *
 * @example
 * ```typescript
 * const foo = new VirtualObject();
 * foo.bar.baz.qux.quux.corge.grault.garply.waldo.fred.plugh.xyzzy.thud; // No error reported.
 * ```
 *
 * Useful when you want to hack something on a certain browser.
 *
 * The following case involves performing special proprietary operations on Chrome, but ensuring that Firefox will not stop working as a result.
 *
 * @example
 * ```typescript
 * window.chrome ??= new VirtualObject();
 * window.chrome.webview.hostObjects; // No error reported.
 * ```
 */
export default (class VirtualObject {
	/**
	 * @param toStringValue - Custom the string when `toString` called in the object.
	 */
	constructor(toStringValue = "") {
		const aFunctionToGetThis = { ""() { return new VirtualObject(); } }[""];
		Object.defineProperty(aFunctionToGetThis, "toString", { value: () => toStringValue, configurable: true });
		return new Proxy(aFunctionToGetThis, {
			get: (_, property) => {
				if ([Symbol.toPrimitive, "toString", "valueOf"].includes(property))
					return () => toStringValue;
				return aFunctionToGetThis();
			},
			set: () => true,
			has: () => true,
			ownKeys: () => [],
		});
	}
}) as new (toStringValue?: string) => Any;
