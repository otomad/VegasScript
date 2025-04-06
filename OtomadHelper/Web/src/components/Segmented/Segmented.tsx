import SegmentedItem from "./SegmentedItem";

const THUMB_BORDER_WIDTH = 1;
const ITEM_BASE_MARGIN_X_WIDTH = 3;
const ITEM_BASE_PADDING_X_WIDTH = 11.5;
const ITEM_BASE_ADJUSTED_PADDING_X_WIDTH = ITEM_BASE_PADDING_X_WIDTH + ITEM_BASE_MARGIN_X_WIDTH;
const THUMB_TRANSITION_OPTION = `${eases.easeOutSmooth} 350ms`;
const SEGMENTED_ITEM_PRESSED_SCALE = 0.95;

const StyledSegmented = styled.div<{
	/** The child item count. */
	$itemCount?: number;
	/** The selected item index. */
	$selectedIndex?: number;
}>`
	position: relative;
	background-color: ${c("fill-color-control-alt-secondary")};
	border: 1px solid ${c("stroke-color-control-stroke-default")};
	border-radius: 4px;

	@layer props {
		width: fit-content;
	}

	.items,
	.thumb-content {
		display: grid;
		grid-auto-columns: 1fr;
		grid-auto-flow: column;
		width: inherit;

		.item {
			padding: ${ITEM_BASE_MARGIN_X_WIDTH}px;

			> .base {
				${styles.mixins.flexCenter()};
				gap: 10px;
				height: 100%;
				padding: 4px ${ITEM_BASE_PADDING_X_WIDTH}px;
				color: ${c("foreground-color")};
				border-radius: 2px;

				${ifColorScheme.contrast} & {
					color: ${cc("ButtonText")};
				}
			}

			p {
				${styles.effects.text.body};
				flex-shrink: 0;
				text-align: center;
			}

			.icon {
				font-size: 16px;
			}
		}
	}

	.items .item {
		&:hover > .base {
			background-color: ${c("fill-color-subtle-secondary")};
		}

		&:active > .base {
			background-color: ${c("fill-color-subtle-tertiary")};
			scale: ${SEGMENTED_ITEM_PRESSED_SCALE};

			> * {
				opacity: ${c("pressed-text-opacity")};
			}
		}

		&.selected ~ .item:not(:last-child),
		&:not(:has(+ .selected)):has(~ .item.selected) {
			padding-inline-end: 0;

			> .base {
				padding-inline-end: ${ITEM_BASE_ADJUSTED_PADDING_X_WIDTH}px;
			}
		}

		&.selected ~ .item:not(.selected + .item),
		&:not(:first-child):has(~ .item.selected) {
			padding-inline-start: 0;

			> .base {
				padding-inline-start: ${ITEM_BASE_ADJUSTED_PADDING_X_WIDTH}px;
			}
		}
	}

	.thumb {
		position: absolute;
		inset-block-start: 0;
		display: flex;
		justify-content: center;
		align-items: flex-end;
		height: calc(100% + ${2 * THUMB_BORDER_WIDTH}px);
		margin: ${-THUMB_BORDER_WIDTH}px;
		background-color: ${c("fill-color-control-default")};
		border: 1px solid ${c("stroke-color-control-stroke-default")};
		border-radius: inherit;
		transition: ${fallbackTransitions}, inset-inline-start ${THUMB_TRANSITION_OPTION};
		forced-color-adjust: none;

		${ifColorScheme.reduceTransparency} {
			background-color: transparent;
		}

		${({ $itemCount = 0, $selectedIndex = -1 }) => !$itemCount ? css`
			inset-inline-start: 0;
			width: 0;
		` : css`
			inset-inline-start: calc((100% + ${2 * THUMB_BORDER_WIDTH}px) / ${$itemCount} * ${$selectedIndex});
			width: calc((100% + ${2 * THUMB_BORDER_WIDTH}px) / ${$itemCount});
			${!~$selectedIndex && css`opacity: 0;`}
		`}

		${ifColorScheme.dark} &:not(:active, [disabled]) {
			border-top-color: ${c("stroke-color-control-stroke-secondary")};
		}

		${ifColorScheme.light} &:not(:active, [disabled]) {
			border-bottom-color: ${c("stroke-color-control-stroke-secondary")};
		}

		${ifColorScheme.contrast} & {
			background-color: transparent;
		}

		&::after {
			${styles.mixins.oval()};
			content: "";
			display: block;
			width: 16px;
			height: 3px;
			background-color: ${c("accent-color")};
		}

		&:active {
			&::after {
				width: 10px;
			}

			& + .thumb-content {
				opacity: 0.5;
			}
		}
	}

	&[disabled] {
		.thumb::after {
			background-color: ${c("fill-color-accent-disabled")};
		}

		:is(.items, .thumb-content) .item > .base {
			color: ${c("fill-color-text-disabled")};
		}
	}

	.thumb-content {
		position: absolute;
		top: 0;
		pointer-events: none;
		clip-path: inset(${({ $itemCount = 0, $selectedIndex = -1 }) => !$itemCount || !~$selectedIndex ? "0 100% 0 0" : !isRtl() ?
			`0 calc((1 - (${$selectedIndex} + 1) / ${$itemCount}) * 100%) 0 calc(${$selectedIndex} / ${$itemCount} * 100%)` :
			`0 calc(${$selectedIndex} / ${$itemCount} * 100%) 0 calc((1 - (${$selectedIndex} + 1) / ${$itemCount}) * 100%)`} round 4px);
		transition: ${fallbackTransitions}, clip-path ${THUMB_TRANSITION_OPTION};

		${ifColorScheme.dark} & {
			display: none;
		}

		${ifColorScheme.contrast} & {
			display: none;
		}
	}
`;

export default function Segmented<T extends string = string>({ current: [current, setCurrent], children }: FCP<{
	/** The identifier of the selected segmented item. */
	current: StateProperty<T>;
}>) {
	const items = React.Children.toArray(children).filter(child => isReactInstance(child, SegmentedItem)) as
		GetReactElementFromFC<typeof SegmentedItem>[];
	const itemCount = items.length;
	const selectedIndex = items.findIndex(item => item.props.id === current);
	const setCurrentByIndex = (index: number) => items[index] && setCurrent?.(items[index].props.id as T);

	const handleDrag = useCallback<PointerEventHandler<HTMLDivElement>>(e => {
		const thumb = e.currentTarget;
		if (!thumb) return;
		const track = thumb.parentElement as HTMLDivElement;
		const pointerMove = (e: PointerEvent) => {
			const { left: trackLeft, width: trackWidth } = track.getBoundingClientRect();
			let index = Math.floor((e.clientX - trackLeft) / trackWidth * itemCount);
			if (isRtl()) index = itemCount - 1 - index;
			index = clamp(index, 0, itemCount - 1);
			setCurrentByIndex(index);
		};
		const pointerUp = () => {
			document.removeEventListener("pointermove", pointerMove);
			document.removeEventListener("pointerup", pointerUp);
		};
		document.addEventListener("pointermove", pointerMove);
		document.addEventListener("pointerup", pointerUp);
	}, [children]);

	const handleArrowKeyDown = useDebounceCallback<KeyboardEventHandler<HTMLDivElement>>(({ code }) => {
		code = swapArrowLeftRightIfRtl(code);
		const direction = ["ArrowRight", "ArrowDown"].includes(code) ? 1 :
			["ArrowLeft", "ArrowUp"].includes(code) ? -1 : 0;
		if (!direction) return;
		const newIndex = floorMod(selectedIndex + direction, itemCount);
		setCurrentByIndex(newIndex);
	}, [children, current]);

	return (
		<StyledSegmented
			role="radiogroup"
			$itemCount={itemCount}
			$selectedIndex={selectedIndex}
			onKeyDown={e => e.code.startsWith("Arrow") && e.preventDefault()}
		>
			<div className="items">
				{items.map(child => {
					const id = child.props.id as T ?? child.props.children;
					return React.cloneElement(child, {
						selected: id === current,
						onClick: () => setCurrent?.(id),
					});
				})}
			</div>
			<div className="thumb" onPointerDown={handleDrag} tabIndex={0} onKeyDown={e => e.code === "Space" ? e.preventDefault() : handleArrowKeyDown(e)} />
			<div className="thumb-content" aria-hidden>
				{items.map(child => React.cloneElement(child))}
			</div>
		</StyledSegmented>
	);
}

const SegmentedSelectionModeContainer = styled.div`
	display: flex;
	justify-content: flex-end;
`;

Segmented.Item = SegmentedItem;
Segmented.SelectionModeContainer = SegmentedSelectionModeContainer;
