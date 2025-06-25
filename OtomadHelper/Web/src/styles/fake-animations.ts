export const STATUS_PREFIX = "-status-";
export type AvailableLottieStatus = typeof fakeAnimations[number];

const fakeAnimations = [
	"Normal",
	"Hover",
	"Pressed",
	"Selected",
	"HoverSelected",
	"PressedSelected",
] as const;

export default fakeAnimations.map(identifier => css`
	// stylelint-disable block-no-empty
	// stylelint-disable at-rule-prelude-no-invalid
	@keyframes ${STATUS_PREFIX}${identifier} {}
`);
