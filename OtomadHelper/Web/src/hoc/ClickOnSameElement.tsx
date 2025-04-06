export default function ClickOnSameElement({ bubbling = true, children, onClick, ref }: {
	/** The child must be ONE HTML or React element. */
	children: ReactElement;
	ref?: ForwardedRef<"section">;
	/** Allows to click on its descendant elements until they bubble up to the target element? Defaults to true. */
	bubbling?: boolean;
	/**
	 * Make sure that if press mouse button while on child content and release it on parent, that does not count as click on parent.
	 * @see https://stackoverflow.com/q/76955236/19553213
	 *
	 * Also change mouse event to pointer event so you can distinct with mouse and touch.
	 */
	onClick?: PointerEventHandler<HTMLElement>;
}) {
	const target = useDomRef<"section">();
	const isPressed = useRef(false);
	useImperativeHandleRef(ref, target);
	const stopAt = ["button", "input", "textarea", "datalist", "select", ".toggle-switch-label"];
	const checkSame = (target: EventTarget | null, current: EventTarget | null) =>
		bubbling ? isInPath(target, current, { stopAt }) : target === current;

	const onPointerDown: PointerEventHandler<HTMLElement> = e => {
		if (checkSame(e.target, e.currentTarget))
			isPressed.current = true;
	};

	const onPointerUp = (e: PointerEvent) => {
		if (e.target === document) return;
		if (e.type !== "pointerup" || isPressed.current && checkSame(e.target, target.current) && e.button === 0)
			onClick?.(e as React.PointerEvent<HTMLElement>);
		isPressed.current = false;
	};

	useEventListener(document, "pointerup", onPointerUp, undefined, null);

	return (
		<EventInjector ref={target} onPointerDown={onPointerDown} onKeyUp={e => e.code.in("Space", "Enter") && onPointerUp(e as never)}>
			{children}
		</EventInjector>
	);
}
