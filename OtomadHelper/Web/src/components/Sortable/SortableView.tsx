import type { Active, DragEndEvent, Modifiers, UniqueIdentifier } from "@dnd-kit/core";
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import moveDraggingCur from "assets/cursors/move_dragging.svg?cursor";
import nsResizeDraggingCur from "assets/cursors/ns_resize_dragging.svg?cursor";
import { StyledItemsView } from "components/ItemsView/ItemsView";
import ItemsViewItem from "components/ItemsView/ItemsViewItem";
import SortableItem from "./SortableItem";
import SortableOverlay, { type SortableOverlayEmits } from "./SortableOverlay";

const StyledSortableView = styled(StyledItemsView).attrs({
	role: "application",
	as: "ul",
})`
	list-style: none;

	&.list {
		gap: inherit;
		padding: 0;
	}

	* {
		transition: ${fallbackTransitions}, transform 0s, opacity 0s;
	}
`;

type BaseItem = {
	/** Unique identifier. */
	id: UniqueIdentifier;
} | UniqueIdentifier;

const getItemId = (item: BaseItem) =>
	isObject(item) ?
		// isStateProperty<UniqueIdentifier>(item.id) ?
		// item.id[0]! :
		item.id :
		item;

const addDatasets = (children: ReactNode, id: UniqueIdentifier, index: number, view?: ItemView) => React.Children.map(children, child =>
	isValidElement<AnyObject>(child) ? React.cloneElement(child, {
		"data-id": id,
		"data-index": index,
		...view && isReactInstance(child, ItemsViewItem, "weakest") ? { _view: view } : null,
	}) : child);

const minimumDistanceActivationConstraint = { distance: 15 };

export function SortableView<T extends BaseItem>({ items: itemsStateProperty, overlayEmits, fullyDraggable, view = "list", minDistance, unfocusableForSortableItems, children, onReorder }: FCP<{
	/** List items. The item must have `id` property in it. */
	items: StateProperty<T[]>;
	/** Rendered item. */
	children(states: StatePropertiedObject<T>, index: number, item: T): ReactNode;
	/** Sortable overlay drop animation side effects event handlers. */
	overlayEmits?: SortableOverlayEmits;
	/** Is there no drag handle and you can drag it the whole element? */
	fullyDraggable?: boolean;
	/** View mode: list, grid. */
	view?: /* ItemView */ "list" | "grid";
	/** Should user move a little distance before moving the item? Aka static friction. */
	minDistance?: boolean;
	/** Occurs after user reorder an item. */
	onReorder?(fromIndex: number, toIndex: number, items: T[]): MaybePromise<void>;
	/** Apply tabIndex -1 to sortable items? */
	unfocusableForSortableItems?: boolean;
}>) {
	if (isStatePropertyPremium(itemsStateProperty))
		itemsStateProperty = itemsStateProperty.useState();
	let [items, setItems] = itemsStateProperty;
	items ??= [];
	const states = useStoreStateArray(itemsStateProperty[0] as never) as StatePropertiedObject<T>[];
	const verticalDragOnly = view === "list";
	const modifiers: Modifiers = [verticalDragOnly && restrictToVerticalAxis, restrictToParentElement].toCompacted();

	const [active, _setActive] = useState<Active | null>(null);
	const setActive = setStateInterceptor(_setActive, undefined, active => forceCursor(active ? verticalDragOnly ? nsResizeDraggingCur : moveDraggingCur : null));
	const activeItem = useMemo(() => {
		const index = items.findIndex(item => getItemId(item) === active?.id);
		if (!~index) return null;
		return [states[index], index, items[index]] as const;
	}, [active, items]);
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: minDistance ? minimumDistanceActivationConstraint : undefined }),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
	);
	// const [pending, startTransition] = useTransition();
	// const [optimisticItems, setOptimisticItems] = useState<T[]>([]);
	const onDragEnd = ({ active, over }: DragEndEvent) => {
		if (over && active.id !== over?.id) {
			const activeIndex = items.findIndex(item => getItemId(item) === active.id);
			const overIndex = items.findIndex(item => getItemId(item) === over.id);
			// startTransition(async () => {
			setItems?.(arrayMove(items, activeIndex, overIndex));
			// if (isAsyncFunction(onReorder))
			// 	setOptimisticItems(arrayMove(items, activeIndex, overIndex));
			onReorder?.(activeIndex, overIndex, items);
			// setOptimisticItems([]);
			// });
			// setItems?.(arrayMove(items, activeIndex, overIndex));
			// if (isAsyncFunction(onReorder))
			// 	startTransition(() => setOptimisticItems({ activeIndex, overIndex }));
			// // console.log(items);
			// // console.log(arrayMove(items, activeIndex, overIndex));
			// // console.log("pending start");
			// await onReorder?.(activeIndex, overIndex, items);
			// // console.log("pending end");
		}
		setActive(null);
	};
	// console.log(pending, optimisticItems.map(i => i.filename));
	// const _items = pending ? optimisticItems : items;
	// console.log(pending, _items);

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragStart={({ active }) => setActive(active)}
			onDragEnd={onDragEnd}
			onDragCancel={() => setActive(null)}
			modifiers={modifiers}
		>
			<SortableContext items={items} strategy={verticalDragOnly ? verticalListSortingStrategy : undefined}>
				<StyledSortableView className={view}>
					{items.map((item, index) => {
						const id = getItemId(item);
						return (
							<SortableView.Item key={id} id={id} fullyDraggable={fullyDraggable} unfocusable={unfocusableForSortableItems}>
								{addDatasets(children(states[index], index, item), id, index, view)}
							</SortableView.Item>
						);
					})}
				</StyledSortableView>
			</SortableContext>
			<SortableOverlay {...overlayEmits} modifiers={modifiers}>
				{activeItem?.[2] && addDatasets(children(...activeItem), getItemId(activeItem[2]), activeItem[1], view)}
			</SortableOverlay>
		</DndContext>
	);
}

SortableView.Item = SortableItem;
SortableView.Overlay = SortableOverlay;
