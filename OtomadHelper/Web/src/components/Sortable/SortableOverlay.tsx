import type { DropAnimation } from "@dnd-kit/core";
import { DragOverlay } from "@dnd-kit/core";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";

export /* @internal */ const PRESSED_SORTABLE_ITEM_OPACITY = "0.25";
const DRAGGING_SCALE = 1.025;

const StyledSortableOverlay = styled(DragOverlay)`
	--sortable-overlay-scale: ${DRAGGING_SCALE};

	* {
		transition: ${fallbackTransitions}, transform 0s;
	}

	> * {
		block-size: inherit;
		inline-size: inherit;
		scale: var(--sortable-overlay-scale);
		transition: ${fallbackTransitions}, scale 250ms cubic-bezier(0.18, 0.67, 0.6, 1.22), opacity 100ms 250ms;

		@starting-style {
			scale: 1;
		}
	}
`;

const dropAnimationConfig = (emits: SortableOverlayEmits): DropAnimation => async e => {
	const { transform, active, dragOverlay } = e;
	active.node.style.opacity = PRESSED_SORTABLE_ITEM_OPACITY;
	active.node.classList.add("dragging", "dropping");
	dragOverlay.node.classList.add("dropping");
	emits.onDrop?.(e);

	active.node.animate([{}, { opacity: 0 }], { easing: eases.easeOutQuad, duration: 250 });
	const transformAnimation = dragOverlay.node.animate([
		{ },
		{ transform: `translateY(${transform.y - dragOverlay.rect.top + active.rect.top}px)`, "--sortable-overlay-scale": 1 },
	], { easing: eases.easeOutMax, duration: 250, fill: "forwards" });
	await transformAnimation.finished;
	transformAnimation.commitStyles();

	active.node.style.opacity = null!;
	dragOverlay.node.hidden = true;
	active.node.classList.remove("dragging");
	emits.onDropped?.(e);
	await delay(100);
	active.node.classList.remove("dropping");
	dragOverlay.node.classList.remove("dropping");
	emits.onDropEnd?.(e);
};

export interface SortableOverlayEmits {
	/** Occurs when user release their pointer, the drag overlay started to move to the correct place. */
	onDrop?: DropAnimationSideEffects;
	/** Occurs when the drag overlay moved to the correct place. */
	onDropped?: DropAnimationSideEffects;
	/** Occurs after the drag overlay moved to the correct place. */
	onDropEnd?: DropAnimationSideEffects;
}

export /* @internal */ default function SortableOverlay({ children, ...emits }: FCP<SortableOverlayEmits>) {
	return (
		<Portal container={document.body}>
			<StyledSortableOverlay className={ifColorScheme.forceMotion} dropAnimation={dropAnimationConfig(emits)} modifiers={[restrictToVerticalAxis, restrictToParentElement]}>{children}</StyledSortableOverlay>
		</Portal>
	);
}
