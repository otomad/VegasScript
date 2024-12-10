const StackPanel = styled.div<{
	$direction?: "horizontal" | "vertical";
	$gap?: string | number;
	$align?: CSSProperties["justifyContent"];
	$endAlignWhenWrap?: boolean;
	$nowrap?: boolean;
}>`
	display: flex;
	flex-direction: ${({ $direction = "horizontal" }) => $direction === "vertical" ? "column" : "row"};
	// stylelint-disable-next-line declaration-block-no-redundant-longhand-properties
	flex-wrap: ${ifProp("$nowrap", "nowrap", "wrap")};
	gap: ${({ $gap = 8 }) => styles.toValue($gap)};
	justify-content: ${styledProp("$align", "normal")};
	align-items: center;

	.icon {
		font-size: 16px;
	}

	${ifProp("$endAlignWhenWrap", css`
		> :not(:first-child) {
			margin-inline-start: auto;
		}
	`)}
`;

export default StackPanel;
