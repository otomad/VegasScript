declare interface Body {
	/**
	 * Fetch data with XML.
	 * @see https://stackoverflow.com/questions/37693982
	 */
	xml(): Promise<Document>;
}

declare interface HTMLImageElement {
	/**
	 * Wait for the image is just loaded.
	 */
	waitForLoaded(): Promise<HTMLImageElement>;
}

declare interface HTMLCanvasElement {
	/**
	 * Async get the image blob url shown on the canvas.
	 */
	toBlobURL(): Promise<string>;
}

declare interface Element {
	/**
	 * Get an array from the specified element that traces back to the root element.
	 *
	 * Used to find the event target and bubble up to find the required element.
	 *
	 * @returns An array of the specified element that traces back to the root element.
	 */
	readonly path: Element[];
}

declare interface DOMTokenList {
	/**
	 * Returns true if any of tokens are present, and false for none of them.
	 *
	 * @example
	 * ```typescript
	 * el.classList.containsAny("foo", "bar");
	 * // Equivalent to
	 * (el.classList.contains("foo") || el.classList.contains("bar"));
	 * ```
	 */
	containsAny(...tokens: string[]): boolean;
}
