export default function DynamicAutoSize({ specified, lockSize, children }: FCP<{
	/** Explicitly specify which direction needs to be animated. Defaults to height animation. */
	specified?: "width" | "height" | "both";
	/** Temporarily lock the content size? */
	lockSize?: boolean;
}, "section">) {
	const el = useDomRef<"section">();
	const deferredChildren = useDeferredValue(children);
	const isStale = children !== deferredChildren || lockSize;

	useAsyncEffect(async () => {
		const content = el.current;
		// if (!content || !content.offsetParent) return;
		if (!content || content.closest("main.page")?.classList.contains("enter-done") === false) return; // This line has better performance than the above line, as it avoids layout thrashing.
		if (!isStale) await nextAnimationTick();
		content.style.interpolateSize = isStale ? "numeric-only" : null!;
		content.style.willChange = isStale ? "width, height" : null!;
		if (specified === "height" || specified === "both")
			content.style.height = isStale ? content.offsetHeight + "px" : null!;
		if (specified === "width" || specified === "both")
			content.style.width = isStale ? content.offsetWidth + "px" : null!;
	});

	return cloneRef(deferredChildren, el);
}
