/*
 * Forward modules from the `styles` directory.
 */

import { highContrastMediaQuery } from "helpers/color-mode";
import type { ColorNames, SystemColors } from "styles/colors";
import eases from "styles/eases";
import effects from "styles/effects";
import { type AvailableLottieStatus, STATUS_PREFIX } from "styles/fake-animations";
import mixins from "styles/mixins";

export { ifColorScheme } from "styles/colors";

export const fallbackTransitions = `all ${eases.easeOutMax} 250ms, color ${eases.easeOutMax} 100ms, visibility 0s, var(--fallback-transitions-for-contrast-scheme)` as const;

/**
 * Apply the theme color.
 * @remarks "c" stands for "color".
 * @param cssVarName - The CSS property name of the color. Does not need to add "--" before it. It can also be `white` or `black`.
 * @param alpha - Alpha value, note that it is a percentage value rather than a decimal value between 0 and 1. If left blank, it indicates an opaque color.
 * @returns The custom property solid color called by `var()`, or the translucent color encapsulated by relative color function `rgba(from ...)`.
 */
export function c(cssVarName: string & {} | "white" | "black" | ColorNames, alpha?: number | string) {
	if (typeof alpha === "number" && (Number.isNaN(alpha) || alpha < 0 || alpha > 100) || alpha === "")
		throw RangeError("The alpha parameter should be in range [0, 100]");
	if (cssVarName === "white" || cssVarName === "black")
		return alpha === undefined ? cssVarName :
			typeof alpha === "number" ?
				"#" + (cssVarName === "white" ? "f" : "0").repeat(6) + Math.round(alpha / 100 * 255).toString(16).padStart(2, "0") :
				`rgb(${cssVarName === "white" ? "255 255 255" : "0 0 0"} / ${alpha})`;
	return alpha === undefined ? `var(--${cssVarName})` :
		`rgb(from var(--${cssVarName}) r g b / calc(alpha * ${typeof alpha === "number" ? alpha + "%" : alpha}))`;
}

/**
 * Apply the system color which used in high contrast color theme.
 * @remarks "cc" stands for "contrast color".
 * @param systemColor - CSS system color name.
 * @returns System color.
 */
export const cc = (systemColor: SystemColors) => systemColor;

/**
 * Make your selector higher in priority.
 * @param priority - The priority, the bigger the number, the higher it is. Less than or equal to zero has no effect.
 * @returns
 * ```less
 * // before
 * .your-selector${important(5)} { }
 * // after
 * .your-selector:not[#\#]:not[#\#]:not[#\#]:not[#\#]:not[#\#] { }
 * ```
 */
export function important(priority: number = 1) {
	return ":not(#\\#)".repeat(priority);
}

function toValue_css(value: string | number | undefined) {
	return typeof value === "number" ? value + "px" : value;
}

export { eases };

export const styles = {
	mixins,
	effects,
	/**
	 * Get the corresponding CSS style value based on a string or number.
	 *
	 * Add "px" unit if the value is a number, or return the value itself if it already has a unit.
	 *
	 * This function takes a value as input and returns a CSS value. If the input value is a number,
	 * it is converted to a CSS length value with the unit "px". Otherwise, the input value is returned
	 * as is. This function is used to convert the calculated position values to CSS values.
	 *
	 * @remarks A function name that given by GPT is **`pxify`**.
	 *
	 * @param value
	 * - If the value passed in is a number, its corresponding pixel value is returned;
	 * if the value passed in is a string, the original string value is retained.
	 * - The CSS value, a number (treat as px unit) or a string.
	 *
	 * @returns The CSS value of the given value.
	 *
	 * @example
	 * ```javascript
	 * console.log(styles.toValue(8)); // "8px"
	 * console.log(styles.toValue("2rem")); // "2rem"
	 * ```
	 */
	toValue: toValue_css,
};

export const getLottieStatusName = (status: AvailableLottieStatus) => `${STATUS_PREFIX}${status}`;

export const useLottieStatus = {
	name: (status: AvailableLottieStatus) => css`animation-name: ${getLottieStatusName(status)};`,
	animation: (status: AvailableLottieStatus) => css`animation: ${getLottieStatusName(status)} 1s infinite;`,
};

enum TransitionGroupState {
	appear = 0b001,
	enter = 0b010,
	exit = 0b100,

	appearEnter = 0b011,
	enterExit = 0b110,
	all = 0b111,
}

/**
 * The state selector rule generated for the outrageous selector of React Transition Group.
 *
 * However, after trying to modify the source code with magic and adding an additional `enter-from` state,
 * I found it still not working well and I don't know the specific reason.
 *
 * @param states - The state of the transition group, including the bitwise AND value of `appear`, `enter`, and `exit`.
 * @param name - Optional transition group animation name, leave blank to indicate not included.
 * @returns The generated state selector.
 */
export function tgs(states: TransitionGroupState = TransitionGroupState.all, name: string = "") {
	if (name) name += "-";
	const selectors: string[] = [];
	if (states & TransitionGroupState.appear)
		selectors.push(`&.${name}appear:not(.${name}appear-active)`);
	if (states & TransitionGroupState.enter)
		selectors.push(`&.${name}enter:not(.${name}enter-active)`);
	if (states & TransitionGroupState.exit)
		selectors.push(`&:is(.${name}exit-active, .${name}exit-done)`);
	return selectors.join(", ");
}
tgs.appear = TransitionGroupState.appear;
tgs.enter = TransitionGroupState.enter;
tgs.exit = TransitionGroupState.exit;
tgs.appearEnter = TransitionGroupState.appearEnter;
tgs.enterExit = TransitionGroupState.enterExit;
tgs.all = TransitionGroupState.all;

/**
 * Gets the positioning value of the tooltip based on the given tooltip placement and offset value.
 * @param rect - Target element size rectangle.
 * @param placement - The placement in which the flyout appears.
 * @param offset - Offset from the target element.
 * @param flyoutRect - Flyout element size rectangle.
 * @param adjustBySize - If false, only the position of the point will be returned (by default);
 * if true, it will be adjusted to the coordinates of its upper left corner according to the size of the element.
 * @returns The style attribute value that represents the tooltip position.
 */
export function getPosition(rect: MaybeRef<DOMRect | Element>, placement?: Placement, offset: number = 10, flyoutRect?: MaybeRef<DOMRect | Element | TwoD | undefined>) {
	rect = toValue(rect);
	flyoutRect = toValue(flyoutRect);
	if (rect instanceof Element) rect = rect.getBoundingClientRect();
	if (isRtl())
		if (placement === "left") placement = "right";
		else if (placement === "right") placement = "left";
	if (!placement || placement === "x" || placement === "y") { // The default tooltip placement looks for the direction furthest from the edge of the page.
		const toPageDistance = [rect.top, window.innerHeight - rect.bottom, window.innerWidth - rect.right, rect.left];
		if (placement === "x") toPageDistance[0] = toPageDistance[1] = -Infinity;
		else if (placement === "y") toPageDistance[2] = toPageDistance[3] = -Infinity;
		const placements = ["top", "bottom", "right", "left"] as const; // Priority order: top, bottom, right, left.
		placement = placements[toPageDistance.indexOf(Math.max(...toPageDistance))];
	}
	let position: TwoD;
	if (placement === "top")
		position = [rect.left + rect.width / 2, rect.top - offset];
	else if (placement === "bottom")
		position = [rect.left + rect.width / 2, rect.bottom + offset];
	else if (placement === "left")
		position = [rect.left - offset, rect.top + rect.height / 2];
	else
		position = [rect.right + offset, rect.top + rect.height / 2];
	if (flyoutRect) {
		if (flyoutRect instanceof Element) flyoutRect = flyoutRect.getBoundingClientRect();
		else if (Array.isArray(flyoutRect)) flyoutRect = { width: flyoutRect[0], height: flyoutRect[1] } as DOMRect;
		if (placement === "top")
			position = [position[0] - flyoutRect.width / 2, position[1] - flyoutRect.height];
		else if (placement === "bottom")
			position = [position[0] - flyoutRect.width / 2, position[1]];
		else if (placement === "left")
			position = [position[0] - flyoutRect.width, position[1] - flyoutRect.height / 2];
		else
			position = [position[0], position[1] - flyoutRect.height / 2];
	}
	return {
		position,
		style: { left: position[0] + "px", top: position[1] + "px" } as CSSProperties,
		placement,
		offset,
	};
}

/**
 * Detect element overflow. If the element exceeds the scope of the page, move it within the page.
 * @private
 * @param location - The coordinates of the element (only supported on tuple types).
 * @param size - The dimensions of the element (only supported for tuple types).
 * @returns The new coordinates after moving into the page.
 */
function moveIntoPage_tuple(location: TwoD, size: TwoD) {
	const result = [...location] as typeof location;
	const windowSize = [window.innerWidth, window.innerHeight];
	for (let i = 0; i < 2; i++) {
		if (result[i] + size[i] > windowSize[i])
			result[i] = windowSize[i] - size[i];
		if (result[i] < 0)
			result[i] = 0;
	}
	return result;
}

/**
 * Detect element overflow. If the element exceeds the scope of the page, move it within the page.
 * @param location - Tuple type coordinates of the element.
 * @param size - Tuple type dimensions of the element.
 * @returns The new coordinates after moving into the page.
 */
export function moveIntoPage(location: MaybeRef<TwoD>, size?: MaybeRef<TwoD | DOMRect | undefined>): TwoD;
/**
 * Detect element overflow. If the element exceeds the scope of the page, move it within the page.
 * @param element - HTML DOM element.
 * @returns The new coordinate style declaration after moving into the page.
 */
export function moveIntoPage(element: MaybeRef<HTMLElement>): { top: string; left: string };
/**
 * Detect element overflow. If the element exceeds the scope of the page, move it within the page.
 * @param measureElement - The HTML DOM element to measure.
 * @param adjustElement - The HTML DOM element to reposition.
 * @returns The new coordinate style declaration after moving into the page.
 */
export function moveIntoPage(measureElement: MaybeRef<HTMLElement>, adjustElement?: MaybeRef<HTMLElement | undefined>): { top: string; left: string };
/**
 * Detect element overflow. If the element exceeds the scope of the page, move it within the page.
 * @param location - The coordinates of the element.
 * @param size - The dimensions of the element.
 * @returns The new coordinates after moving into the page.
 */
export function moveIntoPage(location: MaybeRef<TwoD | HTMLElement>, size?: MaybeRef<TwoD | DOMRect | HTMLElement | undefined>) {
	location = toValue(location);
	size = toValue(size);
	const adjustElementStyle = size instanceof Element && size.style;
	let returnAsStyle = false;
	if (location instanceof Element) {
		returnAsStyle = true;
		const rect = location.getBoundingClientRect();
		location = [rect.x, rect.y];
		size = [rect.width, rect.height];
	}
	if (size instanceof DOMRect)
		size = [size.width, size.height];
	const result = moveIntoPage_tuple(location, size as TwoD);
	if (adjustElementStyle) {
		const adjustment = (["left", "top"] as const).map(pos => parseFloat(adjustElementStyle[pos])) as TwoD;
		location.forEach((original, i) => result[i] += adjustment[i] - original);
	}
	if (!returnAsStyle) return result;
	return getLocationStyle(result);
}

/**
 * Converts 2D coordinates to the location style value.
 * @param location - 2D coordinates.
 * @returns Location style value.
 */
export function getLocationStyle(location: MaybeRef<TwoD>): CSSProperties {
	location = toValue(location);
	return location[0] !== 0 || location[1] !== 0 ? { left: location[0] + "px", top: location[1] + "px" } : {};
}

/**
 * Retrieves bounding client rectangle of the given HTML DOM element.
 *
 * @deprecated
 *
 * @param element - The HTML DOM element (or even EventTarget or null) and get the bounding client rectangle from.
 * @returns A tuple containing the x, y, width, and height of the bounding client rectangle.
 *
 * @remarks
 * This function is useful when you need to get the position and dimensions of an HTML DOM element.
 * It first converts the given EventTarget or null to an HTMLElement using the `toValue` function.
 * Then, it retrieves the bounding client rectangle of the HTMLElement using the `getBoundingClientRect` method.
 * Finally, it returns a tuple containing the x, y, width, and height of the bounding client rectangle.
 *
 * @note In RTL mode, the `x` still indicates the left position instead of the right position.
 *
 * @example
 * ```typescript
 * const element = document.getElementById("myElement");
 * const [x, y, width, height] = getBoundingClientRectTuple(element);
 * console.log(`Element position: x=${x}, y=${y}, width=${width}, height=${height}`);
 * ```
 */
export function getBoundingClientRect(element: MaybeRef<EventTarget | null>): DOMRect {
	const el = toValue(element) as HTMLElement;
	let rect = el.getBoundingClientRect();
	const zoom = configStore.settings.uiScale1;
	rect = zoomDomRect(rect, zoom);
	return rect;
}

/**
 * Zooms the given DOMRect by a specified zoom factor.
 *
 * @param rect - The DOMRect to be zoomed.
 * @param zoom - The zoom factor to apply to the DOMRect.
 *
 * @returns A new DOMRect with the same position and dimensions as the original, but scaled by the specified zoom factor.
 *
 * @remarks
 * This function returns a new DOMRect by multiplying each numeric property by the given zoom factor.
 * It is useful for scaling UI elements or adjusting coordinates based on the UI scale.
 *
 * @example
 * ```typescript
 * const originalRect = new DOMRect(10, 20, 30, 40);
 * const zoomFactor = 2;
 * const newRect = zoomDomRect(originalRect, zoomFactor);
 * console.log(newRect); // Output: DOMRect {x: 20, y: 40, width: 60, height: 80,...}
 * ```
 */
export function zoomDomRect(rect: DOMRect, zoom: number) {
	const { x, y, width, height } = rect;
	return new DOMRect(x * zoom, y * zoom, width * zoom, height * zoom);
}

/**
 * Use pure CSS to calculate the high contrast text color (black or white) by the oklab model from
 * the specified background color.
 * @param colorVar - Background color CSS custom property name, the initial two dashes can be omitted.
 * @param alpha - The alpha value of the color, defaults to 1.
 * @returns A contrastive text color.
 * @remarks When `color-contrast()` available, this function will be deprecated.
 */
export function getContrastiveColor(colorVar: string, alpha: number = 1) {
	if (!colorVar.startsWith("--")) colorVar = "--" + colorVar;
	return `oklch(from var(${colorVar}) calc(1 - round(to-zero, L / 0.65)) 0 0 / ${alpha})`;
	// Cannot use `infinity`.
}

/**
 * Useful when you want to convert
 * ```typescript
 * element.style.backgroundColor = "black";
 * ```
 * to
 * ```typescript
 * element.style.setProperty("background-color", "black");
 * ```
 *
 * @example
 * · backgroundColor ⇒ background-color
 * · webkitTextStroke ⇒ -webkit-text-stroke
 * · --custom-property ⇒ --custom-property
 *
 * @param camel - Camel case CSS style property name, except CSS custom property.
 * @returns Kebab case CSS style property name.
 */
export function convertCamelStylePropertyToKebab(camel: string) {
	return camel.startsWith("--") ? camel : new VariableName(camel).cssProperty;
}

/**
 * A hook to get if the system color scheme is forced-colors or prefers-contrast.
 * @note This is the system setting, not the manual setting.
 * @returns Is high contrast color scheme?
 */
export function useIsSystemContrastScheme() {
	const getMedia = () => window.matchMedia(highContrastMediaQuery);

	const [contrast, setContrast] = useState(getMedia().matches);

	useMountEffect(() => {
		const media = getMedia();
		media.onchange = ({ matches }) => setContrast(matches);
		return () => { media.onchange = null; };
	});

	return contrast;
}
