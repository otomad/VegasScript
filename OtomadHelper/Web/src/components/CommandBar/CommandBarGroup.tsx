const StyledCommandBarGroup = styled(StackPanel)`
	justify-content: space-between;

	&:has(> .left):not(:has(> .right), :has(> .center)) {
		justify-content: flex-start;
	}

	&:has(> .right):not(:has(> .left), :has(> .center)) {
		justify-content: flex-end;
	}

	&:has(> .center):not(:has(> .left), :has(> .right)) {
		justify-content: center;
	}
`;

export /* @internal */ default function CommandBarGroup({ children }: FCP) {
	return (
		<StickyPerceptibility method="scroll">
			<StyledCommandBarGroup $sticky>
				{children}
			</StyledCommandBarGroup>
		</StickyPerceptibility>
	);
}
