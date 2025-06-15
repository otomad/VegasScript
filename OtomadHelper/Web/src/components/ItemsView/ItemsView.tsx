import ItemsViewItem, { GRID_VIEW_ITEM_HEIGHT, type OnItemsViewItemClickEventHandler } from "./ItemsViewItem";

const StyledItemsView = styled.div<{
	/** In grid view, the width of the child element image. Defaults to 200px. */
	$itemWidth?: number;
}>`
	:has(> &) {
		container: list-view / inline-size;
	}

	&.list {
		display: flex;
		flex-direction: column;
	}

	&.tile {
		display: grid;
		grid-template-columns: repeat(2, 1fr);

		@container list-view (width < 628px) {
			grid-template-columns: repeat(1, 1fr);
		}
	}

	&.grid {
		--grid-template-width: ${({ $itemWidth = 200 }) => styles.toValue($itemWidth)};
		display: grid;
		grid-template-columns: repeat(auto-fill, var(--grid-template-width));
		gap: 4px;
		justify-content: center;
		align-items: start;
		transition: ${fallbackTransitions}, --grid-template-width ${eases.easeOutMax} 250ms;

		&.auto-fill {
			grid-template-columns: repeat(auto-fill, minmax(var(--grid-template-width), 1fr));
		}
	}

	&:empty {
		display: none;
	}

	.expander-child-items & {
		&.tile {
			padding: 7px 35px;
		}

		&.grid {
			padding: 7px;
		}

		&.list .items-view-item > .base {
			padding-inline: 23.5px;
		}
	}

	@layer components {
		.items-view-item {
			${tgs()} {
				scale: 0.75;
				opacity: 0;
			}
		}
	}
`;

export default function ItemsView<
	M extends boolean,
	T extends (M extends true ? PropertyKey[] : PropertyKey),
>({ view, current: _current, itemWidth, multiple = false as M, indeterminatenesses = [], children, className, role, transition, style, inlineAlignment, autoFill, readOnly, emptyState, "aria-label": ariaLabel, ...htmlAttrs }: FCP<{
	/** View mode: list, tile, grid. */
	view: ItemView;
	/**
	 * The identifier of the currently selected item.
	 *
	 * If it is `null`, items view will not select its items, and you can control them by yourself.
	 */
	current: StateProperty<T> | null;
	/**
	 * In grid view, the width of the child element image.
	 *
	 * If it is "square", it will result the image of the grid view item become square.
	 */
	itemWidth?: number | "square";
	/** Multiple selection mode? */
	multiple?: M;
	/** Specifies which items are set to an indeterminate state. */
	indeterminatenesses?: PropertyKey[];
	/**
	 * Override the default aria role attribute.
	 *
	 * Note that if you want to remove the role attribute, pass it `null` instead of `undefined`,
	 * or nothing will happened.
	 */
	role?: AriaRole | null;
	/** Enable transition group for items view items. Passing a string represents it as the transition name. */
	transition?: boolean | string;
	/** Inline alignment (justify content). */
	inlineAlignment?: CSSProperties["justifyContent"];
	/** Auto fill items (grid view only). */
	autoFill?: boolean;
	/** Make items cannot be selected? */
	readOnly?: boolean;
	/** Show something while nothing in the items. */
	emptyState?: ReactNode;
}, "div">) {
	if (itemWidth === "square") itemWidth = GRID_VIEW_ITEM_HEIGHT;

	const [current, setCurrent] = _current ?? [];

	const isSelected = (id: PropertyKey) => {
		if (multiple)
			if (Array.isArray(current)) return current.includes(id);
			else return false;
		else return current === id;
	};

	const handleClick = (id: PropertyKey) => {
		setCurrent?.((
			!multiple ? id : produce((draft: PropertyKey[]) => {
				draft.toggle(id);
			})
		) as T);
	};

	return (
		<StyledItemsView
			className={[className, view, { autoFill }]}
			$itemWidth={itemWidth}
			role={role === null ? undefined : role === undefined ? multiple ? "group" : "radiogroup" : role}
			aria-label={ariaLabel ?? (role === undefined && multiple ? t.aria.checkboxGroup : undefined)}
			aria-hidden={false}
			style={{ ...style, justifyContent: inlineAlignment }}
			inert={readOnly}
			aria-readonly={readOnly}
			{...htmlAttrs}
		>
			{(() => {
				const items = React.Children.map(children, child => {
					if (!isReactInstance(child, ItemsViewItem, "weakest")) return child;
					const id = child.props.id;
					const onParentClick = child.props.onClick;
					const item = React.cloneElement(child, {
						_view: view,
						_multiple: multiple,
						..._current !== null && {
							selected: !isSelected(id) ? "unchecked" : indeterminatenesses.includes(id) ? "indeterminate" : "checked",
							onClick: (...e: Parameters<OnItemsViewItemClickEventHandler>) => { handleClick(id); onParentClick?.(...e); },
						},
					});
					if (!transition) return item;
					else return (
						<CssTransition
							key={id as string}
							classNames={typeof transition === "string" ? transition : undefined}
							unmountOnExit
							maxTimeout={250}
						>
							{item}
						</CssTransition>
					);
				});
				if (!items?.length && emptyState) return emptyState;
				if (!transition) return items;
				else return <TransitionGroup component={null}>{items}</TransitionGroup>;
			})()}
		</StyledItemsView>
	);
}

ItemsView.Item = ItemsViewItem;
