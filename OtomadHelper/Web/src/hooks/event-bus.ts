import type { ApplicationEvents } from "helpers/host-messages";
import mitt from "mitt";

const emitter = mitt<ApplicationEvents>();

/**
 * Emits an event to the global event emitter.
 *
 * @template TKey - The type of event key.
 * @param type - The event type.
 * @param args - The event data.
 * @returns Nothing.
 *
 * @example
 * ```typescript
 * // fire an event
 * emit("foo", { a: "b" });
 * ```
 */
export const emit: <Key extends keyof ApplicationEvents>(type: Key, ...args: ApplicationEvents[Key]) => void = (type, ...args) =>
	emitter.emit(type, args);

type UseListenDelegateCallback = {
	<Key extends keyof ApplicationEvents>(type: Key, handler: (...args: ApplicationEvents[Key]) => void): void;
	(type: "*", handler: (type: keyof ApplicationEvents, ...args: ApplicationEvents[keyof ApplicationEvents]) => void): void;
};
type UseListenDelegate<Callback = UseListenDelegateCallback> = Callback & { on: Callback };
type UseListenVegasCommandDelegateCallback = (type: WebMessageEvents.VegasCommandEvent["event"], handler: () => void) => void;

const _useListenInternal = (type: string, handler: Function, useHook: boolean) => {
	const callback = (typeOrArgs: string | unknown[], args: unknown[]) => {
		if (type === "*") handler(typeOrArgs, ...args);
		else handler(...typeOrArgs);
	};
	if (!useHook) (emitter.on as Function)(type as keyof ApplicationEvents, callback);
	else (useEffect as Function)(() => {
		(emitter.on as Function)(type as keyof ApplicationEvents, callback);
		return () => (emitter.off as Function)(type as keyof ApplicationEvents, callback);
	});
};

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
export const useListen: UseListenDelegate = Object.assign(
	(type: string, handler: Function) => _useListenInternal(type, handler, true),
	{ on: (type: string, handler: Function) => _useListenInternal(type, handler, false) },
);

export const useListenVegasCommand = Object.assign(
	((type, handler) => { useListen("host:vegasCommandEvent", ({ event }) => { if (event === type) handler(); }); }) as UseListenVegasCommandDelegateCallback,
	{ on: ((type, handler) => { useListen.on("host:vegasCommandEvent", ({ event }) => { if (event === type) handler(); }); }) as UseListenVegasCommandDelegateCallback },
);

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
