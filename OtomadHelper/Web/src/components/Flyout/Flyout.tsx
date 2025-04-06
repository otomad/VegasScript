import FlyoutItem from "./FlyoutItem";

const PADDING = "4px";
const StyledFlyout = styled.div`
	position: fixed;
	max-width: 100dvw;
	overflow: clip;
	background-color: ${c("background-fill-color-acrylic-background-default")};
	border-radius: 8px;
	outline: 1px solid ${c("stroke-color-surface-stroke-flyout")};
	box-shadow: 0 4px 8px ${c("shadows-flyout")};
	backdrop-filter: blur(10px);
	transition: ${fallbackTransitions}, inset 0s;
	position-try-fallbacks: flip-block, flip-inline;

	${tgs()} {
		margin-block: 0 !important;
		opacity: 0;
	}

	&.in-command-bar {
		right: calc(anchor(center) - var(--width) / 2);
		width: var(--width);

		&.enter,
		&.exit {
			pointer-events: none; // Otherwise, when mouse is located between the button and the flyout, it will repeatedly fidget.
		}

		&.top {
			bottom: anchor(top);
			margin-bottom: var(--offset);
		}

		&.bottom {
			top: anchor(bottom);
			margin-top: var(--offset);
		}

		&.command-bar-right {
			right: max(calc(anchor(center) - var(--width) / 2), anchor(var(--constrain) right));
		}

		&.command-bar-left {
			right: auto;
			left: max(calc(anchor(center) - var(--width) / 2), anchor(var(--constrain) left));
		}

		&.command-bar-center {
			right: unset;
			justify-self: anchor-center;

			&.top {
				position-area: top;
			}

			&.bottom {
				position-area: bottom;
			}
		}
	}

	&:not(.in-command-bar) {
		justify-self: anchor-center;

		&.top {
			margin-bottom: var(--offset);
			position-area: top;
		}

		&.bottom {
			margin-top: var(--offset);
			position-area: bottom;
		}
	}

	.descriptions {
		padding-block: 8px;
		padding-inline: 12px;

		h6 {
			${styles.effects.text.bodyStrong}
		}

		p {
			${styles.effects.text.body}
		}

		&:has(h6:empty):has(p:empty),
		&:not(:has(h6)):has(p:empty) {
			&,
			& + hr {
				display: none;
			}
		}

		#root:has(main.page:is(.enter, .exit)) + #popovers & {
			&,
			& + hr {
				display: none;
			}
		}
	}

	hr {
		margin-block: 1px;
		margin-block-end: 4px;
		border: none;
		border-top: 1px solid ${c("stroke-color-divider-stroke-default")};
	}

	&.padding-x {
		padding-inline: ${PADDING};
	}

	&.padding-y {
		padding-block: ${PADDING};
	}

	&.padding-xy {
		padding: ${PADDING};
	}
`;

function isValidAnchorName(anchorName: string) {
	return !!anchorName.match(/^--[\w-]+$/);
}

const DEFAULT_OFFSET = 11;
export default function Flyout({ anchorName, position, shown: [shown, setShown] = NEVER_MIND, offset = DEFAULT_OFFSET, autoInert = false, autoPadding = "y", portal, hideDelay = 0, target, onShown, onHidden, _commandBarAnchorName, _horizontalPosition, children, style, className, ...htmlAttrs }: FCP<{
	/** Anchor name. */
	anchorName: string;
	/** Position. */
	position: "top" | "bottom";
	/** Offset. */
	offset?: Numberish;
	/** Shown. */
	shown?: StateProperty<boolean>;
	/** Auto set root inert when flyout shown? */
	autoInert?: boolean;
	/** Auto add padding with default size to which direction? Defaults to `y`. */
	autoPadding?: "x" | "y" | "xy" | "";
	/** Customize where to teleport the flyout. */
	portal?: PropsOf<typeof Portal>["container"];
	/** When request to hide the flyout, it will be delayed for milliseconds before hiding. If it is reshowed during this period, it will not hide. */
	hideDelay?: number;
	/** (Optional) Target of the flyout. */
	target?: MaybeRef<HTMLElement | null>;
	/** Occurs when shown. */
	onShown?(): void;
	/** Occurs when hidden. */
	onHidden?(): void;
	// Specialized Interfaces
	/** @private This property is designed specifically for `CommandBarItem`, operating directly may result in undefined behavior! */
	_commandBarAnchorName?: string;
	/** @private This property is designed specifically for `CommandBarItem`, operating directly may result in undefined behavior! */
	_horizontalPosition?: Position;
}, "div">) {
	if (!isValidAnchorName(anchorName)) throw new TypeError(`Invalid anchor name: ${anchorName}`);
	if (_commandBarAnchorName && !isValidAnchorName(_commandBarAnchorName)) throw new TypeError(`Invalid command bar anchor name: ${_commandBarAnchorName}`);

	const flyoutEl = useDomRef<"div">();
	const close = () => setShown?.(false);
	useEventListener(window, "keydown", e => e.code === "Escape" && close());
	useEventListener(window, "pointerdown", e => autoInert && !isInPath(e, flyoutEl) && close(), { capture: true }, [autoInert]);

	useEffect(() => {
		if (autoInert && shown)
			setRootInert(true);
		else if (document.querySelectorAll("#popovers .flyout").length <= 1)
			setRootInert(false);
	}, [shown, autoInert]);

	const [delayedShown, setDelayedShown] = useState(shown);
	const hideTimeout = useRef<Timeout>(undefined);
	useEffect(() => {
		clearTimeout(hideTimeout.current);
		if (hideDelay <= 0) return;
		if (shown) setDelayedShown(true);
		else hideTimeout.current = setTimeout(() => setDelayedShown(false), hideDelay);
	}, [hideDelay, shown]);

	const inProp = hideDelay > 0 ? delayedShown : shown;
	useEffect(() => {
		if (inProp) {
			onShown?.();
			if (flyoutEl.current)
				(getFirstFocusableElement(flyoutEl.current) as HTMLElement)?.focus?.();
		} else {
			onHidden?.();
			target = toValue(target);
			if (target && (document.activeElement === document.body || flyoutEl.current?.contains(document.activeElement)))
				target.focus();
		}
	}, [inProp]);

	return (
		<Portal container={portal}>
			<CssTransition in={inProp} unmountOnExit maxTimeout={250}>
				<StyledFlyout
					ref={flyoutEl}
					className={[
						className,
						position,
						_horizontalPosition && "command-bar-" + _horizontalPosition,
						{ inCommandBar: _commandBarAnchorName },
						autoPadding && "padding-" + autoPadding,
					]}
					style={{
						...style,
						positionAnchor: anchorName,
						"--offset": styles.toValue(offset),
						"--width": "300px",
						"--constrain": _commandBarAnchorName,
					}}
					{...htmlAttrs}
				>
					{children}
				</StyledFlyout>
			</CssTransition>
		</Portal>
	);
}

Flyout.Item = FlyoutItem;
