const isPressed = ":is(:active, [data-pressed]):not(:has(button:active))", notPressedOrDisabled = ":not(:active, [data-pressed], [disabled])";
const inlinePadding = 11;

export /* @internal */ const StyledButton = styled.button<{
	/** The name of the background fill color. */
	$fillColorName?: string;
	/** The name of the background fill color when on subtle mode. */
	$subtleFillColorName?: string;
	/** Is the orientation of the icon changed based on the writing direction? */
	$dirBased?: boolean;
}>`
	${styles.mixins.flexCenter()};
	--border-outline-color: ${c("stroke-color-control-stroke-default")};
	--border-highlight-color: ${c("stroke-color-control-stroke-secondary-on-default")};
	--border-accent-color: transparent;
	--border-highlight-y-offset: 0;
	position: relative;
	display: inline-flex;
	min-height: 32px;
	padding: 4px ${inlinePadding}px 6px;
	border: none;
	border-radius: 4px;
	box-shadow:
		0 var(--border-highlight-y-offset) 0 0 var(--border-highlight-color),
		0 0 0 1px var(--border-outline-color),
		0 0 0 1px var(--border-accent-color) !important;

	&:hover {
		background-color: ${c("fill-color-control-secondary")};
	}

	&${isPressed} {
		background-color: ${c("fill-color-control-tertiary")};

		> .content {
			opacity: ${c("pressed-text-opacity")};

			.animated-icon {
				--state: pressed;
			}
		}
	}

	&[disabled] {
		background-color: ${c("fill-color-control-disabled")};

		> .content {
			color: ${c("foreground-color")};
			opacity: ${c("disabled-text-opacity")};
		}
	}

	&::after {
		${styles.mixins.square("100%")};
		content: "";
		position: absolute;
		inset: 0;
		border-radius: inherit;
	}

	&:focus-visible::after {
		${styles.effects.focus()};
	}

	&.subtle,
	&.hyperlink {
		padding: 0 11px;
		background-color: ${c("fill-color-subtle-transparent")};
		box-shadow: none !important;

		&::before {
			display: none;
		}

		&:hover {
			background-color: ${c("fill-color-subtle-secondary")};
		}

		&${isPressed} {
			background-color: ${c("fill-color-subtle-tertiary")};
		}
	}

	&:not(.subtle, .hyperlink, select) {
		margin: 1px;
	}

	&.subtle {
		&:not(.small-icon) .icon:has(+ :empty) {
			font-size: 20px;
		}

		&:has(+ .trailing-icon[data-type="button"]),
		.contents:has(+ .trailing-icon[data-type="button"]) > & {
			margin-inline-end: -8px;
		}
	}

	&.hyperlink {
		color: ${c("accent-color")};
		cursor: pointer;
	}

	&.extruded {
		margin-inline: ${-inlinePadding}px;
	}

	${({ $dirBased }) => $dirBased && css`
		&:dir(rtl) {
			.icon,
			.animated-icon .icon-box {
				scale: -1 1;
			}
		}
	`}

	${({ $fillColorName, $subtleFillColorName }) => !$fillColorName ? css`
		background-color: ${c("fill-color-control-default")};

		${ifColorScheme.dark} &${notPressedOrDisabled} {
			--border-highlight-y-offset: -1px;
		}

		${ifColorScheme.light} &${notPressedOrDisabled} {
			--border-highlight-y-offset: 1px;
		}
	` : css`
		--fill-color: ${c($fillColorName)};
		--border-outline-color: ${c("stroke-color-control-stroke-on-accent-default")};
		--border-highlight-color: ${c("stroke-color-control-stroke-on-accent-secondary")};
		--border-accent-color: ${c($fillColorName)};
		background-color: ${c($fillColorName)};

		* {
			color: ${c("fill-color-text-on-accent-primary")};
		}

		.icon svg,
		.icon svg * {
			color: inherit;
		}

		&:hover {
			--border-accent-color: ${c("fill-color", 90)};
			background-color: ${c("fill-color", 90)};
		}

		&${isPressed} {
			--border-accent-color: ${c("fill-color", 80)};
			background-color: ${c("fill-color", 80)};
		}

		&:not(.subtle)[disabled] {
			--border-accent-color: ${c("fill-color-accent-disabled")};
			background-color: ${c("fill-color-accent-disabled")};

			${ifColorScheme.light} & > .content {
				opacity: 1;
			}

			${ifColorScheme.dark} & {
				color: ${c("foreground-color")};
			}
		}

		&.subtle {
			--fill-color: ${c($subtleFillColorName!)};

			* {
				color: ${c($fillColorName)};
			}

			&:hover {
				background-color: ${c("fill-color", 75)};
			}

			&${isPressed} {
				background-color: ${c("fill-color", 65)};
			}

			&.neutral {
				&:hover,
				&${isPressed} {
					background-color: ${c("fill-color")};
				}
			}
		}

		${ifColorScheme.contrast} & {
			background-color: ${cc("ActiveText")};
		}
	`}

	${ifColorScheme.contrast} & {
		--border-highlight-y-offset: 0 !important;
		color: ${cc("ButtonText")};
		forced-color-adjust: none;

		&:hover,
		&${isPressed} {
			--border-outline-color: ${cc("Highlight")};
			color: ${cc("HighlightText")};
			background-color: ${cc("Highlight")} !important;
		}

		&${isPressed} {
			--border-outline-color: ${cc("ButtonFace")};
		}
	}

	@layer components {
		&:not(.min-width-unbounded) {
			min-inline-size: 96px;
		}
	}

	> .content > span {
		${styles.mixins.hideIfEmpty()};
		transition: none; // If enable transition, in Audio page, when toggle No Tuning in tuning method, the prelisten buttons text will be flickering.


		@layer components {
			&:is(:lang(en), :lang(vi), :lang(id)) {
				margin-block-start: -1px; // Solve bad font letter sinking.
			}
		}
	}
`;

export default function Button({ children, icon, animatedIcon, subtle, hyperlink, accent, dirBased, repeat, extruded, minWidthUnbounded, ariaHiddenForChildren, className, disabled, onRelease, onClick, ref, ...htmlAttrs }: FCP<{
	/** Button icon. */
	icon?: DeclaredIcons;
	/** Button animated icon. */
	animatedIcon?: DeclaredLotties;
	/**
	 * Use background-less button?
	 * - `true`: Besides background-less, when the button has only an icon and no text, the icon size will be increased additionally.
	 * - `"small-icon"`: Disable the additional effects of `true`.
	 */
	subtle?: boolean | "small-icon";
	/** Use hyperlink button? */
	hyperlink?: boolean;
	/** Attach accent color to the button? */
	accent?: boolean | "critical" | "success" | "attention" | "caution" | "neutral";
	/** Is the orientation of the icon changed based on the writing direction? */
	dirBased?: boolean;
	/** Is repeat button? When on, the `onClick` events will be triggered continuously when the button is pressed. */
	repeat?: boolean;
	/** Extrude the inline paddings. */
	extruded?: boolean;
	/** No min width? */
	minWidthUnbounded?: boolean;
	/** Add aria-hidden to children to prevent them from being read by screen readers. */
	ariaHiddenForChildren?: boolean;
	/** Mouse release button event. Only works with `RepeatButton`. */
	onRelease?: BaseEventHandler;
}, "button">) {
	const fillColorName = !accent ? undefined : accent === true ? "accent-color" : `fill-color-system-${accent}`;
	const subtleFillColorName = `fill-color-system-${accent === true ? "accent" : accent}-background`;
	const handleClick = useOnNestedButtonClick(onClick);

	return (
		<StyledButton
			as={repeat ? RepeatButton : "button"}
			ref={ref}
			type="button"
			role={hyperlink ? "link" : undefined}
			disabled={disabled}
			aria-disabled={disabled}
			className={[
				className,
				{
					subtle,
					smallIcon: subtle === "small-icon",
					hyperlink,
					extruded,
					minWidthUnbounded,
				},
				accent && typeof accent === "string" ? accent : "accent",
			]}
			$fillColorName={fillColorName}
			$subtleFillColorName={subtleFillColorName}
			$dirBased={dirBased}
			onRelease={repeat ? onRelease : undefined}
			onClick={handleClick}
			{...htmlAttrs}
		>
			<StackPanel className="content" $nowrap>
				{icon && <Icon name={icon} />}
				{animatedIcon && <AnimatedIcon name={animatedIcon} />}
				<span aria-hidden={ariaHiddenForChildren || undefined}>{children}</span>
			</StackPanel>
		</StyledButton>
	);
}
