export default function ClickOnSameElement({ children, onClick, ref }: {
	/** The child must be ONE HTML or React element. */
	children: ReactElement;
	ref?: ForwardedRef<"section">;
	/**
	 * Make sure that if press mouse button while on child content and release it on parent, that does not count as click on parent.
	 * @see https://stackoverflow.com/q/76955236/19553213
	 */
	onClick?: MouseEventHandler;
}) {
	const target = useDomRef<"section">();
	const isPressed = useRef(false);
	useImperativeHandleRef(ref, target);

	const onMouseDown: MouseEventHandler<HTMLElement> = e => {
		if (e.currentTarget === e.target)
			isPressed.current = true;
	};

	useEventListener(document, "mouseup", e => {
		if (isPressed.current && target.current === e.target)
			onClick?.(e as React.MouseEvent);
		isPressed.current = false;
	});

	return (
		<EventInjector ref={target} onMouseDown={onMouseDown}>
			{children}
		</EventInjector>
	);
}
