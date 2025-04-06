export default function DynamicAutoSize({ specified, lockSize, children }: FCP<{
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

	return cloneRef(deferredChildren, el);
}
