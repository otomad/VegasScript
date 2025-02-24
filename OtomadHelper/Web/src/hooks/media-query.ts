import { highContrastMediaQuery } from "helpers/color-mode";

interface UseMediaQueryOptions {
	/** If currently in SSR, specify the initial value during rendering. */
	ssrInitial?: boolean;
	/** Always get a one-time static value, unresponsive? */
	noHook?: boolean;
}

/**
 * Reactive [Media Query](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Testing_media_queries).
 * Once you've created a MediaQueryList object, you can check the result of the query or
 * receive notifications when the result changes.
 * @param query - A string specifying the media query to parse into a
 * [MediaQueryList](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList).
 * @returns The document currently matches the media query list?
 * @example
 * ```typescript
 * const isLargeScreen = useMediaQuery("(min-width: 1024px)");
 * const isPreferredDark = useMediaQuery("(prefers-color-scheme: dark)");
 * ```
 */
export function useMediaQuery(query: string, { ssrInitial = false, noHook = false }: UseMediaQueryOptions = {}) {
	const isSSR = typeof window === "undefined";
	const getMedia = () => window.matchMedia(query);
	const matches = () => getMedia().matches;
	const initial = isSSR ? ssrInitial : matches();
	if (noHook || !canUseHook()) return initial;
	const [matched, setMatched] = useState(initial);
	useMountEffect(() => {
		const media = getMedia();
		media.onchange = ({ matches }) => setMatched(matches);
		return () => { media.onchange = null; };
	});
	return matched;
}

/**
 * System uses light theme.
 * ```css
 * @media (prefers-color-scheme: light)
 * ```
 */
useMediaQuery.light = (options?: UseMediaQueryOptions) => useMediaQuery("(prefers-color-scheme: light)", options);
/**
 * System uses dark theme.
 * ```css
 * @media (prefers-color-scheme: dark)
 * ```
 */
useMediaQuery.dark = (options?: UseMediaQueryOptions) => useMediaQuery("(prefers-color-scheme: dark)", options);
/**
 * System uses high contrast theme.
 * @note This is the system setting, not the manual setting.
 * ```css
 * @media (forced-colors: active) or (prefers-contrast: more)
 * ```
 */
useMediaQuery.contrast = (options?: UseMediaQueryOptions) => useMediaQuery(highContrastMediaQuery, options);
/**
 * Page is displaying on the screen.
 * ```css
 * @media screen
 * ```
 */
useMediaQuery.screen = (options?: UseMediaQueryOptions) => useMediaQuery("screen", options);
/**
 * Page is being displayed on the printer.
 * ```css
 * @media screen
 * ```
 */
useMediaQuery.print = (options?: UseMediaQueryOptions) => useMediaQuery("print", options);
/**
 * System requires to reduce the motion.
 * ```css
 * @media (prefers-reduced-motion: reduce)
 * ```
 */
useMediaQuery.reduceMotion = (options?: UseMediaQueryOptions) => useMediaQuery("(prefers-reduced-motion: reduce)", options);
/**
 * System requires to reduce the transparency.
 * ```css
 * @media (prefers-reduced-transparency: reduce)
 * ```
 */
useMediaQuery.reduceTransparency = (options?: UseMediaQueryOptions) => useMediaQuery("(prefers-reduced-transparency: reduce)", options);
