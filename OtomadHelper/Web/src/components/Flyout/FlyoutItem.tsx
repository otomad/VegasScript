const StyledFlyoutItem = styled.div`
	display: flex;
	gap: 12px;
	align-items: center;
	margin-inline: 4px;
	padding: 8px 12px;
	border-radius: 4px;
`;

export /* @internal */ default function FlyoutItem({ icon, title, ...htmlAttrs }: FCP<{
	/** Icon. */
	icon?: DeclaredIcons;
	/** Title. */
	title?: ReactNode;
}, "div">) {
	return (
		<StyledFlyoutItem {...htmlAttrs}>
			<Icon name={icon || false} />
			<p>{title}</p>
		</StyledFlyoutItem>
	);
}
