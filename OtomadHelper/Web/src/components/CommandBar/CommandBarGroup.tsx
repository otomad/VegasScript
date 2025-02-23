const StyledCommandBarGroup = styled(StackPanel)`
	justify-content: space-between;

	&:has(> .left:only-child) {
		justify-content: flex-start;
	}

	&:has(> .right:only-child) {
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
