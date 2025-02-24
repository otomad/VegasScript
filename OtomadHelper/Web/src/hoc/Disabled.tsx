export default function Disabled({ children, disabled = true as boolean | undefined, as = Fragment, container, ...htmlAttrs }: FCP<{
	/** Disable all children controls? */
	disabled?: boolean;
	/** Modify the container type. Defaults to `React.Fragment` (aka nothing). */
	as?: AsTarget;
	/** Same as `as`, but compatible with Styled Components. */
	container?: AsTarget;
}> & Record<string, unknown>) {
	disabled ||= undefined;
	const Container = (container ?? as) as GetReactElementFromTag<"div">;
	if (Container === Fragment) htmlAttrs = {};
	return (
		<Container {...htmlAttrs}>
			{React.Children.map(children, child =>
				React.cloneElement(child as ReactElement<FCP<{}, "div">>, {
					disabled,
					"aria-disabled": disabled,
				}),
			)}
		</Container>
	);
}

export function Inert({ children, inert = true as boolean | undefined, as = Fragment, container, ...htmlAttrs }: FCP<{
	/** Inert all children controls? */
	inert?: boolean;
	/** Modify the container type. Defaults to `React.Fragment` (aka nothing). */
	as?: AsTarget;
	/** Same as `as`, but compatible with Styled Components. */
	container?: AsTarget;
}> & Record<string, unknown>) {
	inert ||= undefined;
	const Container = (container ?? as) as GetReactElementFromTag<"div">;
	if (Container === Fragment) htmlAttrs = {};
	return (
		<Container {...htmlAttrs}>
			{React.Children.map(children, child =>
				React.cloneElement(child as ReactElement<FCP<{}, "div">>, {
					inert,
				}),
			)}
		</Container>
	);
}
