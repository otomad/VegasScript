const StyledDisabledButtonWrapper = styled.div`
	position: relative;

	&.disabled {
		cursor: not-allowed;
	}

	.badge {
		position: absolute;
		top: -2px;
		right: -2px;
		cursor: pointer;

		&:dir(rtl) {
			right: auto;
			left: -2px;
		}
	}
`;

export default function DisabledButtonWrapper({ disabled, children, ref, ...htmlAttrs }: FCP<{}, "div">) {
	return (
		<StyledDisabledButtonWrapper ref={ref} className={{ disabled }} {...htmlAttrs}>
			{children}
			<Badge hidden={!disabled} status="warning" />
		</StyledDisabledButtonWrapper>
	);
}
