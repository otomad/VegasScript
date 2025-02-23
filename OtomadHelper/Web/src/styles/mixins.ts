import { type BorderRadiusPosition, setBorderRadius } from "./internal";

type ResponsiveUnit = "v" | "dv" | "lv" | "sv" | "cq";

export default {
	/**
	 * Center the element with the **flex** layout (flex - center - center).
	 */
	flexCenter: () => css`
		display: flex;
		justify-content: center;
		align-items: center;
	`,
	/**
	 * Center the element with the **grid** layout (grid - center).
	 */
	gridCenter: () => css`
		display: grid;
		place-items: center;
	`,
	/**
	 * Become a square.
	 *
	 * Equal in width and height.
	 * @param size - Side length.
	 * @param withSizeVar - Create a CSS custom property named `--size` to make it easier for other components to modify its size?
	 */
	square: ((size: string, withSizeVar: boolean = false, responsiveUnit?: ResponsiveUnit) =>
		!responsiveUnit ?
			!withSizeVar ?
				css`
					width: ${size};
					height: ${size};
				` :
				css`
					--size: ${size};
					width: var(--size);
					height: var(--size);
				` :
			!withSizeVar ?
				css`
					width: ${size}${responsiveUnit}w;
					height: ${size}${responsiveUnit}h;
				` :
				css`
					--size: ${size};
					width: calc(var(--size) * 1${responsiveUnit}w);
					height: calc(var(--size) * 1${responsiveUnit}h);
				`
	) as {
		(size: string, withSizeVar?: boolean): RuleSet;
		(size: number, withSizeVar: boolean, responsiveUnit?: ResponsiveUnit): RuleSet;
	},
	/**
	 * Become a oval.
	 *
	 * Set border radius to a very large value.
	 * @param position - The position of the rounded corners.
	 */
	oval: (position: BorderRadiusPosition = "full") =>
		setBorderRadius("calc(infinity * 1px)", position),
	/**
	 * Become a circle.
	 *
	 * Set border radius to 100%.
	 * @param position - The position of the rounded corners.
	 */
	circle: (position: BorderRadiusPosition = "full") =>
		setBorderRadius("100%", position),
	/**
	 * Cancel the focus ring style of the parent element, and forward it to a child element to apply the focus ring style.
	 * @param childSelector - Child element selector.
	 * @param inset - Makes focus ring inside the element.
	 */
	forwardFocusRing: (childSelector: string = ".base", inset: boolean = false) => css`
		&:focus-visible {
			box-shadow: none;
			transition: inherit;

			${childSelector} {
				${styles.effects.focus(inset)};
			}
		}
	`,
	/**
	 * Fill the element to the entire screen.
	 *
	 * Set both width and height to 100% of the window width and height value.
	 * @param position - Specify the `position` property of the element.
	 */
	fullscreen: (position: "fixed" | "absolute" = "fixed") => css`
		position: ${position};
		top: 0;
		left: 0;
		width: 100dvw;
		height: 100dvh;
	`,
	/**
	 * Hide the element when it is empty.
	 */
	hideIfEmpty: () => css`
		&:empty {
			display: none;
		}
	`,
	/**
	 * Enable hardware 3D. Used to solve certain problems that may cause flickering during transitions.
	 * @remarks This will replace or be replaced with existing transform properties.
	 */
	enableHardware3d: () => css`
		transform: translateZ(1px);
	`,
	/**
	 * Effectively hide the scroll bar. However, the elements are still scrollable.
	 *
	 * Support both modern and legacy declaration simultaneously.
	 */
	noScrollbar: () => css`
		@supports (scrollbar-width: auto) {
			scrollbar-width: none;
		}

		@supports selector(::-webkit-scrollbar) {
			&::-webkit-scrollbar {
				width: 0;
				height: 0;
			}
		}
	`,
};
