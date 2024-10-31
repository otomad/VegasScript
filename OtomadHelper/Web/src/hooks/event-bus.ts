import type { ApplicationEvents } from "helpers/host-messages";
import mitt from "mitt";

const emitter = mitt<ApplicationEvents>();

/**
 * Emits an event to the global event emitter.
 *
 * @template TKey - The type of event key.
 * @param type - The event type.
 * @param event - The event data.
 *
 * @example
 * ```typescript
 * // fire an event
 * useEvent("foo", { a: "b" });
 * ```
 */
export const useEvent: <Key extends keyof ApplicationEvents>(type: Key, ...args: ApplicationEvents[Key]) => void = (type, ...args) =>
	emitter.emit(type, args);

/**
 * Listens to an event on the global event emitter.
 *
 * @template TKey - The type of event key.
 * @param type - The event type.
 * @param handler - The event handler function.
 *
 * @example
 * ```typescript
 * // listen to an event
 * useListen("foo", e => console.log("foo", e));
 *
 * // listen to all events
 * useListen("*", (type, e) => console.log(type, e));
 * ```
 */
export const useListen: {
	<Key extends keyof ApplicationEvents>(type: Key, handler: (...args: ApplicationEvents[Key]) => void): void;
	(type: "*", handler: (type: keyof ApplicationEvents, ...args: ApplicationEvents[keyof ApplicationEvents]) => void): void;
} = (type: string, handler: Function) => {
	const callback = (typeOrArgs: string | unknown[], args: unknown[]) => {
		if (type === "*") handler(typeOrArgs, ...args);
		else handler(...typeOrArgs);
	};
	if (!canUseHook()) (emitter.on as Function)(type as keyof ApplicationEvents, callback);
	else useEffect(() => {
		(emitter.on as Function)(type as keyof ApplicationEvents, callback);
		return () => (emitter.off as Function)(type as keyof ApplicationEvents, callback);
	});
};

export const useListenKeybinding = (type: WebMessageEvents.TriggerKeybinding["event"], handler: () => void) => {
	useListen("host:triggerKeybinding", ({ event }) => {
		if (event === type) handler();
	});
};

/**
 * Listens to an event on the global event emitter once.
 *
 * The handler function is called when the event is emitted, and then the event listener is removed.
 *
 * @template TKey - The type of event key.
 * @param type - The event type.
 * @param handler - The event handler function.
 *
 * @example
 * ```typescript
 * // listen to an event once
 * listenOnce("foo", e => console.log("foo", e));
 * ```
 */
export function listenOnce<TKey extends keyof ApplicationEvents>(type: TKey, handler: (event: ApplicationEvents[TKey]) => void) {
	const handlerWithOff: typeof handler = event => {
		emitter.off(type, handlerWithOff);
		handler(event);
	};
	emitter.on(type, handlerWithOff);
}

/**
 * Listens to an event on the global event emitter and returns an acknowledgement to the C# host immediately.
 *
 * The returned acknowledgement includes the original handler function result with a timestamp property.
 *
 * @template TKey - The type of event key.
 * @param type - The event type.
 * @param handler - The event handler function.
 */
export function useListenAndReturnAck<TKey extends keyof ApplicationEvents>(type: TKey, handler: (...args: ApplicationEvents[TKey]) => Any) {
	useListen(type as "host:dragOver", e => {
		if (!("timestamp" in e)) {
			console.error(e);
			throw new TypeError("Received event is invalid, it has no timestamp property");
		}
		type DateTimeInJson = string; // C# System.Text.Json will convert DateTime to string.
		const timestamp = e.timestamp as DateTimeInJson;
		let result = (handler as Function)(e);
		if (!(isObject(result) && !Array.isArray(result)))
			result = { value: result, timestamp: undefined! as DateTimeInJson };
		result.timestamp = timestamp;
		window.chrome.webview.hostObjects.webMessageAcknowledgement.Ack(JSON.stringify(result));
	});
}
