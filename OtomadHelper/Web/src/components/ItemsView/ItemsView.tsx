import ItemsViewItem from "./ItemsViewItem";

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
		display: grid;
		grid-template-columns: repeat(auto-fill, ${({ $itemWidth = 200 }) => styles.toValue($itemWidth)});
		gap: 4px;
		justify-content: center;
		align-items: start;
	}

	.expander-child-items & {
		&.tile {
			padding: 7px 35px;
		}

		&.grid {
			padding: 7px;
		}
	}
`;

export default function ItemsView<
	M extends boolean,
	T extends (M extends true ? PropertyKey[] : PropertyKey),
>({ view, current: [current, setCurrent], $itemWidth, multiple = false as M, children }: FCP<{
	/** View mode: list, tile, grid. */
	view: ItemView;
	/** The identifier of the currently selected item. */
	current: StateProperty<T>;
	/** In grid view, the width of the child element image. */
	$itemWidth?: number;
	/** Multiple selection mode? */
	multiple?: M;
}>) {
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
		<StyledItemsView className={[view]} $itemWidth={$itemWidth}>
			{React.Children.map(children, child => {
				if (!isReactInstance(child, ItemsViewItem)) return child;
				const id = child.props.id;
				return React.cloneElement(child, {
					selected: isSelected(id),
					_view: view,
					_multiple: multiple,
					onClick: () => handleClick(id),
				});
			})}
		</StyledItemsView>
	);
}

ItemsView.Item = ItemsViewItem;
