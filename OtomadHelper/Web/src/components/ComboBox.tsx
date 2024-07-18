import { StyledButton } from "./Button";

const StyledComboBox = styled(StyledButton)`
	padding: 4px 11px;

	:where(.settings-card > .base, .expander-item) > .trailing > :where(&) {
		width: 200px;
	}

	.content {
		${styles.mixins.square("100%")};
		display: flex;
		gap: 8px;
		align-items: center;

		.text {
			${styles.effects.text.body};
			width: 100%;
		}

		.icon {
			flex-shrink: 0;
			font-size: 16px;
		}
	}

	&:active .content .icon {
		translate: 0 2px;
	}

	select& option {
		background-color: ${c("background-color")};
	}
`;

export default function ComboBox<T extends string>({ options, current: [current, setCurrent], ...htmlAttrs }: FCP<{
	/** The options of the combo box. */
	options: readonly T[];
	/** The selected option of the combo box. */
	current: StateProperty<T>;
}, HTMLButtonElement & HTMLSelectElement>) {
	async function showComboBox(e: MouseEvent) {
		const rect = getBoundingClientRectTuple(e.currentTarget);
		const result = await bridges.bridge.showComboBox(rect, current!, options);
		setCurrent?.(result as T);
	}

	if (window.isWebView)
		return (
			<StyledComboBox onClick={showComboBox} {...htmlAttrs}>
				<div className="content">
					<div className="text">{current}</div>
					<Icon name="chevron_down" />
				</div>
			</StyledComboBox>
		);
	else // fallback in a normal browser
		return (
			<StyledComboBox as="select" defaultValue={current} onChange={e => setCurrent?.(e.currentTarget.value as T)} {...htmlAttrs}>
				{options.map(option => <option key={option}>{option}</option>)}
			</StyledComboBox>
		);
}
