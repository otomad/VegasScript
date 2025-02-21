export default function HorizontalScroll<TContainer extends AsTarget>({ enabled = true, children, ref, as = "div" as TContainer, container, ...htmlAttrs }: {
	/** When user use mouse wheel to scroll, should it scroll horizontally instead of default vertically? */
	enabled?: boolean;
	/** Modify the container type. Defaults to `React.Fragment` (aka nothing). */
	as?: TContainer;
	/** Same as `as`, but compatible with Styled Components. */
	container?: TContainer;
	children?: ReactNode;
	ref?: React.Ref<Any>;
}) {
	const Container = (container ?? as) as GetReactElementFromTag<"div">;
	if (Container === Fragment) htmlAttrs = {};

	if (!enabled) return <Container {...htmlAttrs}>{children}</Container>;

	const el = useDomRef<"div">();
	useImperativeHandleRef(ref, el);

	const scrollTarget = useRef(0);
	const scrollValue = useRef(0);
	const animationId = useRef<number>(undefined);
	const isUpdating = () => animationId.current !== undefined;
	const spring = 0.5;

	const stopUpdating = useCallback(() => {
		cancelAnimationFrame(animationId.current);
		animationId.current = undefined;
	}, []);

	function update() {
		stopUpdating();
		if (!enabled) return;
		scrollValue.current += (scrollTarget.current - scrollValue.current) * spring * getFrameInterval60();
		animationId.current = requestAnimationFrame(update);
		// eslint-disable-next-line curly
		if (Math.abs(scrollValue.current - scrollTarget.current) <= 1e-2) {
			// scrollValue.current = scrollTarget.current;
			stopUpdating();
		}
		el.current?.scrollTo({ left: scrollValue.current, behavior: "instant" });
	}

	const onWheel: WheelEventHandler = e => {
		if (e.deltaX || !e.deltaY || e.shiftKey || e.ctrlKey || !el.current || !enabled) {
			stopUpdating();
			return;
		}
		e.preventDefault();
		if (!isUpdating()) scrollTarget.current = scrollValue.current = el.current.scrollLeft;
		const scrollRight = el.current.scrollWidth - el.current.clientWidth;
		scrollTarget.current = clamp(scrollTarget.current + e.deltaY, 0, scrollRight);
		update();
	};

	useEffect(() => {
		return () => stopUpdating();
	}, [enabled]);

	return (
		<EventInjector ref={el} onWheel={onWheel} onPointerDown={stopUpdating}>
			<Container {...htmlAttrs}>{children}</Container>
		</EventInjector>
	);
}
