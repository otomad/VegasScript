export /* @internal */ const settingsCardPadding = [13, 15] as const;

export /* @internal */ const StyledCard = styled.div<{
	/** Card width. */
	$width?: Numberish;
}>`
	inline-size: ${({ $width }) => styles.toValue($width ?? "100cqw")};
	text-align: initial;
	border-radius: 3px;
	transition: ${fallbackTransitions}, inline-size 0s;

	> .base {
		block-size: 100%;
		padding: ${settingsCardPadding[0]}px ${settingsCardPadding[1]}px;
		border-radius: 2px;
	}

	@layer base {
		border: 1px solid ${c("stroke-color-card-stroke-default")};

		> .base {
			background-color: ${c("background-fill-color-card-background-default")};
		}

		&:is(button, a) {
			&:hover,
			&:active {
				border-color: ${c("stroke-color-control-stroke-default")};
			}

			&:hover > .base {
				background-color: ${c("fill-color-control-secondary")};
			}

			&:active > .base {
				background-color: ${c("fill-color-control-tertiary")};
			}
		}
	}
`;

export default function Card<TTarget extends AsTarget = "div">({ width, children, as, ...htmlAttrs }: Override<PropsOf<TTarget>, {
	/** Card width. @default 100cqw */
	width?: Numberish;
	/** As container. */
	as?: TTarget;
}>) {
	return (
		<StyledCard $width={width} as={as} {...htmlAttrs}>
			<div className="base">
				{children}
			</div>
		</StyledCard>
	);
}
