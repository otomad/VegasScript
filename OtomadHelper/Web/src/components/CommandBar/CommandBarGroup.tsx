const StyledCommandBarGroup = styled(StackPanel)`
	justify-content: space-between;

	&:has(> .left):not(:has(> .right)) {
		justify-content: flex-start;
	}

	&:has(> .right):not(:has(> .left)) {
		justify-content: flex-end;
	}

	&:has(> .center:only-child) {
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
