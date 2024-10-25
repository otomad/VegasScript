export default function DynamicAutoSize({ specified, children }: FCP<{
	/** Explicitly specify which direction needs to be animated. Defaults to height animation. */
	specified?: "width" | "height" | "both";
}, "section">) {
	const el = useDomRef<"section">();
	const deferredChildren = useDeferredValue(children);
	const isStale = children !== deferredChildren;

	useEffect(() => {
		const content = el.current;
		if (!content) return;
		content.style.interpolateSize = isStale ? "numeric-only" : null!;
		if (specified === "height" || specified === "both")
			content.style.height = isStale ? content.offsetHeight + "px" : null!;
		if (specified === "width" || specified === "both")
			content.style.width = isStale ? content.offsetWidth + "px" : null!;
	});

	return React.Children.map(deferredChildren, child => {
		if (!React.isValidElement(child)) return child;
		return React.cloneElement(child as ReactElement, {
			ref: el,
		});
	});
}
