import { styledExpanderItemText } from "components/Expander/ExpanderItem";

export const GRID_VIEW_ITEM_HEIGHT = 112;

const isPressed = ":active:not(:has(button:active))";

const StyledItemsViewItem = styled.button<{
	/** View mode: list, tile, grid. */
	$view: ItemView;
	/** Add additional borders to the normal state of the image wrapper? */
	$withBorder?: boolean;
}>`
	${styles.mixins.forwardFocusRing()};

	&:hover {
		${useLottieStatus.animation("Hover")};
	}

	${({ $view, $withBorder }) => $view === "grid" ? css`
		display: flex;
		flex-direction: column;
		block-size: 100%;

		:where(.image-wrapper) {
			block-size: ${GRID_VIEW_ITEM_HEIGHT}px;
			inline-size: 100%;
		}

		.image-wrapper {
			position: relative;
			contain: paint;
			border-radius: inherit;
			isolation: isolate;

			.checkbox-label {
				position: absolute;
				inset-block-start: 6px;
				inset-inline-end: 6px;
			}
		}

		> .base {
			container: grid-view-item-image / inline-size;
			position: relative;
			overflow: clip;
			border-radius: 4px;
		}

		.text-part {
			display: flex;
			gap: 10px;
			align-items: center;
			margin: 5px 0;
			text-align: start;
		}

		.selection {
			position: absolute;
			inset: 0;
			border-radius: inherit;
			pointer-events: none;
			forced-color-adjust: none;

			${$withBorder && css`
				box-shadow: 0 0 0 1px ${c("stroke-color-surface-stroke-default")} inset;
			`}
		}

		&:not(.selected) .selection {
			transition: ${fallbackTransitions}, box-shadow ${eases.easeOutQuad} 250ms;
		}

		&:hover .selection {
			background-color: ${c("fill-color-subtle-secondary")};

			${!$withBorder && css`
				box-shadow: 0 0 0 1px ${c("stroke-color-control-stroke-on-accent-tertiary")} inset;
			`}
		}

		&:not(.selected):has(.image-wrapper .no-border) .selection {
			box-shadow: none;
		}

		&${isPressed} .selection {
			background-color: ${c("fill-color-subtle-tertiary")};
		}

		&:is(:hover, ${isPressed}) .selection {
			${ifColorScheme.contrast} & {
				background-color: transparent;
			}

			${ifColorScheme.reduceTransparency} {
				background-color: transparent;
			}
		}

		&.selected .selection {
			box-shadow:
				0 0 0 2px ${c("accent-color")} inset,
				0 0 0 3px ${c("fill-color-control-solid-default")} inset;
		}

		&.selected:hover .selection {
			box-shadow:
				0 0 0 2px ${c("accent-color", 90)} inset,
				0 0 0 3px ${c("fill-color-control-solid-default")} inset;
		}

		&.selected${isPressed} .selection {
			box-shadow:
				0 0 0 2px ${c("accent-color", 80)} inset,
				0 0 0 3px ${c("fill-color-control-solid-default")} inset;
		}
	` : css`
		padding: 2px 4px;

		> .base {
			position: relative;
			display: flex;
			flex-wrap: nowrap;
			gap: 16px;
			align-items: center;
			min-height: 48px;
			padding: 8px 12px;
			overflow: clip;
			border-radius: 3px;

			> * {
				transition: ${fallbackTransitions}, translate 0s;
			}

			&::before {
				${styles.mixins.oval()};
				content: "";
				position: absolute;
				inset-inline-start: 0;
				block-size: ${100 / 3}%;
				inline-size: 3px;
				background-color: ${c("accent-color")};

				@starting-style {
					scale: 1 0;
				}
			}
		}

		main.page > .container > .items-view > & {
			padding-inline: 0;

			> .base {
				padding-inline: 16px;
			}
		}

		&:hover > .base {
			background-color: ${c("fill-color-subtle-secondary")};
		}

		&${isPressed} > .base {
			background-color: ${c("fill-color-subtle-tertiary")};

			&::before {
				scale: 1 0.625;
			}

			> :not(.checkbox-label) {
				opacity: ${c("pressed-text-opacity")};
			}
		}

		&:not(.selected) > .base::before {
			scale: 1 0;
		}

		&:has(.checkbox-label) > .base::before {
			display: none;
		}

		${styledExpanderItemText};

		.image-wrapper {
			${styles.mixins.flexCenter()};

			&.top-align-icon {
				align-self: flex-start;
				margin-top: 5px;
			}
		}

		.flyout & {
			padding: 0 4px;

			> .base {
				gap: 12px;
				min-height: unset;
				padding-block: 8px;
				padding-inline: 13px 12px;
				border-radius: 4px;
			}
		}
	`}

	.text > * {
		${styles.effects.text.body};

		&:empty {
			display: none;
		}

		&.details {
			${styles.effects.text.caption};
			color: ${c("fill-color-text-secondary")};
		}
	}

	&.selected .text .title {
		${styles.effects.text.bodyStrong};
	}

	.checkbox-label {
		${tgs()} {
			opacity: 0;

			&,
			& + * {
				translate: ${-(18 + 16)}px;
			}
		}

		&:is(.enter-active, .exit-active) {
			&,
			& + * {
				transition: translate ${eases.easeOutMax} 250ms, opacity ${eases.easeOutMax} 250ms;
			}
		}
	}
`;

const DefaultImage = styled.img`
	${styles.mixins.square("100%")};
	object-fit: cover;
`;

const ItemsViewItemStateContext = createContext<{
	hover: boolean;
}>({
	hover: false,
});

export type OnItemsViewItemClickEventHandler = (id: PropertyKey, selected: CheckState, e: React.MouseEvent<HTMLElement>) => void;

export /* @internal */ default function ItemsViewItem({ image, icon, id, selected = "unchecked", details, actions, withBorder = false, topAlignIcon, baseAttrs, disableCheckmarkTransition, _view: view, _multiple: multiple, children, className, onSelectedChange, onClick, ...htmlAttrs }: FCP<{
	/** Image. */
	image?: string | ReactNode;
	/** Icon. */
	icon?: DeclaredIcons | Exclude<ReactNode, Iterable<ReactNode>>;
	/** Identifier. */
	id: PropertyKey;
	/** Selected? */
	selected?: CheckState | StateProperty<boolean>;
	/** Detailed description. */
	details?: ReactNode;
	/** The other action control area on the right side of the component. */
	actions?: ReactNode;
	/** Add additional borders to the normal state of the image wrapper? */
	withBorder?: boolean;
	/** `list`, `tile` - Top alignment the icon? */
	topAlignIcon?: boolean;
	/** Additional attributes for the base element of the items view item. */
	baseAttrs?: Partial<FCP<{}, "div">> & Record<string, Any>;
	/**
	 * Temporarily disable the transition of the checkbox's checkmark icon?
	 *
	 * It is as well to disable the checkmark transition when it appears abnormal or affects the user experience
	 * (for example, when executing the `startViewTransition` function in the View Transition API simultaneously).
	 *
	 * Effective only in multiple selection mode.
	 */
	disableCheckmarkTransition?: boolean;
	/** @private View mode: list, tile, grid. */
	_view?: ItemView;
	/** @private Multiple selection mode? */
	_multiple?: boolean;
	/** Occurs when the selection changed. */
	onSelectedChange?(id: PropertyKey, selected: CheckState): void;
	/** Occurs when user click it. */
	onClick?: OnItemsViewItemClickEventHandler;
}, "button">) {
	let setSelected: SetStateNarrow<boolean> | undefined;
	if (Array.isArray(selected)) {
		setSelected = selected[1] as never;
		selected = selected[0] ? "checked" : "unchecked";
	}

	const ariaId = useId();
	const textPart = (children || details) && (
		<div className="text" aria-hidden>
			{children && <p className="title" id={`${ariaId}-title`}>{children}</p>}
			{details && <p className="details" id={`${ariaId}-details`}><Preserves>{details}</Preserves></p>}
		</div>
	);
	const checkbox = (
		<CssTransition in={multiple} unmountOnExit>
			<Checkbox value={[selected]} plain inert disableCheckmarkTransition={disableCheckmarkTransition} />
		</CssTransition>
	);
	const iconOrElement = typeof icon === "string" ? <Icon name={icon} /> : icon;

	const [hover, setHover] = useState(false);
	const handleAnimation = useCallback((e: AnimationEvent, isAnimationStart: boolean) => {
		if (e.animationName !== getLottieStatusName("Hover")) return;
		setHover(isAnimationStart);
	}, []);

	useEffect(() => onSelectedChange?.(id, selected), [selected]);

	return (
		<ItemsViewItemStateContext value={{ hover }}>
			<EventInjector onAnimationStart={e => handleAnimation(e, true)} onAnimationCancel={e => handleAnimation(e, false)}>
				<StyledItemsViewItem
					$view={view!}
					$withBorder={withBorder}
					className={[className, view, { selected: selected !== "unchecked" }]}
					tabIndex={0}
					role={multiple ? "checkbox" : "radio"}
					aria-checked={checkStateToAriaChecked(selected)}
					aria-labelledby={`${ariaId}-title`}
					aria-describedby={`${ariaId}-details`}
					onClick={e => { onClick?.(id, selected, e); setSelected?.(selected => !selected); }}
					{...htmlAttrs}
				>
					<div className="base" {...baseAttrs}>
						{view === "grid" ? (
							<>
								<div className="image-wrapper">
									{typeof image === "string" ? <DefaultImage src={image} /> : image}
									{checkbox}
								</div>
								<div className="selection" />
							</>
						) : (
							<>
								{checkbox}
								{(image || icon) && (
									<div className={["image-wrapper", { topAlignIcon }]}>
										{typeof image === "string" ? <img src={image} /> : iconOrElement}
									</div>
								)}
								{textPart}
								{actions}
							</>
						)}
					</div>
					{view === "grid" && (iconOrElement || textPart) && (
						<div className="text-part">
							{iconOrElement}
							{textPart}
						</div>
					)}
				</StyledItemsViewItem>
			</EventInjector>
		</ItemsViewItemStateContext>
	);
}

ItemsViewItem.StateContext = ItemsViewItemStateContext;
