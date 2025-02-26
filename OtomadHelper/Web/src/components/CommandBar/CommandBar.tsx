import type { TransitionGroupChildFactory } from "react-transition-group-fc";
import CommandBarGroup from "./CommandBarGroup";
import { CommandBarItem } from "./CommandBarItem";

const StyledCommandBar = styled.div`
	@layer props {
		--icon-only: false;
	}

	position: relative;
	padding: 4px;
	background-color: ${c("background-fill-color-acrylic-background-command-bar")};
	border: 1px solid ${c("stroke-color-surface-stroke-flyout")};
	border-radius: 6px;
	backdrop-filter: blur(10px);

	> * {
		${styles.effects.text.body};
		display: flex;
		align-items: center;
		block-size: 100%;
	}

	* {
		white-space: nowrap;
	}

	.command-bar-item {
		transition: all ${eases.easeInOutFluent} 500ms;

		.button {
			margin: 0;
			box-shadow: none !important;
			transition: ${fallbackTransitions}, min-inline-size 0s;

			@container style(--icon-only: true) or style(--too-narrow: true) {
				min-inline-size: unset;

				span {
					display: none;
				}
			}
		}

		&.enter,
		&.exit {
			overflow: hidden;

			.badge {
				scale: 0;
			}
		}

		${tgs()} {
			inline-size: 0;
			scale: 0.5;
			opacity: 0;
		}
	}

	&.gaps .command-bar-item:not(:last-child, :has(+ hr)) {
		margin-inline-end: 1px;
	}

	.sticky &,
	&.sticky {
		background-color: ${c("background-fill-color-acrylic-background-default")};
		box-shadow: 0 8px 16px ${c("shadows-flyout")};
	}

	hr {
		display: inline-block;
		align-self: stretch;
		margin-block: 4px;
		margin-inline: 1px;
		block-size: auto;
		inline-size: 1px;
		border: none;
		border-inline-start: 1px solid ${c("stroke-color-divider-stroke-default")};
	}

	&.shadow {
		position: absolute;
		visibility: hidden;
	}
`;

export /* @internal */ const CommandBarAnchorContext = createContext<{
	anchorName: string;
	position?: Position;
	tooNarrow?: boolean;
}>(null!);

type Position = "left" | "center" | "right";

export default function CommandBar({ position, autoCollapse, addGaps, children, className, style, ...htmlAttrs }: FCP<{
	/** Position the command bar to somewhere. */
	position?: Position;
	/** Auto collapse command bar if too narrow. */
	autoCollapse?: boolean;
	/** Add gaps between each command bar items? */
	addGaps?: boolean;
}, "div">) {
	const [commandBarEl, setCommandBarEl] = useDomRefs<"div">();
	const anchorName = useUniqueId("--command-bar");
	const childFactory: TransitionGroupChildFactory = child => child.type === "hr" ? <hr key={child.key} /> : child;
	const overflowed = useIsCommandBarOverflowed(commandBarEl.current[1]);

	return forMap(autoCollapse ? 2 : 1, i => (
		<StyledCommandBar
			key={i}
			ref={setCommandBarEl(i)}
			role="toolbar"
			aria-label="Command Bar"
			className={[className, position, { shadow: i !== 0, gaps: addGaps }]}
			style={{ ...style, anchorName }}
			{...htmlAttrs}
		>
			<CommandBarAnchorContext value={i === 0 ? { anchorName, position, tooNarrow: autoCollapse && overflowed } : {} as never}>
				<TransitionGroup childFactory={childFactory}>
					{children}
				</TransitionGroup>
			</CommandBarAnchorContext>
		</StyledCommandBar>
	));
}

CommandBar.Item = CommandBarItem;
CommandBar.Group = CommandBarGroup;

function useIsCommandBarOverflowed(element: MaybeRef<HTMLElement | null>) {
	const [overflowed, setOverflowed] = useState(false);

	useEffect(() => {
		const el = toValue(element);
		if (!el) return;

		const page = el.closest("main.page");
		if (page) { // In special circumstances of laziness, determine whether it is in the main page.
			const determine = () => {
				const { left, right } = el.getBoundingClientRect();
				const { left: pageLeft, right: pageRight } = page.getBoundingClientRect();
				setOverflowed(left < pageLeft || right > pageRight);
			};
			const observer = new MutationObserver(determine);
			observer.observe(page, { attributeFilter: ["class"] });
			window.addEventListener("resize", determine);
			return () => {
				observer.disconnect();
				window.removeEventListener("resize", determine);
			};
		} else {
			const observer = new IntersectionObserver(
				([e]) => setOverflowed(e.intersectionRatio < 1),
				{
					// rootMargin: "-1px 0px 0px 0px",
					threshold: [1],
				},
			);
			observer.observe(el);
			return () => observer.disconnect();
		}
	});

	return overflowed;
}
