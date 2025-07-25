/*
 * @see https://github.com/sotnikov-link/ts-keyof
 * @see https://github.com/dsherret/ts-nameof
 */

/** @see https://git.io/Jyvga */
type UnionToIntersection<U> = (U extends Any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

/** @see https://git.io/Jyv2R */
type UnionToTuple<T> = UnionToIntersection<T extends Any ? (t: T) => T : never> extends (_: Any) => infer W ? [...UnionToTuple<Exclude<T, W>>, W] : [];

/**
 * Get the name of a variable. The prescribed syntax format must be followed when using.
 *
 * @deprecated
 *
 * @param oneProperty
 * - An object that only contains the only one variable.
 * - An arrow function that returns the descendant of an object.
 *
 * @returns The name of the only one variable.
 * Or `undefined` (for JavaScript) and `unknown` (for TypeScript) when the argument is invalid.
 *
 * @example
 * ```typescript
 * nameof({ MyComponent }); // MyComponent
 * nameof(() => MyComponent.Child); // MyComponent.Child
 * ```
 */
export default function nameof<TObject extends {}>(oneProperty: TObject): (
	TObject extends () => void ? string :
	UnionToTuple<keyof TObject> extends [keyof TObject] ? keyof TObject : unknown
);
export default function nameof(object: {}): unknown {
	if (typeof object === "function") {
		const functionContent = object.toString().match(/^\(\s*\)\s*=>\s*(.*)/)?.[1];
		if (!functionContent || functionContent.startsWith("{")) return undefined;
		return functionContent;
	} else if (isObject(object)) {
		const keyList = Object.keys(object);
		return keyList.length === 1 ? keyList[0] : undefined;
	}
}

nameof.kebab = (object => {
	const name = nameof(object) as string;
	return new VariableName(name).kebab;
}) as typeof nameof;
