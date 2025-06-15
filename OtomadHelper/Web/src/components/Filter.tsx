import PillButton from "./PillButton";

const StyledFilter = styled.div`
	display: flex;
	gap: 4px;
	align-items: center;
	margin-block: 4px;
	overflow: auto visible;
`;

export default function Filter<T extends PropertyKey>({ current: [current, setCurrent], children, ...htmlAttrs }: FCP<{
	/** The identifier of the currently selected item. */
	current: StateProperty<T>;
}, "div">) {
	return (
		<StyledFilter role="radiogroup" {...htmlAttrs}>
			{React.Children.map(children, child => {
				if (!isReactInstance(child, PillButton)) return child;
				const id = child.props.id as T;
				return React.cloneElement(child, {
					selected: current === id,
					onClick: () => setCurrent?.(id),
				});
			})}
		</StyledFilter>
	);
}

Filter.Item = PillButton;
