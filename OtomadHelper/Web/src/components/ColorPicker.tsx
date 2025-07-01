import { StyledButton } from "./Button";

const PADDING = 3;

const StyledColorButton = styled(StyledButton)`
	--border-highlight-y-offset: 0 !important;
	position: relative;
	aspect-ratio: 1 / 1;
	margin: ${-PADDING}px !important;
	padding: ${PADDING}px;
	min-inline-size: 40px;
	outline: 1px solid transparent;

	&,
	.fill {
		${styles.mixins.circle()};
	}

	input {
		visibility: hidden;
	}

	.fill {
		position: absolute;
		inset: ${PADDING}px;
		background-color: ${c("color")};
		border-radius: inherit;
		box-shadow: 0 0 0 1px ${getContrastiveColor("color", 0.37)} inset;

		&.spectrum {
			background:
				radial-gradient(closest-side, ${c("background-color")}, transparent),
				conic-gradient(in oklch longer hue, red, red);
			background-color: ${c("color")};
			box-shadow: 0 0 0 1px ${c("foreground-color", 37)} inset;
		}
	}

	.icon,
	.animated-icon {
		position: absolute;
		color: ${getContrastiveColor("color")};
		font-size: 16px;

		&:is(.spectrum ~ *) {
			color: ${c("foreground-color")};
		}
	}

	.icon:not(.animating, :hover),
	.animated-icon:not(.animating) {
		opacity: 0;
	}

	&:hover {
		.animated-icon {
			opacity: 1;
		}

		.fill {
			opacity: 0.9;
		}
	}

	&:active {
		--border-outline-color: ${c("fill-color-subtle-tertiary")};
		background-color: ${c("fill-color-subtle-secondary")};

		.animated-icon {
			--state: pressed;
			opacity: ${c("pressed-text-opacity")};
		}

		.fill {
			opacity: 0.8;
		}
	}

	&:not(:hover, :active) {
		background: none;
		box-shadow: none !important;
	}

	&[disabled] {
		opacity: 0.5;
		filter: grayscale(0.5);
	}

	&[aria-checked="true"] {
		outline-color: ${c("stroke-color-focus-stroke-outer")};

		&[data-colored-selected-outline] {
			--stroke-color-focus-stroke-outer: lch(from ${c("color")} 50 c h); // Change selected focused outline color.
		}
	}

	&:focus {
		z-index: 1; // Place the focused ring above the selected ring.
	}
`;

export function ColorButton({ color, icon, animatedIcon, selected = false, value: [value, setValue] = NEVER_MIND, showIconWhenHovering = false, colorAlt, showSpectrum = false, autoStartViewTransition, coloredSelectedOutline, style, role = "radio", onClick, children, ...htmlAttrs }: FCP<{
	/** Color. */
	color?: string;
	/** Icon. */
	icon?: DeclaredIcons;
	/** Animated icon. */
	animatedIcon?: DeclaredLotties;
	/** Selected? */
	selected?: boolean;
	/** Model value. Current color and set the color. */
	value?: StateProperty<string>;
	/** Show the icon or animated icon only when hovering? */
	showIconWhenHovering?: boolean;
	/** If specified, the visual color will be replaced, but the internal logic will still use the original color. */
	colorAlt?: string;
	/** Show color spectrum? */
	showSpectrum?: boolean;
	/** Auto start color palette view transition? */
	autoStartViewTransition?: boolean;
	/** Make selected outline colored? */
	coloredSelectedOutline?: boolean;
}, "button">) {
	const [isIconAnimating, setIsIconAnimating] = useState(false);
	// The edit icon will keep showing until the animation finishes playing.

	if (value !== undefined) selected ||= value === color;

	const handleClick: MouseEventHandler<HTMLButtonElement> = async e => {
		if (autoStartViewTransition) {
			emit("app:startColorPaletteViewTransition");
			await delay(0);
		}
		onClick?.(e);
		if (color) setValue?.(color);
	};

	return (
		<StyledColorButton
			{...htmlAttrs}
			style={{ ...style, "--color": colorAlt ?? color }}
			aria-checked={selected}
			role={role}
			data-colored-selected-outline={coloredSelectedOutline}
			onClick={handleClick}
		>
			<div className={["fill", { spectrum: showSpectrum }]} />
			{animatedIcon ? <AnimatedIcon name={animatedIcon} className={{ animating: !showIconWhenHovering || isIconAnimating }} onPlayStateChange={setIsIconAnimating} /> :
			icon && <Icon name={icon} className={{ animating: !showIconWhenHovering }} />}
			{children}
		</StyledColorButton>
	);
}

const DEFAULT_COLOR = "#000000";
const toHex = (color: string = "black") => {
	try {
		return new Color(color).toString({ format: "hex", collapse: false });
	} catch {
		return DEFAULT_COLOR;
	}
};

export default function ColorPicker({ color: [color, setColor], computedColor, role = "button", showIconWhenHovering = true, showSpectrumWhenUnselected = false, selected, autoStartViewTransition, ...htmlAttrs }: FCP<Override<PropsOf<typeof ColorButton>, {
	/** Color. */
	color: StateProperty<string>;
	/** If the color is dynamic generated, then get the correct color. */
	computedColor?(): string;
	/** Show color spectrum when it is not selected? */
	showSpectrumWhenUnselected?: boolean;
	children?: never;
}>>) {
	const inputColorEl = useDomRef<"input">();
	// const [_correctColor, setCorrectColor] = useState(color);
	// const correctColor = toHex(computedColor ? _correctColor : color);
	const correctColor = useMemo(() => {
		return toHex(computedColor?.() ?? color);
	}, [color, computedColor]);

	const setColorDelayed = async (color: string) => {
		if (!setColor) return;
		if (autoStartViewTransition) {
			emit("app:startColorPaletteViewTransition");
			await delay(0);
		}
		setColor(color);
	};

	const handleClick: MouseEventHandler = async e => {
		e.stopPropagation();
		if (window.isWebView) {
			const [ok, newHex] = await bridges.bridge.showColorPicker(correctColor || DEFAULT_COLOR);
			if (ok) setColorDelayed(newHex);
		} else inputColorEl.current?.click();
	};

	return (
		<ColorButton
			{...htmlAttrs}
			color={correctColor}
			animatedIcon="edit"
			role={role}
			selected={selected}
			showIconWhenHovering={showIconWhenHovering}
			showSpectrum={!selected && showSpectrumWhenUnselected}
			onClick={handleClick}
		>
			{!window.isWebView && <input ref={inputColorEl} type="color" value={correctColor} onChange={e => setColorDelayed(e.currentTarget.value)} />}
		</ColorButton>
	);
}
