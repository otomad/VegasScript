/*
 * @see https://github.com/theKashey/react-event-injector
 */

type FilterOnEvents<TDomAttributes> = Partial<OmitNevers<{
	[event in keyof TDomAttributes]-?:
		event extends `on${string}` ?
		event extends `${string}Capture` ? never : TDomAttributes[event] :
		never;
}>>;

type AllEvents = FilterOnEvents<React.DOMAttributes<HTMLElement> & {
	// For events which are not shown in the DOM attributes.
	onAnimationCancel: AnimationEventHandler<HTMLElement>;
	onScrollEnd: BaseEventHandler<HTMLElement>;
	onFocusIn: FocusEventHandler<HTMLElement>;
	onFocusOut: FocusEventHandler<HTMLElement>;
}>;

type Options = boolean | AddEventListenerOptions | EventListenerOptions;

const eventAttrToType = (eventName: string) => eventName.toLowerCase().replace(/^on/, "");

/**
 * Declarative React event manager. Uses standard addEventListener underneath,
 * and able to overtake current [React API Limitations](https://github.com/facebook/react/issues/6436).
 *
 * Please don't overuse this library, as long "React" way to attach events is far more performant,
 * and better working with React itself.
 *
 * ### `EventInjector` - To inject events somewhere down the tree.
 *
 * #### Why?
 * - To inject passive events. There is no way to inject them in "react-way".
 * - To inject events where you need, without relaying on bubbling or capturing or some react details.
 * - To get native DOM event, not `React.Synthetic`.
 * - To work with DOM Tree, not `React.Tree`.
 */
export default function EventInjector({ children, ref, options, ...events }: FCP<{
	children: ReactElement;
	ref?: ForwardedRef<"section">;
	/**
	 * Event listener options.
	 *
	 * @default
	 * ```typescript
	 * { passive: false }
	 * ```
	 */
	options?: Options;
} & AllEvents>) {
	const childEl = useDomRef<"section">();
	useImperativeHandleRef(ref, childEl);

	useEffect(() => {
		const child = childEl.current;
		if (!child) return;
		for (const [name, listener] of Object.entries(events))
			child.addEventListener(eventAttrToType(name), listener as never, options);
		return () => {
			for (const [name, listener] of Object.entries(events))
				child.removeEventListener(eventAttrToType(name), listener as never, options);
		};
	}, [children, options]);

	return cloneRef(children, childEl);
}

/**
 * `PassiveListener` - To inject "passive" events, which could be quite useful to make application run smoothly.
 * ```typescript
 * { passive: true }
 * ```
 */
EventInjector.Passive = function EventInjector_Passive({ options = { passive: true }, ...props }: PropsOf<typeof EventInjector>) {
	return <EventInjector {...props} options={options} />;
};
/**
 * `ActiveListener` - To inject non "passive" events, as long some events are passive by default.
 * ```typescript
 * { passive: false }
 * ```
 */
EventInjector.Active = function EventInjector_Passive({ options = { passive: false }, ...props }: PropsOf<typeof EventInjector>) {
	return <EventInjector {...props} options={options} />;
};
