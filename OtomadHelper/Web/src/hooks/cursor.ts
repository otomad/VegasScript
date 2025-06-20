import { convertAniBinaryToCSS } from "ani-cursor";

/**
 * Forcefully specify the mouse cursor style.
 *
 * [MDN Reference](https://developer.mozilla.org/zh-CN/docs/Web/CSS/cursor)
 *
 * @param cursor - Cursor style. If it is null, it will restore to the default.
 */
export function forceCursor(cursor: Cursor | (string & {}) | null) {
	if (!cursor)
		document.documentElement.style.removeProperty("--cursor");
	else
		document.documentElement.style.setProperty("--cursor", cursor);
}

/**
 * Use animated mouse cursor (.ani).
 *
 * @param element - HTML DOM element reference.
 * @param aniUrl - The path of the animated mouse cursor.
 */
export function useAniCursor(element: RefObject<HTMLElement | null>, aniUrl: string) {
	useAsyncEffect(async () => {
		const isCreated = () => !!document.head.querySelector(`style[data-ani-url="${aniUrl}"]`);
		if (!isCreated()) {
			const response = await fetch(aniUrl);
			const data = new Uint8Array(await response.arrayBuffer());
			if (isCreated()) return;

			const style = document.createElement("style");
			style.dataset.aniUrl = aniUrl;
			style.innerText = convertAniBinaryToCSS(`[data-anicursor="${aniUrl}"]`, data);

			document.head.appendChild(style);
		}
	}, [aniUrl]);

	useEffect(() => {
		element.current && (element.current.dataset.anicursor = aniUrl);
	}, [aniUrl]);
}
