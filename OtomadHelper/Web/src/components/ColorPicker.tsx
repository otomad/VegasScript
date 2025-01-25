import { StyledButton } from "./Button";

const PADDING = 3;

const StyledColorPicker = styled(StyledButton)`
	position: relative;
	aspect-ratio: 1 / 1;
	margin: ${-PADDING}px !important;
	padding: ${PADDING}px;
	min-inline-size: 40px;
	border-radius: 6px;

	input {
		visibility: hidden;
	}

	.fill {
		${styles.mixins.square(`calc(100% - ${PADDING}px * 2)`)};
		position: absolute;
		background-color: ${c("color")};
		/* border: 1px solid ${c("foreground-color", 37)}; */
		border: 1px solid ${getContrastiveColor("color", 0.37)};
		border-radius: 4px;
	}

	.icon {
		position: absolute;
		color: ${getContrastiveColor("color")};
		font-size: 16px;
		opacity: 0;
	}

	&:hover {
		.icon {
			opacity: 1;
		}

		.fill {
			opacity: 0.9;
		}
	}

	&:active {
		.icon {
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
`; // TODO: pencel (edit) lottie icon

export default function ColorPicker({ color: [color, setColor], ...htmlAttrs }: FCP<{
	/** Color. */
	color: StateProperty<string>;
	children?: never;
}, "button">) {
	const inputColorEl = useDomRef<"input">();

	const handleClick: MouseEventHandler = async e => {
		e.stopPropagation();
		if (window.isWebView) setColor?.(await bridges.bridge.showColorPicker(color || "#000000"));
		else inputColorEl.current?.click();
	};

	return (
		<StyledColorPicker {...htmlAttrs} style={{ "--color": color }} onClick={handleClick}>
			<div className="fill" />
			<Icon name="edit" />
			{!window.isWebView && <input ref={inputColorEl} type="color" value={color} onChange={e => setColor?.(e.currentTarget.value)} />}
		</StyledColorPicker>
	);
}
