import FlyoutItem from "./FlyoutItem";

const PORTAL_CONTAINER = "main";

const PADDING = "4px";
const StyledFlyout = styled.div`
	${styles.effects.flyout};
	position: absolute;
	max-width: 100dvw;
	max-height: 100%;
	overflow-block: auto;
	transition: ${fallbackTransitions}, inset 0s;
	position-try-fallbacks: flip-block, flip-inline;

	${tgs()} {
		margin-block: 0 !important;
		opacity: 0;
	}

	&.in-command-bar {
		/* justify-self: anchor-center; */
		width: var(--width);

		&.enter,
		&.exit {
			pointer-events: none;
			// Otherwise, when mouse is located between the button and the flyout, it will repeatedly fidget.
			// Inert pointer events, but do not inert keyboard events!
		}

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
		border-block-start: 1px solid ${c("stroke-color-divider-stroke-default")};
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
export default function Flyout({ anchorName, position, shown: [shown, setShown] = NEVER_MIND, offset = DEFAULT_OFFSET, autoInert = false, autoPadding = "y", hideDelay = 0, target, onShown, onHidden, _commandBarAnchorName, _horizontalPosition, children, style, className, ...htmlAttrs }: FCP<{
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
	// portal?: PropsOf<typeof Portal>["container"];
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

	// useRootInert(autoInert && shown, ".flyout"); // TODO: inert is disabled currently. Keep track `interactivity: auto / inert;`.

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
				setTimeout(() => findFirstFocusableElement(flyoutEl.current)?.focus(), 0);
		} else {
			onHidden?.();
			target = toValue(target);
			if (target && (document.activeElement === document.body || flyoutEl.current?.contains(document.activeElement)))
				target.focus();
		}
	}, [inProp]);

	return (
		<Portal container={PORTAL_CONTAINER}>
			<CssTransition in={inProp} unmountOnExit maxTimeout={250} appear>
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
