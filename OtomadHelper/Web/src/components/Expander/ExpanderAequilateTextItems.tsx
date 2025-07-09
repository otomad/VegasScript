export const expanderItemPadding = [7, 51] as const;
export const expanderItemWithIconPaddingInlineStart = 15;

const StyledExpanderAequilateTextItems = styled.div`
	display: grid;
	grid-template-columns: auto 1fr;

	> .expander-item {
		display: contents;

		> * {
			padding-block: ${expanderItemPadding[0]}px;
		}

		> .leading {
			padding-inline: ${expanderItemWithIconPaddingInlineStart}px 16px;
			min-block-size: 48px;
		}

		> .trailing {
			padding-inline-end: ${expanderItemPadding[1]}px;
			inline-size: 100%;

			> * {
				inline-size: 100%;
			}
		}

		&:not(:last-child) > * {
			border-block-end: 1px solid ${c("stroke-color-divider-stroke-default")};
		}
	}
`;

export /* @internal */ default StyledExpanderAequilateTextItems;
