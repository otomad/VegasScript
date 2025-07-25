const $popovers = () => document.getElementById("popovers") ?? document.body;

/**
 * Make a focus diffusion effect around the target element.
 * @param element - Target HTML DOM element.
 */
export async function makeFocusDiffusionEffect(element: TargetType, { borderRadius }: {
	/** Override the border-radius property for the focus ring. If not specified, it will auto inherit the value from the target element. */
	borderRadius?: CSSProperty.BorderRadius | null;
}) {
	const el = targetToElement(element), popovers = $popovers();
	if (!el || !popovers) return;
	const ring = document.createElement("div");
	ring.style.position = "fixed";
	ring.style.pointerEvents = "none";
	const rect = el.getBoundingClientRect();
	for (const property of ["top", "left", "width", "height"] as const)
		ring.style[property] = rect[property] + "px";
	if (borderRadius === undefined) ({ borderRadius } = getComputedStyle(ring));
	if (borderRadius && borderRadius !== "0px") ring.style.borderRadius = borderRadius;
	popovers.append(ring);
	const duration = 500;
	await Promise.all([
		ring.animate({
			boxShadow: [`0 0 0 ${c("accent-color")}`, `0 0 50px ${c("accent-color")}`],
		}, { duration, easing: eases.easeOutQuad }).finished,
		ring.animate({
			opacity: [1, 0],
		}, { duration, easing: "linear" }).finished,
	]);
	ring.remove();
}
