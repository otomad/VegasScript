import type { DropAnimation } from "@dnd-kit/core";
import { DragOverlay } from "@dnd-kit/core";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";

export /* @internal */ const PRESSED_SORTABLE_ITEM_OPACITY = "0.25";
const DRAGGING_SCALE = 1.025;

const StyledSortableOverlay = styled(DragOverlay)`
	* {
		transition: ${fallbackTransitions}, transform 0s;
	}

	> * {
		block-size: inherit;
		inline-size: inherit;
		scale: ${DRAGGING_SCALE};
		transition: ${fallbackTransitions}, scale 250ms cubic-bezier(0.18, 0.67, 0.6, 1.22), opacity 100ms 250ms;

		@starting-style {
			scale: 1;
		}
	}

	&.dropping > * {
		scale: 1;
	}
`;

const dropAnimationConfig = (emits: SortableOverlayEmits): DropAnimation => ({
	duration: 350,
	easing: "linear",
	keyframes: ({ transform }) => [
		{ transform: CSS.Transform.toString(transform.initial), offset: 0, easing: eases.easeOutMax },
		{ transform: CSS.Transform.toString({ ...transform.final, x: 0 }), opacity: 1, offset: 250 / 350 }, // Don't adjust translate X.
		// HACK: dnd kit will skip animation if the start and end keyframes are same, which is not we expected.
		// So hacked it with a useless CSS property, that make them never equal.
		{ transform: CSS.Transform.toString({ ...transform.final, x: 0 }), opacity: 0, offset: 1 },
	],
	sideEffects: e => {
		const { active, dragOverlay } = e;
		active.node.style.opacity = PRESSED_SORTABLE_ITEM_OPACITY;
		active.node.classList.add("dragging", "dropping");
		dragOverlay.node.classList.add("dropping");
		emits.onDrop?.(e);

		setTimeout(() => {
			active.node.style.opacity = null!;
			active.node.animate({ opacity: [0, 1] }, { easing: "linear", duration: 100 });
		}, 325);

		return async () => {
			active.node.classList.remove("dragging");
			emits.onDropped?.(e);
			await delay(100);
			active.node.classList.remove("dropping");
			dragOverlay.node.classList.remove("dropping");
			emits.onDropEnd?.(e);
		};
	},
});

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
