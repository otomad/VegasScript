export default function ClickOnSameElement({ children, onClick, ref }: {
	/** The child must be ONE HTML or React element. */
	children: ReactElement;
	ref?: ForwardedRef<"section">;
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
	const stopAt = "button"; // Stop at button.

	const onPointerDown: PointerEventHandler<HTMLElement> = e => {
		if (isInPath(e.target, e.currentTarget, stopAt))
			isPressed.current = true;
	};

	useEventListener(document, "pointerup", e => {
		if (isPressed.current && isInPath(e.target, target.current, stopAt))
			onClick?.(e as React.PointerEvent<HTMLElement>);
		isPressed.current = false;
	});

	return (
		<EventInjector ref={target} onPointerDown={onPointerDown}>
			{children}
		</EventInjector>
	);
}

function isInPath(target: EventTarget | null, element: Element | null, stopAt: string) {
	const path = getPath(target);
	for (const el of path) {
		if (el === element) return true;
		if (el.matches(stopAt)) return false;
	}
	return false;
}
