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
