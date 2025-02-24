/**
 * Add attributes or properties to all children.
 * @example
 * ```jsx
 * <Attrs disabled>
 *     <button />
 *     <input />
 * </Attrs>
 *
 * // Equivalent to
 *
 * <button disabled />
 * <input disabled />
 * ```
 */
export default function Attrs({ children, ...attrs }: FCP<{}, "section">) {
	if ("disabled" in attrs && !("aria-disabled" in attrs))
		attrs["aria-disabled"] = attrs.disabled;
	return (
		<>
			{React.Children.map(children, child => {
				if (!isValidElement(child)) return child;
				return React.cloneElement(child, attrs);
			})}
		</>
	);
}
