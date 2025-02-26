export type StickyDetectionMethod = "intersection" | "scroll";

/**
 * Event to detect when `position: sticky` is triggered.
 * @note Currently only supports top sticky.
 * @param element - HTML DOM element.
 * @param method - Detection method.
 * - `intersection` - Using Intersection Observer to detect. When the element is level with the top, it will cause a 1 pixel offset.
 * - `scroll` - Using scroll event listener to detect.
 * @returns Is sticky?
 * @see https://stackoverflow.com/questions/16302483
 * @see https://developer.chrome.com/docs/css-ui/sticky-headers
 */
export function useIsSticky(element: RefObject<HTMLElement | null>, method: StickyDetectionMethod) {
	const [isSticky, setIsSticky] = useState(false);

	const visible = useIsVisible(element);

	useEffect(() => {
		const el = toValue(element);
		if (!el || !visible || getComputedStyle(el).position !== "sticky") return;

		switch (method) {
			case "intersection": {
				const observer = new IntersectionObserver(([entry]) => {
					const style = getComputedStyle(entry.target);
					const detectAbove = style.top !== "auto", detectBelow = style.bottom !== "auto";
					const intersection = entry.isIntersecting ? "visible" :
						entry.intersectionRect.bottom === entry.rootBounds?.bottom ? "below" :
						entry.intersectionRect.top === entry.rootBounds?.top ? "above" : "both";
					setIsSticky(intersection !== "visible" && (
						intersection === "both" ||
						detectAbove && intersection === "above" ||
						detectBelow && intersection === "below"
					));
				}, {
					// rootMargin: "-1px 0px 0px 0px",
					threshold: [1],
				});
				observer.observe(el);
				return () => observer.disconnect();
			}
			case "scroll": {
				const parent = getScrollParent(el);
				if (!parent) return;
				const onScroll = () => {
					setIsSticky(parent.scrollTop > 0);
				};
				parent.addEventListener("scroll", onScroll);
				return () => parent.removeEventListener("scroll", onScroll);
			}
			default:
				break;
		}
	});

	return isSticky;
}

const scrollableOverflowValues = ["scroll", "auto", "overlay"];
function getScrollParent(element: Element) {
	let parent = element.parentElement;
	while (parent) {
		const style = getComputedStyle(parent);
		if (
			scrollableOverflowValues.includes(style.overflowY) ||
			style.overscrollBehaviorY !== "auto" ||
			style.scrollbarGutter !== "auto"
		)
			return parent;
		parent = parent.parentElement;
	}
	return null;
}

export function useIsVisible(element: MaybeRef<HTMLElement | null>) {
	const [visible, setVisible] = useState(!!toValue(element)?.checkVisibility());

	useMountEffect(() => {
		const el = toValue(element);
		if (!el) return;

		const observer = new IntersectionObserver(entries => entries.forEach(entry => {
			setVisible(entry.intersectionRatio > 0);
		}));
		observer.observe(el);

		return () => observer.disconnect();
	});

	return visible;
}
