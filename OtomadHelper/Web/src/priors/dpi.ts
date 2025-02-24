/*
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio#monitoring_screen_resolution_or_zoom_level_changes
 */

let remove: (() => void) | null = null;

const updatePixelRatio = () => {
	remove?.();
	const queryString = `(resolution: ${window.devicePixelRatio}dppx)`;
	const media = window.matchMedia(queryString);
	media.addEventListener("change", updatePixelRatio);
	remove = () => media.removeEventListener("change", updatePixelRatio);

	document.documentElement.style.setProperty("--dpi", String(window.devicePixelRatio));
};

updatePixelRatio();
