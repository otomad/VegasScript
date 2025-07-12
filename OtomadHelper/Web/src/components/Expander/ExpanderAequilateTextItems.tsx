export const expanderItemPadding = [7, 51] as const;
export const expanderItemWithIconPaddingInlineStart = 15;

const StyledExpanderAequilateTextItems = styled.div`
	display: grid;
	grid-template-columns: auto 1fr;

	> .expander-item {
		display: contents;

		> * {
			padding-block: ${expanderItemPadding[0]}px;
			transition: ${fallbackTransitions}, padding-inline 0s, border 0s;
		}

		> .leading {
			min-block-size: 48px;
			padding-inline: ${expanderItemWithIconPaddingInlineStart}px 16px;
		}

		> .trailing {
			inline-size: 100%;
			padding-inline-end: ${expanderItemPadding[1]}px;

			> * {
				inline-size: 100%;
			}
		}

		&:not(:last-child) > * {
			border-block-end: 1px solid ${c("stroke-color-divider-stroke-default")};
		}
	}

	@container (width < 622px) {
		grid-template-columns: auto;

		> .expander-item {
			> .leading {
				min-block-size: 41px !important;
				padding-block-end: 0;
				border-block-end-width: 0 !important;
			}

			> .trailing {
				padding-block-start: 0;
				padding-inline: 45px;
			}
		}
	}
`;

export /* @internal */ default StyledExpanderAequilateTextItems;
