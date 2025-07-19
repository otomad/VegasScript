import type { ColorNames } from "styles/colors";
export /* @internal */ const backgroundColors: Record<Status, ColorNames> = {
	neutual: "fill-color-system-solid-neutral-background",
	accent: "accent-color",
	info: "fill-color-system-solid-neutral",
	asterisk: "fill-color-system-attention",
	warning: "fill-color-system-caution",
	success: "fill-color-system-success",
	error: "fill-color-system-critical",
};

const StyledBadge = styled.div<{
	/** The state of the badge, that is, the color. */
	$status: Status;
	/** Hidden? */
	$hidden?: boolean;
}>`
	${styles.mixins.oval()};
	${styles.mixins.flexCenter()};
	${styles.effects.text.caption};
	--size: 16px;
	display: inline-flex;
	flex-shrink: 0;
	block-size: var(--size);
	min-inline-size: var(--size);
	padding: 0 3px;
	text-align: center;
	background-color: ${c("fill-color-system-solid-neutral-background")};
	scale: 1;
	transition: ${fallbackTransitions}, scale ${eases.easeOutBackSmooth} 250ms;
	forced-color-adjust: none;

	&.exit {
		transition: ${fallbackTransitions}, scale ${eases.easeOutMax} 250ms;
	}

	&.icon-only {
		inline-size: var(--size);
	}

	${tgs()} {
		scale: 0;
	}

	${({ $status }) => css`
		color: ${c($status === "neutual" ? "foreground-color" : "fill-color-text-on-accent-primary")};
		background-color: ${c(backgroundColors[$status])};
	`}

	span {
		position: relative;
		top: -0.5px;
	}

	.icon {
		font-size: calc(var(--size) * 0.75);
	}

	&.beacon {
		block-size: 4px;
		inline-size: 4px;
		min-inline-size: unset;
		padding: 0;
	}

	${ifColorScheme.contrast} & {
		color: ${cc("HighlightText")};
		background-color: ${cc("Highlight")};
	}
`;

export default function Badge({ children, status = "info", colorOverride, hidden, transitionOnAppear = true, size, _requestAnimationFrame, className, ref, ...htmlAttrs }: FCP<{
	/** The state of the badge, that is, the color. */
	status?: Status;
	/** Replace the default color of `status` prop with a different status color. */
	colorOverride?: Status;
	/** Hidden? */
	hidden?: boolean;
	/** Play transition when the badge is appeared? */
	transitionOnAppear?: boolean;
	/** Badge size. */
	size?: Numberish;
	/** @internal */
	_requestAnimationFrame?: boolean;
}, "div">) {
	if (children === false) hidden = true;
	colorOverride ??= status;
	const iconName = `badge/${status.in("neutual", "accent") ? "info" : status}` as const;
	const beacon = typeof children === "boolean";
	return (
		<CssTransition in={!hidden} unmountOnExit appear={transitionOnAppear} requestAnimationFrame={_requestAnimationFrame}>
			<StyledBadge
				ref={ref}
				$status={colorOverride}
				className={[{ iconOnly: children === undefined, beacon }, className]}
				style={{ "--size": styles.toValue(size) }}
				{...htmlAttrs}
			>
				{!beacon && (children != null ? <span className="text">{children}</span> : <Icon name={iconName} />)}
			</StyledBadge>
		</CssTransition>
	);
}
