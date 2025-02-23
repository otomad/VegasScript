const StyledFlyout = styled.div`
	position: fixed;
	justify-self: anchor-center;
	overflow: clip;
	background-color: ${c("background-fill-color-acrylic-background-default")};
	border-radius: 8px;
	outline: 1px solid ${c("stroke-color-surface-stroke-flyout")};
	box-shadow: 0 4px 8px ${c("shadows-flyout")};
	backdrop-filter: blur(60px);
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
`;

export default function Flyout({ anchorName, position, shown: [shown, setShown] = [], children, style, className, ...htmlAttrs }: FCP<{
	/** Anchor name. */
	anchorName: string;
	/** Position. */
	position: "top" | "bottom";
	/** Shown. */
	shown?: StateProperty<boolean>;
}, "div">) {
	const flyoutEl = useDomRef<"div">();
	const close = () => setShown?.(false);
	useEventListener(window, "keydown", e => e.code === "Escape" && close());
	useEventListener(window, "pointerdown", e => !isInPath(e, flyoutEl) && close(), { capture: true });

	return (
		<Portal>
			<CssTransition in={shown} unmountOnExit>
				<StyledFlyout
					ref={flyoutEl}
					className={[className, position]}
					style={{
						...style,
						positionAnchor: anchorName,
						"--offset": "11px",
					}}
					{...htmlAttrs}
				>
					{children}
				</StyledFlyout>
			</CssTransition>
		</Portal>
	);
}
