export { };

namespace AnimatedIconStateNS {
	export type Tuple = [marker?: string, loop?: boolean, speed?: number];
	export type Object = { marker?: string; loop?: boolean; speed?: number };
}

declare global {
	/** Check box selection status. */
	type CheckState = "unchecked" | "indeterminate" | "checked";

	type AnimatedIconState = AnimatedIconStateNS.Tuple | AnimatedIconStateNS.Object;

	/** The status of info bar, badge, etc. */
	type Status = "neutual" | "accent" | "info" | "asterisk" | "warning" | "success" | "error";

	/** The placement of tooltips, flyouts, etc. */
	type Placement = "top" | "right" | "bottom" | "left" | "x" | "y";

	/** Item view mode. */
	type ItemView = "list" | "tile" | "grid" | "grid-list";

	/**
	 * Curve Type, Video Keyframe Type, or OFX Interpolation Type.
	 */
	type CurveType = "linear" | "fast" | "slow" | "smooth" | "sharp" | "hold";

	/**
	 * A string that represents the priority (e.g. `"important"`) if one exists.
	 * If none exists, returns the empty string.
	 */
	type StylePriority = "important" | "";

	type StatePropertiedObject<TState> = {
		[property in keyof TState]: StatePropertyNonNull<TState[property]>;
	};

	/** Three stage switch type. */
	type TrueFalseAuto = "true" | "false" | "auto";

	/** The type of oscillator to use. Must be one of the following: "sine", "square", "sawtooth", "triangle". */
	type OscillatorCommonType = Exclude<OscillatorType, "custom">;

	/** The values that badge can be accepted. */
	type BadgeValue = string | number | boolean | undefined;

	/** Badge value and status. */
	type BadgeArgs = [badge?: BadgeValue, status?: Status, hidden?: boolean];

	/** A type which includes the numeric value and its unit enum type. */
	type Unit<TUnit extends string> = [numeric: number, unit: TUnit];

	/**
	 * The `aria-checked` attribute indicates the current "checked" state of checkboxes, radio buttons, and other widgets.
	 *
	 * The `aria-checked` attribute indicates whether the element is checked (`true`), unchecked (`false`), or if the checked
	 * status is indeterminate (`mixed`), meaning it is neither checked nor unchecked. The mixed value is supported by the
	 * tri-state input roles of `checkbox` and `menuitemcheckbox`.
	 *
	 * The mixed value is not supported on radio, menuitemradio, or switch and elements that inherits from these. The value
	 * will be false if mixed is set when not supported.
	 *
	 * [MDN Reference](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Attributes/aria-checked)
	 */
	type AriaChecked = React.AriaAttributes["aria-checked"];

	/**
	 * The `role` read-only property of the `ElementInternals` interface returns the
	 * [WAI-ARIA role](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Roles) for the element. For example,
	 * a checkbox might have `role="checkbox"`. It reflects the `role` attribute; it does not return the element's implicit ARIA
	 * role, if any, unless explicitly set.
	 *
	 * A string which contains an ARIA role. A full list of ARIA roles can be found on the
	 * [ARIA techniques page](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/ARIA_Techniques).
	 *
	 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/ElementInternals/role)
	 */
	type AriaRole = React.AriaRole;

	/** React element with a HTML DOM element ref prop. */
	type ReactElementWithDomRef = ReactElement<{ ref?: RefObject<Element | null> }>;

	/** Audio or Visual. */
	type StreamKind = "audio" | "visual";
}
