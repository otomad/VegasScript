type ScrollByDelegate = (delta: number) => void;
const applyScroll = new WeakMap<Element, ScrollByDelegate>();

export default function HorizontalScroll<TContainer extends AsTarget>({ enabled = true, children, ref, as = "div" as TContainer, container, ...htmlAttrs }: {
	/** When user use mouse wheel to scroll, should it scroll horizontally instead of default vertically? */
	enabled?: boolean;
	/** Modify the container type. Defaults to `React.Fragment` (aka nothing). */
	as?: TContainer;
	/** Same as `as`, but compatible with Styled Components. */
	container?: TContainer;
	children?: ReactNode;
	ref?: MiscRef<Any>;
}) {
	const Container = (container ?? as) as GetReactElementFromTag<"div">;
	if (Container === Fragment) htmlAttrs = {};

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

	const scrollBy: ScrollByDelegate = delta => {
		if (!el.current || !enabled) {
			stopUpdating();
			return;
		}
		if (!isUpdating()) scrollTarget.current = scrollValue.current = el.current.scrollLeft;
		const scrollRight = el.current.scrollWidth - el.current.clientWidth;
		scrollTarget.current = clamp(scrollTarget.current + delta, 0, scrollRight);
		update();
	};

	const onWheel: WheelEventHandler = e => {
		if (e.deltaX || !e.deltaY || e.shiftKey || e.ctrlKey || !el.current || !enabled) {
			stopUpdating();
			return;
		}
		e.preventDefault();
		scrollBy(e.deltaY);
	};

	useEffect(() => {
		return () => stopUpdating();
	}, [enabled, stopUpdating]);

	useEffect(() => {
		if (el.current) applyScroll.set(el.current, scrollBy);
	});

	if (!enabled) return <Container {...htmlAttrs}>{children}</Container>;

	return (
		<EventInjector ref={el} onWheel={onWheel} onPointerDown={stopUpdating}>
			<Container {...htmlAttrs}>{children}</Container>
		</EventInjector>
	);
}

HorizontalScroll.applyScroll = applyScroll;
