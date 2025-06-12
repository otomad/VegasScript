type WrapperType = ReactNode | ((props: { children?: ReactNode }) => ReactNode);

/**
 * Conditionally wraps the given children with a specified wrapper component or function.
 *
 * @returns The wrapped children if a wrapper is provided, otherwise the children as-is.
 */
export default function Wrapper(props: {
	/** The condition to determine which wrapper to use. */
	if: boolean;
	/** The wrapper to use if the condition is true. Can be a React element or a function that returns a React element. */
	true?: WrapperType;
	/** The wrapper to use if the condition is false. Can be a React element or a function that returns a React element. */
	false?: WrapperType;
	/** The children to be wrapped. */
	children?: ReactNode;
}): React.JSX.Element;
/**
 * Conditionally wraps the given children with a specified wrapper component or function.
 *
 * @returns The wrapped children if a wrapper is provided, otherwise the children as-is.
 */
export default function Wrapper(props: {
	/** The wrapper to use. Can be a React element or a function that returns a React element. */
	wrapper: WrapperType;
	/** The children to be wrapped. */
	children?: ReactNode;
}): React.JSX.Element;
/**
 * Conditionally wraps the given children with a specified wrapper component or function.
 *
 * @returns The wrapped children if a wrapper is provided, otherwise the children as-is.
 */
export default function Wrapper({ if: test, true: trueValue, false: falseValue, wrapper, children }: {
	/** The condition to determine which wrapper to use. */
	if?: boolean;
	/** The wrapper to use if the condition is true. Can be a React element or a function that returns a React element. */
	true?: WrapperType;
	/** The wrapper to use if the condition is false. Can be a React element or a function that returns a React element. */
	false?: WrapperType;
	/** The wrapper to use. Can be a React element or a function that returns a React element. */
	wrapper?: WrapperType;
	/** The children to be wrapped. */
	children?: ReactNode;
}) {
	wrapper ??= test ? trueValue : falseValue;
	if (!wrapper) return children;
	if (typeof wrapper === "function") return wrapper({ children });
	if (React.isValidElement<{ children?: ReactNode }>(wrapper)) return React.cloneElement(wrapper, { children });
	return wrapper;
}
