/**
 * This Context is used to pass the interactive state of the parent component
 * downward to descendant components, such as hover, disabled, etc.
 */
const InteractionStateContext = createContext<{
	disabled?: boolean;
}>({});

export default InteractionStateContext;
