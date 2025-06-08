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
		${styles.mixins.square(`calc(100% - ${PADDING}px * 2)`)};
		position: absolute;
		background-color: ${c("color")};
		/* border: 1px solid ${c("foreground-color", 37)}; */
		/* stylelint-disable-next-line declaration-block-no-duplicate-properties */
		border: 1px solid ${getContrastiveColor("color", 0.37)};

		&::after {
			content: "";
			position: absolute;
			inset: -1px;
			background:
				radial-gradient(closest-side, ${c("background-color")}, transparent),
				conic-gradient(in oklch longer hue, red, red);
			border-radius: inherit;
			opacity: 0;
		}

		&.spectrum {
			background-color: ${c("color")};
			border: 1px solid ${c("white", 37)};

			&::after {
				opacity: 1;
			}
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
		--stroke-color-focus-stroke-outer: lch(from ${c("color")} 50 c h); // Change selected focused outline color.
		outline-color: ${c("stroke-color-focus-stroke-outer")};
	}

	&:focus {
		z-index: 1; // Place the focused ring above the selected ring.
	}
`;

export function ColorButton({ color, icon, animatedIcon, selected = false, value: [value, setValue] = NEVER_MIND, showIconWhenHovering = false, colorAlt, showSpectrum = false, style, role = "radio", onClick, children, ...htmlAttrs }: FCP<{
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
}, "button">) {
	const [isIconAnimating, setIsIconAnimating] = useState(false);
	// The edit icon will keep showing until the animation finishes playing.

	if (value !== undefined) selected ||= value === color;

	return (
		<StyledColorButton {...htmlAttrs} style={{ ...style, "--color": colorAlt ?? color }} aria-checked={selected} role={role} onClick={e => { onClick?.(e); color && setValue?.(color); }}>
			<div className={["fill", { spectrum: showSpectrum }]} />
			{animatedIcon ? <AnimatedIcon name={animatedIcon} className={{ animating: !showIconWhenHovering || isIconAnimating }} onPlayStateChange={setIsIconAnimating} /> :
			icon && <Icon name={icon} className={{ animating: !showIconWhenHovering }} />}
			{children}
		</StyledColorButton>
	);
}

export default function ColorPicker({ color: [color, setColor], role = "button", showIconWhenHovering = true, showSpectrumWhenUnselected = false, selected, ...htmlAttrs }: FCP<Override<PropsOf<typeof ColorButton>, {
	/** Color. */
	color: StateProperty<string>;
	/** Show color spectrum when it is not selected? */
	showSpectrumWhenUnselected?: boolean;
	children?: never;
}>>) {
	const inputColorEl = useDomRef<"input">();

	const handleClick: MouseEventHandler = async e => {
		e.stopPropagation();
		if (window.isWebView) setColor?.(await bridges.bridge.showColorPicker(color || "#000000"));
		else inputColorEl.current?.click();
	};

	return (
		<ColorButton
			{...htmlAttrs}
			color={color}
			animatedIcon="edit"
			role={role}
			selected={selected}
			showIconWhenHovering={showIconWhenHovering}
			showSpectrum={!selected && showSpectrumWhenUnselected}
			onClick={handleClick}
		>
			{!window.isWebView && <input ref={inputColorEl} type="color" value={color} onChange={e => setColor?.(e.currentTarget.value)} />}
		</ColorButton>
	);
}
