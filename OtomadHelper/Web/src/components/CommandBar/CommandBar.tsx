import type { TransitionGroupProps } from "react-transition-group-fc";
import CommandBarGroup from "./CommandBarGroup";
import { CommandBarItem } from "./CommandBarItem";

const StyledCommandBar = styled.div`
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
`;

export /* @internal */ const CommandBarAnchorContext = createContext<{
	anchorName: string;
	position?: Position;
}>(null!);

type Position = "left" | "center" | "right";

export default function CommandBar({ position, children, className, style, ...htmlAttrs }: FCP<{
	/** Position the command bar to somewhere. */
	position?: Position;
}, "div">) {
	const anchorName = useUniqueId("--command-bar");
	const childFactory: TransitionGroupProps["childFactory"] = child => child.type === "hr" ? <hr key={child.key} /> : child;
	return (
		<StyledCommandBar role="toolbar" aria-label="Command Bar" className={[className, position]} style={{ ...style, anchorName }} {...htmlAttrs}>
			<CommandBarAnchorContext value={{ anchorName, position }}>
				<TransitionGroup childFactory={childFactory}>
					{children}
				</TransitionGroup>
			</CommandBarAnchorContext>
		</StyledCommandBar>
	);
}

CommandBar.Item = CommandBarItem;
CommandBar.Group = CommandBarGroup;
