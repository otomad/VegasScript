import ItemsViewItem, { type OnItemsViewItemClickEventHandler } from "./ItemsViewItem";

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

		&.list > .items-view-item > .base {
			padding-inline: 23.5px;
		}
	}
`;

export default function ItemsView<
	M extends boolean,
	T extends (M extends true ? PropertyKey[] : PropertyKey),
>({ view, current: [current, setCurrent], itemWidth, multiple = false as M, indeterminatenesses = [], children, className, role, ...htmlAttrs }: FCP<{
	/** View mode: list, tile, grid. */
	view: ItemView;
	/** The identifier of the currently selected item. */
	current: StateProperty<T>;
	/** In grid view, the width of the child element image. */
	itemWidth?: number;
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
}, "div">) {
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
			className={[className, view]}
			$itemWidth={itemWidth}
			role={role === null ? undefined : role === undefined ? multiple ? "group" : "radiogroup" : role}
			{...htmlAttrs}
		>
			{React.Children.map(children, child => {
				if (!isReactInstance(child, ItemsViewItem)) return child;
				const id = child.props.id;
				const onParentClick = child.props.onClick;
				return React.cloneElement(child, {
					selected: !isSelected(id) ? "unchecked" : indeterminatenesses.includes(id) ? "indeterminate" : "checked",
					_view: view,
					_multiple: multiple,
					onClick: (...e: Parameters<OnItemsViewItemClickEventHandler>) => { handleClick(id); onParentClick?.(...e); },
				});
			})}
		</StyledItemsView>
	);
}

ItemsView.Item = ItemsViewItem;
