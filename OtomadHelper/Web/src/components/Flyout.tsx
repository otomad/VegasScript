const StyledFlyout = styled.div`
	position: fixed;
	right: calc(anchor(center) - var(--width) / 2);
	width: var(--width);
	max-width: 100dvw;
	padding-block: 4px;
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
`;

export default function Flyout({ anchorName, position, shown: [shown, setShown] = [], _commandBarAnchorName, _horizontalPosition, children, style, className, ...htmlAttrs }: FCP<{
	/** Anchor name. */
	anchorName: string;
	/** Position. */
	position: "top" | "bottom";
	/** Shown. */
	shown?: StateProperty<boolean>;
	_commandBarAnchorName?: string;
	_horizontalPosition?: Position;
}, "div">) {
	const flyoutEl = useDomRef<"div">();
	const close = () => setShown?.(false);
	useEventListener(window, "keydown", e => e.code === "Escape" && close());
	useEventListener(window, "pointerdown", e => !isInPath(e, flyoutEl) && close(), { capture: true });

	useEffect(() => {
		if (shown)
			setRootInert(true);
		else if (document.querySelectorAll("#popovers .flyout").length <= 1)
			setRootInert(false);
	}, [shown]);

	return (
		<Portal>
			<CssTransition in={shown} unmountOnExit>
				<StyledFlyout
					ref={flyoutEl}
					className={[className, position, _horizontalPosition && "command-bar-" + _horizontalPosition]}
					style={{
						...style,
						positionAnchor: anchorName,
						"--width": "300px",
						"--offset": "11px",
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
