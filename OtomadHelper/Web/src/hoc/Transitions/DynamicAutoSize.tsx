export default function DynamicAutoSize({ specified, lockSize, children }: FCP<{ // BUG: After auto resize, when scrolling page, some content will not display immediately.
	/** Explicitly specify which direction needs to be animated. Defaults to height animation. */
	specified?: "width" | "height" | "both";
	/** Temperately lock the content size? */
	lockSize?: boolean;
}, "section">) {
	const el = useDomRef<"section">();
	const deferredChildren = useDeferredValue(children);
	const isStale = children !== deferredChildren || lockSize;

	useEffect(() => {
		const content = el.current;
		if (!content || !content.offsetParent) return;
		content.style.interpolateSize = isStale ? "numeric-only" : null!;
		if (specified === "height" || specified === "both")
			content.style.height = isStale ? content.offsetHeight + "px" : null!;
		if (specified === "width" || specified === "both")
			content.style.width = isStale ? content.offsetWidth + "px" : null!;
	});

	return React.Children.map(deferredChildren, child => {
		if (!isValidElement(child)) return child;
		return React.cloneElement(child as ReactElementWithDomRef, {
			ref: el,
		});
	});
}
