import TabItem from "./TabItem";

const THICKNESS = 3;
const LENGTH = 20;
const DELAY = 200;

type TabBarMovement = "previous" | "next" | "appear" | "disappear" | "none";

const Indicator = styled.div.attrs(({ $vertical }) => ({
	className: $vertical ? "vertical" : "horizontal",
}))<{
	/** Position (a tuple of distances from the container in the upper and lower directions). */
	$position?: TwoD;
	/** Starting position. */
	$appearingPosition?: TwoD;
	/** Vertical tabs? */
	$vertical?: boolean;
	/** The tab bar movement. */
	$movement?: TabBarMovement;
}>`
	${styles.mixins.oval()}
	${({ $vertical }) => $vertical ? "inline" : "block"}-size: ${THICKNESS}px;
	position: absolute;
	background-color: ${c("accent-color")};
	${({ $vertical }) => $vertical ? css`inset-inline-start: 5px;` : css`inset-block-end: 0;`}
	transition: ${fallbackTransitions}${({ $movement, $vertical }) => !$movement?.in("next", "previous") ? "" :
		`, ${$movement === "next" ? $vertical ? "inset-block-start" : "left" : $vertical ? "inset-block-end" : "right"} ${eases.easeOutMax} 250ms ${DELAY}ms`};
	${({ $position, $vertical }) => $position && css`
		${$vertical ? "inset-block-start" : "left"}: ${$position[0] ?? 0}px;
		${$vertical ? "inset-block-end" : "right"}: ${isUndefinedNullNaN($position[1]) ? "100%" : $position[1] + "px"};
	`};
	${({ $appearingPosition, $vertical }) => $appearingPosition && css`
		transition: none !important;
		${$vertical ? "inset-block-start" : "left"}: ${$appearingPosition[0]}px;
		${$vertical ? "inset-block-end" : "right"}: ${$appearingPosition[1]}px;
	`};
`;
/* transition-behavior: allow-discrete;
${({ $movement, $vertical }) => [
	$movement === "disappear" && css`
		display: none;
		scale: ${$vertical ? "1 0" : "0 1"};
	`,
	css`
		@starting-style {
			scale: ${$vertical ? "1 0" : "0 1"};
		}
	`,
]}; */

const StyledTabBar = styled.div`
	${styles.mixins.square("100%")};
	scroll-padding: 0;

	> .scroll {
		position: relative;
		overscroll-behavior: contain;
	}

	&:has(.selected:active):not(.disable-press-indicator-style) ${Indicator} {
		scale: 1 0.5;

		&.horizontal {
			scale: 0.5 1;
		}
	}

	hr {
		margin: 4px 0;
		border: none;
		border-bottom: 1px solid ${c("stroke-color-divider-stroke-default")};
	}

	.items {
		> * {
			flex-shrink: 0;
		}
	}

	&.horizontal {
		${styles.mixins.noScrollbar()};
		width: 100%;
		margin: -4px;
		padding: 4px;
		overflow-x: auto;

		> .scroll {
			width: min-content;
		}

		.items {
			display: flex;
		}
	}
`;

export default function TabBar<T extends string = string>({ current: [current, setCurrent], collapsed, children, vertical }: FCP<{
	/** The identifier of the currently selected item. */
	current: StateProperty<T>;
	/** Hide the text label and only show the icon? */
	collapsed?: boolean;
	/** Use the vertical NavigationView style? */
	vertical?: boolean;
}>) {
	const indicatorEl = useDomRef<"div">();
	const [position, _setPosition] = useState<TwoD>([NaN, NaN]);
	const { uiScale1 } = useSnapshot(configStore.settings);
	const [_movement, setMovement] = useState<TabBarMovement>("disappear");
	const [disablePressIndicatorStyle, setDisablePressIndicatorStyle] = useDelayState(false);
	const [appearingPosition, setAppearingPosition] = useDelayState<TwoD>();

	/**
	 * Update the tab indicator.
	 */
	const update = useCallback(() => {
		const indicator = indicatorEl.current;
		if (!indicator) return;
		let movement: TabBarMovement = "none";
		/* if (!indicator.offsetParent) { // If the indicator (and its ancestors) are hidden
			_setPosition([NaN, NaN]);
			const hiddenElement = getPath(indicator).find(element => getComputedStyle(element).display === "none");
			if (!hiddenElement) return;
			const MAX_WAITING_TIME = 10_000, observeTime = Date.now();
			const observer = new MutationObserver(() => {
				if (indicator.offsetParent) {
					observer.disconnect();
					update();
				}
				if (Date.now() - observeTime > MAX_WAITING_TIME)
					observer.disconnect();
			});
			observer.observe(hiddenElement, { attributeFilter: ["class"] });
			return;
		} */
		setDisablePressIndicatorStyle(true, { keep: DELAY, allowInterrupt: true }).then(() => setDisablePressIndicatorStyle(false));
		const entireRect = indicator.parentElement!.getBoundingClientRect();
		const entire1 = entireRect[vertical ? "top" : "left"],
			entire2 = entireRect[vertical ? "bottom" : "right"],
			entireLength = (entire2 - entire1) / uiScale1;
		const setPosition = setStateInterceptor(_setPosition, ([pos1, pos2]: TwoD) => [pos1, entireLength - pos2] as TwoD);
		const [entry1, entry2] = position;
		if (entry1 + entry2 >= entireLength || !Number.isFinite(entry1) || !Number.isFinite(entry2))
			movement = "appear";
		const selectedTabItem = indicator.previousElementSibling!.querySelector(".selected");
		if (!selectedTabItem) {
			if (movement === "appear") return;
			movement = "disappear";
			const center = (entry1 + entireLength - entry2) / 2;
			setPosition([center, center - 1]);
			setMovement(movement);
			return;
		}
		const targetRect = selectedTabItem.getBoundingClientRect();
		let target1 = (targetRect[vertical ? "top" : "left"] - entire1) / uiScale1,
			target2 = (targetRect[vertical ? "bottom" : "right"] - entire1) / uiScale1;
		const targetOffset = (target2 - target1 - LENGTH) / 2;
		if (targetOffset > 0) { target1 += targetOffset; target2 -= targetOffset; }
		const setPositionBoth = () => setPosition([target1, target2]);
		if (movement === "appear") {
			const center = (target1 + target2) / 2;
			setAppearingPosition([center, entireLength - center], { keep: 1, allowInterrupt: true }).then(() => setAppearingPosition(undefined));
			setPositionBoth();
			setMovement(movement);
			return;
		}
		const movementSign = entry1 + entireLength - entry2 - (target1 + target2);
		movement = movementSign > 0 ? "previous" : movementSign < 0 ? "next" : "none";
		setPositionBoth();
		setMovement(movement);
	}, [position, uiScale1, _movement]);

	useEffect(() => {
		update();
	}, [current, children]);

	return (
		<HorizontalScroll enabled={!vertical}>
			{/* Vertical tab bar (navigation view) do not care about horizontal scrolling. */}
			<StyledTabBar className={[vertical ? "vertical" : "horizontal", { disablePressIndicatorStyle }]}>
				<div className="scroll">
					<div className="items">
						{React.Children.map(children, child => {
							if (!isReactInstance(child, TabItem)) return child;
							const id = child.props.id as T;
							return React.cloneElement(child, {
								collapsed,
								_vertical: vertical,
								selected: current === id,
								onClick: () => setCurrent?.(id),
							});
						})}
					</div>
					<Indicator
						ref={indicatorEl}
						$position={position}
						$appearingPosition={appearingPosition}
						$vertical={vertical}
						$movement={_movement}
					/>
				</div>
			</StyledTabBar>
		</HorizontalScroll>
	);
}

TabBar.Item = TabItem;
