import lodash from "lodash";

/**
 * Returns an array whose elements are arrays corresponding to the enumerable string-keyed
 * property key-value pairs found directly upon `object`. This is the same as iterating with a `for...in` loop,
 * except that a `for...in` loop enumerates properties in the prototype chain as well. The order of the array
 * returned by `Object.entries()` is the same as that provided by a `for...in` loop.
 *
 * Compared to `Object.entries`, the types of values returned in TypeScript are less disgusting.
 *
 * @note
 * `Object.entries` will not get the entries with symbol keys, this function will also contain the entries with symbol keys.
 *
 * @template TKey - The key enumeration type of the object.
 * @template TValue - The value type of the object.
 * @param obj - An object that can return key value pairs of its enumerable properties.
 * @returns
 * An array of the given object's own enumerable string-keyed property key-value pairs. Each key-value
 * pair is an array with two elements: the first element is the property key (which is always a string), and the
 * second element is the property value.
 */
export function entries<TKey extends string | number | symbol, TValue>(obj: { [s in TKey]?: TValue }) {
	return Reflect.ownKeys(obj).map(key => [key, obj[key as TKey]] as [TKey, TValue]);
}

/**
 * Returns an array of a given object's own enumerable string-keyed property names.
 *
 * Compared to `Object.keys`, the types of values returned in TypeScript are less disgusting.
 *
 * @note
 * `Object.keys` will not get the symbol keys, this function will also contain the symbol keys.
 *
 * @param obj - An object.
 * @returns An array of strings representing the given object's own enumerable string-keyed property keys.
 */
export function keys<TKey extends object>(obj: TKey) {
	return Reflect.ownKeys(obj) as (keyof TKey)[];
}

/**
 * Checks if the provided object has a specified own property.
 *
 * Compared to `Object.hasOwn`, the types of values returned in TypeScript are less disgusting.
 *
 * @template T - The type of the object. Must be an object type.
 * @param obj - The object to check.
 * @param key - The key to check for.
 * @returns Does the object have the specified own property?
 */
export function hasOwn<T extends object>(obj: T, key: PropertyKey): key is keyof T {
	return Object.hasOwn(obj, key);
}

/**
 * Copies all enumerable own properties from one or more source objects to a target object.
 * It returns the modified target object.
 *
 * Compared to `Object.assign`, when you are typing the source objects, you will enjoy the property type hints obtained
 * from the source object by TypeScript. In addition, since the TypeScript built-in library is implemented to merge the
 * type of the target object with the types of each source objects, in fact, we only need to maintain the original type
 * of the target object.
 *
 * @param target - The target object — what to apply the sources' properties to, which is returned after it is modified.
 * @param sources - The source object(s) — objects containing the properties you want to apply.
 * @return The target object.
 */
export function assign<TTarget extends object>(target: TTarget, ...sources: Partial<TTarget>[]): TTarget {
	return Object.assign(target, ...sources);
}

{ // Init object extensions
	Object.pick = function <T>(object: T, predicate: ObjectPickOmitPredicate<T> = [], thisArg?: unknown) {
		return _objectPickOrOmit(true, object, predicate, thisArg);
	};

	Object.omit = function <T>(object: T, predicate: ObjectPickOmitPredicate<T> = [], thisArg?: unknown) {
		return _objectPickOrOmit(false, object, predicate, thisArg);
	};

	Object.replaceKeys = function (object, replacement) {
		return Object.create({}, Object.fromEntries(entries(Object.getOwnPropertyDescriptors(object)).map(([key, descriptor]) => [replacement(key as keyof typeof object), descriptor] as const)));
	};

	Object.clear = function (object) {
		for (const prop of Reflect.ownKeys(object))
			delete object[prop];
	};

	Object.indexOf = function (object, index) {
		const key = Reflect.ownKeys(object)[index] as keyof typeof object;
		return [key, object[key]];
	};

	Object.compactUndefined = function (object) {
		for (const key of Reflect.ownKeys(object))
			if (object[key] === undefined)
				delete object[key];
	};
}

type ObjectPickOmitPredicate<T> = (keyof T)[] | ((currentValue: T[keyof T], key: keyof T, object: T) => boolean);
function _objectPickOrOmit<T>(isPick: boolean, object: T, predicate: ObjectPickOmitPredicate<T>, thisArg?: unknown): Partial<T> {
	if (object == null) return {};
	if (typeof predicate !== "function") {
		const keys = predicate;
		predicate = (_, key) => keys.includes(key);
	}
	if (thisArg != null) predicate = predicate.bind(thisArg);
	const descriptors = Object.getOwnPropertyDescriptors(object) as Record<string | symbol, PropertyDescriptor>;
	for (const key of Reflect.ownKeys(descriptors)) {
		const descriptor = descriptors[key];
		const value = "value" in descriptor ? descriptor.value : descriptor.get?.();
		const predicted = predicate(value, key as keyof T, object);
		if (isPick !== predicted) delete descriptors[key];
	}
	return Object.create(Object.getPrototypeOf(object), descriptors);
}

/**
 * Create an array of objects that repeat a specified number of times, such as for creating components in a loop.
 *
 * But we only need to care about the number of loops, not the content of the array.
 *
 * @template T - The object type to be repeated.
 * @param length - Number of loops.
 * @param callback - `map` callback.
 * @param startIndex - Initial index. Defaults to 0.
 * @param flat - Flatten the array?
 * @returns An array of objects repeated a specified number of times.
 */
export function forMap<T>(length: number, callback: (index: number, length: number) => T, startIndex: number = 0, flat: boolean = false) {
	const mapAction = (flat ? "flatMap" : "map") as "map";
	return Array<void>(length).fill(undefined)[mapAction]((_, index) => callback(index + startIndex, length));
}

/**
 * Map an array from the given start value to the end value.
 * @param start - Start value.
 * @param end - End value.
 * @param step - Step value.
 * @param callback - `map` callback.
 * @returns An array of objects repeated a specified number of times.
 */
export function forMapFromTo<T>(start: number, end: number, step: number, callback: (index: number) => T) {
	const result: T[] = [];
	for (let i = start; i <= end; i += step)
		result.push(callback(i));
	return result;
}

/**
 * Determine whether the object contains the key, while also guarding the type.
 * @param obj - Object.
 * @param key - Key.
 * @returns Does the object contain the key?
 */
export const hasKey = <T extends object>(obj: T, key: keyof Any): key is keyof T => key in obj;

/**
 * Intercept the `setter` method in `useState`.
 * @template T - The type to set in the `setter`.
 * @param setter - The `setter` method in `useState`.
 * @param interceptor - Interceptor.
 * @param subscribe - Do something after the value set.
 * @param getter - INTERNAL pass getter from `useStateSelector` hook.
 * @returns The generated new `setter` method.
 */
export function setStateInterceptor<T>(
	setter: SetState<T>,
	interceptor?: (userInput: Any, prevState: T) => T,
	subscribe?: (curState: T, prevState: T, userInput: Any) => void,
	getter?: (original: T) => T,
) {
	return (userInput: React.SetStateAction<T>) => {
		type PrevStateSetter = (value: (prevState: T) => void) => void;
		(setter as PrevStateSetter)(prevState => {
			if (getter) prevState = getter(prevState);
			const userInputValue = userInput instanceof Function ? userInput(prevState) : userInput;
			const curState = interceptor ? interceptor(userInputValue, prevState) : userInputValue;
			curState !== prevState && subscribe?.(curState, prevState, userInputValue);
			return curState;
		});
	};
}

/**
 * Map the old `useState` to a new `StateProperty`, such as its child property.
 * @template TOld - The old `StateProperty` type.
 * @template TNew - The new `StateProperty` type.
 * @param stateProperty - The old `useState`.
 * @param getter - The mapped new `getter`.
 * @param setter - The mapped new `setter`.
 * @returns The new `useState`.
 */
export function useStateSelector<TOld, TNew>(
	stateProperty: StateProperty<TOld>,
	getter: (original: TOld) => TNew,
	setter: (userInput: TNew, prevState: TOld) => TOld,
	{
		processPrevStateInSetterWithGetter = false,
	}: {
		/** In the new setter, it will use the new getter to preprocess the previous state. */
		processPrevStateInSetterWithGetter?: boolean;
	} = {},
) {
	return [
		getter(stateProperty[0]!),
		setStateInterceptor(stateProperty[1]!, setter, undefined, processPrevStateInSetterWithGetter ? getter as never : undefined),
	] as StateProperty<TNew>;
}

/**
 * Checks whether the given value is a `RefObject`.
 *
 * This function, `isRef`, checks whether the given value is a `RefObject`. It returns `true` if the value is a `RefObject`,
 * otherwise `false`. A `RefObject` is a type of reference in React that allows you to access a DOM element or instance.
 * The function takes a single parameter, `ref`, which is the value to check. The function returns a boolean value
 * indicating whether the value is a `RefObject` or not.
 *
 * @param ref - The value to check.
 * @returns Is the value a `RefObject`?
 *
 * @example
 * ```typescript
 * const ref: React.RefObject<HTMLElement> = React.useRef();
 * console.log(isRef(ref)); // Output: true
 *
 * const notRef: HTMLElement = document.getElementById("my-element")!;
 * console.log(isRef(notRef)); // Output: false
 * ```
 */
export function isRef<T>(ref: unknown): ref is RefObject<T> {
	return isObject(ref) && Object.hasOwn(ref, "current") && Object.keys(ref).length === 1;
}

/**
 * Restore the actual value that may be a `RefObject` to itself or any other value.
 *
 * This function, `toValue`, takes a `MaybeRef` type parameter `T` and a `MaybeRef<T>` type parameter `ref` as input. It returns
 * the actual value of the input. If the input is a `RefObject`, it retrieves the current value of the `RefObject` using the
 * `.current` property. Otherwise, it simply returns the input value as it is. This function is useful when you want to use
 * the actual value of a `RefObject` or any other value in your code, rather than the reference itself.
 *
 * @param ref - The `RefObject` to convert.
 * @returns The actual value of the `RefObject`.
 *
 * @example
 * ```typescript
 * const ref: React.RefObject<HTMLElement> = React.useRef();
 * console.log(toValue(ref)); // Output: <div id="my-element"> or undefined or null
 *
 * const notRef: HTMLElement = document.getElementById("my-element")!;
 * console.log(toValue(notRef)); // Output: <div id="my-element">
 * ```
 */
export function toValue<T>(ref: MaybeRef<T>): T {
	return isRef(ref) ? ref.current : ref;
}

/**
 * Creates a reference to an HTML DOM element without initializing it to null.
 *
 * This hook returns a reference to an HTML DOM element, which can be used to access the DOM element directly.
 * It is useful when you need to interact with the DOM element directly, rather than using React's controlled components.
 *
 * @remarks You must provide the `TElement` generic type.
 *
 * @template TElement - A tag name (e.g. `"div"`) or a subclass (e.g. `HTMLDivElement`) of the HTML DOM element class.
 * @param initialValue - The initial value of the reference. Usually to `null`.
 * @returns A reference to an HTML DOM element.
 *
 * @example
 * ```typescript
 * const ref = useDomRef<"div">();
 * // Or
 * const ref = useDomRef<HTMLDivElement>();
 * // Equivalent to
 * const ref = useRef<HTMLDivElement | null>(null);
 * ```
 */
export function useDomRef<TElement extends keyof ElementTagNameMap | Element>(initialValue: TagNameToElement<TElement> | null = null) {
	return useRef<TagNameToElement<TElement> | null>(initialValue);
}

/**
 * Creates a hook that returns a mutable reference to an HTML DOM element without initializing it to null.
 *
 * @remarks This will return a `StateProperty`, meaning that modifying the reference will also cause the component to re-render.
 *
 * @param initialValue - The initial value of the reference. Usually to `null`.
 * @returns A tuple containing the current value of the reference and a function to update it.
 *
 * @example
 * ```typescript
 * // Compare with `useDomRef`
 * const ref = useDomRef<"div">();
 * useEffect(() => {
 *     // This effect is only called during component initialization, regardless of whether the `ref` has changed.
 * }, [ref]);
 *
 * const [ref, setRef] = useDomRefState<"div">();
 * useEffect(() => {
 *     // This effect will be called as long as the `ref` changes.
 * }, [ref]);
 * ```
 */
export function useDomRefState<TElement extends keyof ElementTagNameMap | Element>(initialValue: TagNameToElement<TElement> | null = null) {
	type El = typeof initialValue;
	const [el, setEl] = useState<TagNameToElement<TElement> | null>(initialValue);
	return [el, (el: El) => {
		setEl(el);
		// return () => setEl(null); // It seems that unmount effect is useless.
	}] as const;
}

/**
 * Creates an array of references to an HTML DOM element.
 *
 * Useful when you want to use ref in a loop.
 *
 * @remarks You must provide the `TElement` generic type.
 *
 * @template TElement - A tag name (e.g. `"div"`) or a subclass (e.g. `HTMLDivElement`) of the HTML DOM element class.
 * @returns An array of references to an HTML DOM element.
 *
 * @example
 * ```typescriptreact
 * const [refs, setRef] = useDomRefs<"p">();
 *
 * return array.map((item, index) => <p key={item} ref={setRef(index)}>{item}</p>);
 * ```
 */
export function useDomRefs<TElement extends keyof ElementTagNameMap | Element>() {
	type TElementOrNull = TagNameToElement<TElement> | null;
	const refs: RefObject<TElementOrNull[]> = useRef([]);
	const setRef = (index: number) => (el: TElementOrNull) => { refs.current[index] = el; };
	return [refs, setRef] as const;
}

/**
 * Returns the global environment, used to define global variables.
 *
 * Also avoid warnings from TypeScript.
 */
export const globals = globalThis as AnyObject;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @category Lang
 * @param value - The value to check.
 * @returns Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
export function isObject(value: unknown): value is object {
	return value !== null && typeof value === "object";
	// return lodash.isObjectLike(value);
}

/**
 * Checks if `value` is a literal object. A literal object is an object that is created using object literal syntax.
 *
 * @category Lang
 * @param value - The value to check.
 * @returns Returns `true` if `value` is a literal object, else `false`.
 *
 * @example
 * ```typescript
 * const obj1 = { prop: "value" };
 * console.log(isLiteralObject(obj1)); // Output: true
 *
 * const obj2 = new Object({ prop: "value" });
 * console.log(isLiteralObject(obj2)); // Output: true
 *
 * const obj3 = function () { };
 * console.log(isLiteralObject(obj3)); // Output: false
 *
 * const obj4 = { prop: "value" }.constructor;
 * console.log(isLiteralObject(obj4)); // Output: false
 *
 * const obj5 = document;
 * console.log(isLiteralObject(obj5)); // Output: false
 *
 * const obj6 = /(.*)/;
 * console.log(isLiteralObject(obj6)); // Output: false
 *
 * const obj7 = new Date();
 * console.log(isLiteralObject(obj7)); // Output: false
 * ```
 */
export function isLiteralObject(value: unknown): value is object {
	return Object.prototype.toString.call(value) === "[object Object]";
}

/**
 * Asserts that the provided object is of the specified type.
 *
 * In fact, if used correctly, it can force the type of a variable to suddenly change to another type.
 *
 * @remarks Due to the limitations of TypeScript, it can only shrink the type.
 *
 * @template T - The type that the object should be.
 * @param object - The object to be asserted.
 *
 * @remarks This function is a no-op and does not perform any actual assertion. It is used to provide type safety and ensure that the object is of the specified type.
 *
 * @example
 * ```typescript
 * let foo = "foo"; // Type: string
 * asserts<"foo" | "bar">(foo);
 * foo; // Type: "foo" | "bar"
 *
 * let element = document.getElementById("my-element")!.firstElementChild!; // Type: Element
 * asserts<HTMLInputElement>(element);
 * element; // Type: HTMLInputElement
 *
 * let a = 123; // Type: number
 * asserts<string>(a);
 * a; // Type: never. Because type "number" is not assignable to type "string".
 *
 * let foo = "foo" as "foo" | "bar"; // Type: "foo" | "bar"
 * asserts<string>(foo);
 * foo; // Type is still "foo" | "bar", because it cannot increase the type.
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function asserts<T>(object: unknown): asserts object is T { }

/**
 * Checks if `value` is undefined, null, or NaN.
 *
 * @category Lang
 * @param value The value to check.
 * @returns Returns `true` if `value` is undefined, null, or NaN, else `false`.
 * @example
 *
 * isUndefinedNullNaN(undefined);
 * // => true
 *
 * isUndefinedNullNaN(null);
 * // => true
 *
 * isUndefinedNullNaN(NaN);
 * // => true
 *
 * isUndefinedNullNaN(123);
 * // => false
 */
export function isUndefinedNullNaN(object: unknown): object is undefined | null {
	return [undefined, null, NaN].includes(object as never);
}

/**
 * Makes the keys of the prototype non-enumerable.
 *
 * This function, `makePrototypeKeysNonEnumerable`, takes a constructor function as input.
 * It iterates through the keys of the constructor's prototype object and sets their enumerability to `false`.
 * This means that these keys will not be included when enumerating the properties of the prototype object using methods like `for...in` or `Object.keys()`.
 *
 * @param constructor - The constructor function whose prototype keys should be made non-enumerable.
 */
export function makePrototypeKeysNonEnumerable(constructor: AnyConstructor) {
	const protoKeys = Object.keys(constructor.prototype);
	for (const protoKey of protoKeys)
		Object.defineProperty(constructor.prototype, protoKey, {
			configurable: true, // Allowed to be overridden, if it has the same name as the ECMAScript method in the future.
			enumerable: false, // Do not print when being used in for in loops.
		});
}

/**
 * Defines a getter function on the prototype of a constructor function.
 *
 * This function is used to add a getter property to the prototype of a constructor function.
 * The getter function will be called when accessing the property on instances of the constructor.
 *
 * @template T - The type of the instances of the constructor.
 * @param constructor - The constructor function to which the getter property will be added.
 * @param protoKey - The name of the property to be added to the prototype.
 * @param getter - The function to be called when accessing the property.
 *
 * @example
 * ```typescript
 * class MyClass {
 *     private _value: number;
 *
 *     constructor(value: number) {
 *         this._value = value;
 *     }
 * }
 *
 * defineGetterInPrototype(MyClass, "value", function (this: MyClass) {
 *     return this._value;
 * });
 *
 * const instance = new MyClass(42);
 * console.log(instance.value); // Output: 42
 * ```
 */
export function defineGetterInPrototype<T>(constructor: new (...args: Any[]) => T, protoKey: string, getter: (this: T) => Any) {
	Object.defineProperty(constructor.prototype, protoKey, {
		get: getter,
		configurable: true,
		enumerable: false,
	});
}

/**
 * A no-operation function that returns undefined regardless of the arguments it receives.
 *
 * @return undefined
 */
export const noop = lodash.noop;

/**
 * Providing a list of boolean state properties (such as a list of toggle switches),
 * the logic of their setters will now be changed: when any toggle switch is turned on,
 * the other toggle switches in the list will be turned off. Achieve an effect similar to a radio button group.
 * This will make the toggle switches mutually exclusive.
 *
 * This function will return a new list of boolean state properties with the setters modified.
 * The original list of boolean status properties in the function parameters will also be modified.
 * As long as these tuples (boolean state properties) are not temporarily created when calling the function but existing variables,
 * you can reuse the original variables directly instead of the return values of the function.
 *
 * @param switches - S list of boolean state properties (such as a list of toggle switches).
 * @returns Same as parameter `switches`.
 */
export function mutexSwitches(...switches: (StateProperty<boolean> | StatePropertyNonNull<boolean> | SetState<boolean> | SetStateNarrow<boolean>)[]) {
	const originalSetStates: SetState<boolean>[] = [];
	const result: typeof originalSetStates = [];
	for (const switch_ of switches) {
		const originalSetState = (Array.isArray(switch_) ? switch_[1] : switch_)!;
		originalSetStates.push(originalSetState);
	}
	for (const [i, originalSetState] of originalSetStates.entries()) {
		const setState = setStateInterceptor(originalSetState, value => {
			if (value)
				for (const otherSetState of originalSetStates)
					if (otherSetState !== originalSetState)
						otherSetState(false);
			return value;
		});
		result[i] = setState;
		const switch_ = switches[i];
		if (Array.isArray(switch_))
			switch_[1] = setState;
	}
	return result;
}

/**
 * Like JavaScript `with` syntax, but safer.
 *
 * @param object - A long name object.
 * @param getter - Rename that object to a short name, then get the result.
 *
 * @example
 * ```typescript
 * // With
 * console.log(foo.bar.baz, b => b * (b + 1));
 *
 * // Without
 * console.log(foo.bar.baz * (foo.bar.baz + 1));
 * ```
 */
export function withObject<TObject, TReturn>(object: TObject, getter: (object: TObject) => TReturn) {
	return getter(object);
}

/**
 * Check if a object is a state property.
 */
export function isStateProperty<T>(object: unknown): object is StateProperty<T> {
	return Array.isArray(object) && object.length === 2 && typeof object[1] === "function";
}

/**
 * Determine whether the current context is in the top layer of a component or a hook function.
 * If so, it means that the "use" hooks can be called now.
 *
 * @warn This function use an unstable API, which may become invalid after a React update in the future.
 */
export function canUseHook() {
	// React 18.0
	// const internal = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
	// return !!internal.ReactCurrentDispatcher.current;

	// @ts-expect-error
	const internal = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	return !!internal.H;
}

/**
 * The ultimate method for determining the type of an element.
 * @param object - The element to be determined.
 * @param lowerCase - Should convert to all lowercase automatically? If false, preserve the case of the original name. Defaults to false.
 * @returns The type name of this element, which is case preserved by default, and custom types can also support type names instead of returning "Object".
 * @note This function does not support type guarding in TypeScript, it is recommended to use it only in the JavaScript level.
 */
// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
export /* @internal */ function type(object: Object | undefined | null, lowerCase: boolean = false) {
	const type = object != null ? object.constructor.name : Object.prototype.toString.call(object).slice(8, -1);
	return lowerCase ? type.toLowerCase() : type;
}

/**
 * @deprecated
 */
export function getCurrentState<T>(setter: SetState<T>) {
	return new Promise<T>(resolve => {
		(setter as SetStateNarrow<T>)(prevState => {
			resolve(prevState);
			return prevState;
		});
	});
}
