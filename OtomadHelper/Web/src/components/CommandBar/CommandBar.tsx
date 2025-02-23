import type { TransitionGroupProps } from "react-transition-group-fc";
import { CommandBarItem } from "./CommandBarItem";

const StyledCommandBar = styled.div<{
	/** Position the command bar to somewhere. */
	$position?: Position;
}>`
	// box-shadow: 0 8px 16px ${c("shadows-flyout")};
	position: relative;
	padding: 4px;
	background-color: ${c("background-fill-color-acrylic-background-command-bar")};
	border: 1px solid ${c("stroke-color-surface-stroke-flyout")};
	border-radius: 6px;
	backdrop-filter: blur(10px);

	${({ $position }) => {
		if (!$position) return undefined;
		const result = [css`
			position: absolute;
			z-index: 1;
		`];
		let matches: string | undefined;
		if ((matches = $position.match(/(left|right)/)?.[1])) result.push(css`${matches}: 0;`);
		if ((matches = $position.match(/(top|bottom)/)?.[1])) result.push(css`${matches}: 0;`);
		if ((matches = $position.match(/^(start|end)/)?.[1])) result.push(css`inset-block-${matches}: 0;`);
		if ((matches = $position.match(/(start|end)$/)?.[1])) result.push(css`inset-inline-${matches}: 0;`);
		return result;
	}}

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

const Hr = () => <hr />;

export default function CommandBar({ position, positioned, children, style, ...htmlAttrs }: FCP<{
	/** Position the command bar to somewhere. */
	position?: Position;
	/** CSS position property. */
	positioned?: CSSProperties["position"];
}, "div">) {
	const childFactory: TransitionGroupProps["childFactory"] = child => child.type === "hr" ? <Hr key={child.key} /> : child;
	return (
		<StyledCommandBar role="toolbar" aria-label="Command Bar" $position={position} style={{ ...style, position: positioned }} {...htmlAttrs}>
			<TransitionGroup childFactory={childFactory}>
				{children}
			</TransitionGroup>
		</StyledCommandBar>
	);
}

CommandBar.Item = CommandBarItem;
