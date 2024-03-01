export type ColorScheme = "light" | "dark" | "auto";
const lightModePreference = window.matchMedia("(prefers-color-scheme: light)");

let lastClickMouseEvent: MouseEvent | undefined;
document.addEventListener("click", e => lastClickMouseEvent = e, true);

const changeColorScheme = (isLight?: boolean | ColorScheme) => {
	if (typeof isLight === "string")
		isLight = isLight === "light" ? true : isLight === "dark" ? false : undefined;
	if (isLight === undefined) isLight = lightModePreference.matches;
	const updateThemeSettings = () => document.documentElement.dataset.scheme = isLight ? "light" : "dark";
	const afterUpdateThemeSettings = () => useColorModeStore.setState(() => ({ backgroundColor: getComputedStyle(document.body).backgroundColor }));

	if (!lastClickMouseEvent) {
		updateThemeSettings();
		setTimeout(afterUpdateThemeSettings, 1000);
	} else {
		const { x, y } = lastClickMouseEvent;
		const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
		const clipPath = [
			`circle(0px at ${x}px ${y}px)`,
			`circle(${endRadius}px at ${x}px ${y}px)`,
		];
		const CHANGING_COLOR_SCHEME_CLASS = "changing-color-scheme";
		document.documentElement.classList.add(CHANGING_COLOR_SCHEME_CLASS);
		startViewTransition(updateThemeSettings, {
			clipPath: isLight ? clipPath : clipPath.toReversed(),
		}, {
			duration: 300,
			easing: eases.easeInOutSmooth,
			pseudoElement: isLight ? "::view-transition-new(root)" : "::view-transition-old(root)",
		}).then(() => {
			document.documentElement.classList.remove(CHANGING_COLOR_SCHEME_CLASS);
			afterUpdateThemeSettings();
		});
	}
};
const getUserColorScheme = () => useColorModeStore.getState().scheme;

// #region Init color mode
lightModePreference.addEventListener("change", e => getUserColorScheme() === "auto" && changeColorScheme(e.matches));
changeColorScheme(getUserColorScheme());
useColorModeStore.subscribe(state => state.scheme, scheme => changeColorScheme(scheme));
// #endregion
