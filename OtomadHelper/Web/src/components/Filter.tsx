import PillButton from "./PillButton";

const StyledFilter = styled(HorizontalScroll)`
	${styles.mixins.noScrollbar()};
	container: filter / scroll-state inline-size;
	display: flex;
	flex-shrink: 0;
	gap: 4px;
	align-items: center;
	margin-block: -4px;
	margin-inline: -24px;
	padding-block: 8px;
	padding-inline: 24px;
	overflow: auto visible;

	.pills {
		display: inherit;
		gap: inherit;
		align-items: inherit;
	}
`;

export default function Filter<T extends PropertyKey>({ current: [current, setCurrent], children, ...htmlAttrs }: FCP<{
	/** The identifier of the currently selected item. */
	current: StateProperty<T>;
}, "div">) {
	return (
		<StyledFilter role="radiogroup" {...htmlAttrs}>
			<Flipper arrow="left" />
			<div className="pills">
				{React.Children.map(children, child => {
					if (!isReactInstance(child, PillButton)) return child;
					const id = child.props.id as T;
					return React.cloneElement(child, {
						selected: current === id,
						onClick: () => setCurrent?.(id),
					});
				})}
			</div>
			<Flipper arrow="right" />
		</StyledFilter>
	);
}

Filter.Item = PillButton;
