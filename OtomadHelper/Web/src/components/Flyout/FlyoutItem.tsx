const StyledFlyoutItem = styled.div`
	display: flex;
	gap: 12px;
	align-items: center;
	padding-block: 8px;
	padding-inline: 13px 12px;
	border-radius: 4px;

	@layer layout {
		margin-inline: 4px;

		.flyout.padding-x &,
		.flyout.padding-xy & {
			margin-inline: 0;
		}
	}

	p.title {
		${styles.mixins.hideIfEmpty()};
		@layer layout {
			&:empty ~ * {
				inline-size: 100%;
			}
		}
	}
`;

export /* @internal */ default function FlyoutItem({ icon, title, children, ...htmlAttrs }: FCP<{
	/** Icon. */
	icon?: DeclaredIcons;
	/** Title. */
	title?: ReactNode;
}, "div">) {
	return (
		<StyledFlyoutItem {...htmlAttrs}>
			<Icon name={icon || false} />
			<p className="title">{title}</p>
			{children}
		</StyledFlyoutItem>
	);
}
