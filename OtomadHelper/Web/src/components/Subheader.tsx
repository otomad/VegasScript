const Subheader = styled.h4`
	margin-block: 10px 4px;
	margin-inline: 2px;
	font-weight: 600;

	&:first-child {
		margin-top: 0;
	}

	:is(.command-bar-group, .command-bar) + & {
		margin-top: -25px;
	}
`;

const InlineStartAnchoredSubheader = styled(Subheader) <{
	$anchorName: string;
}>`
	position: relative;
	visibility: hidden;

	&::after {
		content: attr(data-content);
		position: absolute;
		inset-block-start: 0;
		inset-inline-start: 0;
		visibility: visible;

		${({ $anchorName }) => $anchorName && css`
			inset-inline-start: anchor(start);
			position-anchor: ${$anchorName};
		`}
	}
`;

export default Object.assign(
	Subheader,
	{
		InlineStartAnchored: ({ ...htmlAttrs }: PropsOf<typeof InlineStartAnchoredSubheader>) =>
			<InlineStartAnchoredSubheader data-content={htmlAttrs.children} {...htmlAttrs} />,
	},
);
