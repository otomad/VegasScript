type ReactElementType = string | React.JSXElementConstructor<Any>;

/**
 * Determine whether a component is an instance of a certain component type.
 * @remarks It seems that the specified component type appears to require placement in a separate file,
 * rather than in the same file as where the function is invoked.
 * @param node - Component instance.
 * @param element - Component class or function component.
 * @returns Is its instance?
 */
export function isReactInstance<T extends ReactElementType>(node: ReactNode, element: T):
	node is ReactElement<T extends React.FC<infer P> ? P : unknown, T> {
	return React.isValidElement(node) && isObject(node) && "type" in node && node.type === element;
}

/**
 * Check if a React Node is a valid React Element and **not a React Fragment**.
 *
 * @remarks
 * In React 19, `React.Fragment` won't accept any unknown props, when you unexpected pass other props to
 * `React.Fragment`, you will get a warning:
 *
 * > Invalid prop supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.
 *
 * It is best to disqualify the `React.Fragment` when you are testing `React.isValidElement()`.
 *
 * @param object - The React Node to test.
 * @returns The React Node is a valid React Element and **not a React Fragment**?
 */
export function isValidElement<P>(object: {} | null | undefined): object is ReactElement<P> {
	return React.isValidElement(object) && object?.type !== React.Fragment;
}

/**
 * Prevent event bubbling and default behavior simultaneously.
 * @param event - Event (Vanilla JavaScript event or React wrapped event).
 */
export function stopEvent(event?: Pick<Event, "preventDefault" | "stopPropagation">) {
	if (!event) return;
	// React's self-declared Event type does not match the built-in Event type.
	event.preventDefault();
	event.stopPropagation();
}

/**
 * Checks if the given ReactNode has a ref property.
 * @param reactNode - The ReactNode to check for a ref.
 * @returns True if the ReactNode has a ref property, otherwise false.
 */
export function hasRefInReactNode(reactNode: unknown): reactNode is { ref: RefObject<Element | null> } {
	return !!(reactNode && typeof reactNode === "object" && "ref" in reactNode && reactNode.ref);
}

/**
 * Clones the provided children, replacing any refs with the provided nodeRef.
 * @param children - The ReactNode to clone and replace refs.
 * @param nodeRef - The RefObject to use as the new ref for any cloned elements with a ref.
 * @returns The cloned children with updated refs.
 */
export function cloneRef(children: ReactNode, nodeRef: RefObject<Element | null>) {
	return h(
		Fragment,
		null,
		React.Children.map(children, (child: ReactNode) => {
			if (!isValidElement(child)) return child;
			if (hasRefInReactNode(child)) {
				// useImperativeHandle(child.ref, () => nodeRef.current!, []);
				// child.ref.current = nodeRef.current;
				delete (child.ref as Partial<DomRef<Element>>).current;
				Object.defineProperty(child.ref, "current", {
					configurable: true,
					enumerable: true,
					get: () => nodeRef.current,
					set: value => nodeRef.current = value,
				});
			}
			return React.cloneElement(child as ReactElementWithDomRef, {
				ref: nodeRef,
			});
		}),
	);
}

type TargetType = Node | Element | RefObject<Element | null | undefined> | Event | EventTarget | null | undefined;
type DetectInPathType = Node | Element | RefObject<Element | null | undefined> | Event | EventTarget | string | null | undefined;

/**
 * Get an array from the specified element that traces back to the root element.
 *
 * Used to find the event target and bubble up to find the required element.
 *
 * @param target - HTML DOM node.
 * @returns An array of the specified element that traces back to the root element.
 */
export function getPath(target: TargetType): Element[] {
	if (isRef(target)) target = toValue(target);
	if (isObject(target) && "target" in target) target = target.target;
	if (!(target instanceof Element)) return [];
	const path: Element[] = [];
	while (target instanceof Element) {
		path.push(target);
		target = target.parentElement;
	}
	return path;
}

/**
 * According to the target node of the mouse event, find whether the element to be queried is or is its
 * ancestor node. For example, find whether the element is clicked, etc.
 *
 * @param target - The target HTML DOM node in the click event.
 * @param elements - The bubbling HTML DOM node to find. If it is a string, it represents the CSS selector
 * to be queried.
 * @returns The element to be queried is or is its ancestor node.
 */
export function isInPath(target: TargetType, ...elements: DetectInPathType[]): boolean {
	const path = getPath(target);
	return elements.some(element => {
		if (isRef(element)) element = toValue(element);
		if (isObject(element) && "target" in element) element = element.target;
		if (typeof element === "string") {
			for (const el of path)
				if (el.matches(element))
					return true;
			return false;
		}
		if (!(element instanceof Element)) return false;
		return path.includes(element);
	});
}

/**
 * Checks if the specified element is a "contents" display type.
 *
 * A "contents" display type means that the element will not create a new block formatting context,
 * and its children will be part of the parent's formatting context.
 *
 * @param element - HTML DOM element.
 * @returns True if the specified element is a "contents" display type, otherwise false.
 */
export function isElementContents(element: Element | undefined | null) {
	return !!(element && getComputedStyle(element).display === "contents");
}

/**
 * Checks if the specified element is hidden.
 *
 * This function checks if the specified element is hidden by checking it and its ancestor elements for any hidden
 * reasons, which considered hidden whether any of them have no parent, the `hidden` attribute is set to true, the
 * `display` CSS property is set to `none`, or the `visibility` CSS property is not set to `visible`.
 *
 * @param element - HTML DOM element to check for hidden status.
 * @returns True if the specified element is hidden, otherwise false.
 */
export function isElementHidden(element: Element | undefined | null): element is undefined | null {
	/*
	 * In fact, there is another simpler way to determine whether it and its ancestor are hidden, which is to check
	 * whether the offsetParent property of the specified element is null. However this way has many flaws. For example,
	 * if the parent node of the element to be determined is the root element or node, such as `<body>`, `<head>, `<html>`,
	 * it will be determined incorrectly. And it cannot also determine the situation of the visibility CSS property.
	 */
	const hiddenElement = getPath(element).find(element =>
		!element || // Passed a empty value to the parameter
		(element as HTMLElement).hidden || // `hidden` attribute is set to true
		getComputedStyle(element).display === "none" || // `display` CSS property is set to `none`
		getComputedStyle(element).visibility !== "visible", // `visibility` CSS property is set to `hidden` or `collapse`
	);
	return !!hiddenElement;
}

/**
 * Returns the index of the given element in the child list of its parent, or -1 if the element has no parent.
 * @param element - HTML DOM element.
 * @returns The index of the given element in the child list of its parent.
 */
export function getElementIndex(element: Element) {
	if (!element.parentElement) return -1;
	return [...element.parentElement.children].indexOf(element);
}

/**
 * React default dataset (data-* attributes) will automatically convert a boolean value to a string.
 * So this function will convert the boolean values.
 * To make sure that add the attribute if the value is true and remove the attribute if the value is false.
 */
export function dataset(dataset: Record<string, Readable | boolean | undefined | null> = {}) {
	const entries = Object.entries(dataset);
	const result: Record<string, Readable> = {};
	for (const [camelKey, value] of entries) {
		const key = "data-" + new VariableName(camelKey).kebab;
		if (value === undefined || value === null || value === false)
			continue;
		else if (value === true)
			result[key] = "";
		else
			result[key] = value;
	}
	return result;
}

/**
 * Create a new image from URL.
 */
export function createImageFromUrl(url: string) {
	const image = new Image();
	image.src = url;
	return image.waitForLoaded();
}

type WithAttrsProps<TTag> = Partial<(TTag extends keyof ElementTagNameMap ? FCP<{}, TTag> : PropsOf<TTag>)>;
/**
 * You can reuse the component with some same props or attrs.
 * @note You have to declare it at the top level of a module. You should not declare it in a function or component,
 * otherwise every time that component changes, this entire component will be rerendered.
 * @param tag - HTML element tag (like `"div"`) or React component constructor (like `MyComponent`).
 * @param withProps - Part of the props or attrs of the element.
 * @returns A new component containing the partial props or attrs.
 */
export function withAttrs<TTag extends keyof ElementTagNameMap | React.FC>(tag: TTag, withProps: WithAttrsProps<TTag>) {
	return (props: WithAttrsProps<TTag>) => React.createElement(tag, { ...withProps, ...props }) as unknown as TTag;
}

/**
 * If the react node is a string or something like this, then apply aria label.
 * @param node - React node, maybe a string, number, bigint, i18n item, or something else.
 * @returns Plain string or undefined.
 */
export function applyAriaLabel(node: ReactNode) {
	return (typeof node).in("string", "number", "bigint") || isI18nItem(node) ? String(node) : undefined;
}

/**
 * Convert from `CheckState` to `aria-checked`.
 * `CheckState` | `aria-checked`
 * --- | ---
 * checked | true
 * unchecked | false
 * indeterminate | mixed
 * @param checkState - Check box selection status.
 * @returns Aria checked.
 */
export function checkStateToAriaChecked(checkState: CheckState): React.AriaAttributes["aria-checked"] {
	return ({
		checked: true,
		unchecked: false,
		indeterminate: "mixed",
	} as const)[checkState];
}
