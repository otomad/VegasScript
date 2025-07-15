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
	inline-size: 40px;
	padding: 4px;

	&.left {
		padding-inline-end: 0;
	}

	&.right {
		padding-inline-start: 0;
	}

	@container not scroll-state(scrollable: left) {
		&.left {
			--state: disabled;
		}
	}

	@container not scroll-state(scrollable: right) {
		&.right {
			--state: disabled;
		}
	}

	@container not scroll-state(scrollable: top) {
		&.top {
			--state: disabled;
		}
	}

	@container not scroll-state(scrollable: bottom) {
		&.bottom {
			--state: disabled;
		}
	}

	@container scroll-state(scrollable: none) {
		display: none;
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

	const getScrollParent = (container: Element | undefined | null) => {
		while (container instanceof Element) {
			const overflow = getComputedStyle(container)[direction === "x" ? "overflowX" : "overflowY"];
			if (overflow.in("scroll", "auto", "overlay"))
				return container;
			container = container.parentElement;
		}
	};

	const handleClick: MouseEventHandler<HTMLButtonElement> = e => {
		const repeat = "repeat" in e && !!e.repeat;
		const container = getScrollParent(wrapperEl.current);
		if (!container) return;
		const _delta = delta * (repeat ? 2 : 1);
		HorizontalScroll.applyScroll.get(container)?.(_delta * (arrow === "left" ? -1 : arrow === "right" ? 1 : 0));
		// container.scrollBy({
		// 	left: _delta * (arrow === "left" ? -1 : arrow === "right" ? 1 : 0),
		// 	top: _delta * (arrow === "top" ? -1 : arrow === "bottom" ? 1 : 0),
		// 	// behavior: repeat ? "instant" : "smooth",
		// });
	};

	return (
		<StyledFlipperWrapper ref={wrapperEl} style={{ [arrow]: "0" }} className={arrow}>
			<StyledFlipper onClick={handleClick} {...htmlAttrs}>
				<Icon name={`flipper/caret_${arrow}`} />
			</StyledFlipper>
		</StyledFlipperWrapper>
	);
}
