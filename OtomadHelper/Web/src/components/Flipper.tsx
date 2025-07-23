const StyledFlipper = styled(RepeatButton)`
	${styles.mixins.gridCenter()};
	position: relative;
	block-size: 100%;
	color: ${c("foreground-color")};
	background-color: ${c("fill-color-subtle-transparent")};
	border-radius: 4px;

	@layer props {
		--state: normal;
	}

	.icon {
		font-size: 32px;
	}

	&::after {
		content: "";
		position: absolute;
		inset: -4px;
		display: block;
	}

	&:hover {
		background-color: ${c("fill-color-subtle-secondary")};
	}

	&:active {
		color: ${c("fill-color-text-secondary")};
		background-color: ${c("fill-color-subtle-tertiary")};
	}

	&[disabled] {
		color: ${c("fill-color-text-disabled")};
	}

	@container style(--state: disabled) {
		color: ${c("fill-color-text-disabled")};
		pointer-events: none;
		interactivity: inert;
	}
`;

const StyledFlipperWrapper = styled.div`
	position: sticky;
	z-index: 2;
	align-self: stretch;
	block-size: 100%;
	inline-size: var(--flipper-width);
	padding: 4px;

	&.left {
		padding-inline-end: 0;
	}

	&.right {
		padding-inline-start: 0;
	}

	:has(> &) {
		--flipper-width: 36px;
	}

	.filter:has(> &) {
		--flipper-width: 32px;
	}

	.filter > & {
		padding-inline: 0;

		> ${StyledFlipper}::after {
			inset-inline: 0;
		}
	}

	@container not scroll-state(scrollable: left) { // left end
		&.left {
			--state: disabled;
		}
	}

	@container not scroll-state(scrollable: right) { // right end
		&.right {
			--state: disabled;
		}
	}

	@container not scroll-state(scrollable: top) { // top end
		&.top {
			--state: disabled;
		}
	}

	@container not scroll-state(scrollable: bottom) { // bottom end
		&.bottom {
			--state: disabled;
		}
	}

	@container scroll-state(scrollable: none) { // container can accommodate it, scrollbar is hidden
		display: none;
	}

	@container not scroll-state(scrollable: none) { // scrollable
		&:is(.left, .top) + * {
			animation: ${keyframes`
				from {
					clip-path: inset(0 calc(100% - 100cqw + var(--flipper-width) * 2) 0 0);
				}

				to {
					clip-path: inset(0 0 0 calc(100% - 100cqw + var(--flipper-width) * 2));
				}
			`} 1s linear;
			animation-timeline: scroll(inline nearest);
		}
	}
`;

export default function Flipper({ arrow, delta = 40, children: _children, ...htmlAttrs }: FCP<{
	/** Scroll position. */
	arrow: "left" | "right";
	/** Scroll increments. */
	delta?: number;
	children?: never;
}, "button">) {
	const wrapperEl = useDomRef<"div">();
	const direction = useMemo(() => arrow.in("left", "right") ? "x" : "y", [arrow]);

	const handleClick: MouseEventHandler<HTMLButtonElement> = _e => {
		// const repeat = "repeat" in e && !!e.repeat;
		const container = getScrollParent(wrapperEl.current, direction);
		if (!container) return;
		// const _delta = delta * (repeat ? 2 : 1);
		HorizontalScroll.applyScroll.get(container)?.(delta * (arrow === "left" ? -1 : arrow === "right" ? 1 : 0));
	};

	return (
		<StyledFlipperWrapper ref={wrapperEl} style={{ [arrow]: "0" }} className={arrow}>
			<StyledFlipper onClick={handleClick} {...htmlAttrs}>
				<Icon name={`flipper/caret_${arrow}`} />
			</StyledFlipper>
		</StyledFlipperWrapper>
	);
}
