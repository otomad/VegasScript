declare interface Array<T> {
	/**
	 * Delete the item in the array with the specified index value.
	 * @param index - The zero-based index of the desired code unit. A negative index will count back from the last item.
	 *
	 * @example
	 * ```javascript
	 * const baseArray = ["apple", "orange", "pear"];
	 * {
	 *     const array = baseArray.slice();
	 *     array.removeAt(1);
	 *     console.log(array); // ["apple", "pear"]
	 * }
	 * {
	 *     const array = baseArray.slice();
	 *     array.removeAt(-1);
	 *     console.log(array); // ["apple", "orange"]
	 * }
	 * ```
	 */
	removeAt(index: number): void;

	/**
	 * Delete the specified item in the array. If there are multiple duplicate items, only the first one will be deleted.
	 * @param items - Items that to be removed.
	 * @returns Successfully deleted count.
	 *
	 * @example
	 * ```javascript
	 * const array = ["apple", "orange", "pear", "pear"];
	 * array.removeItem("orange", "pear"); // 2
	 * console.log(array); // ["apple", "pear"]
	 * ```
	 */
	removeItem(...items: T[]): number;

	/**
	 * Delete all specified items in the array.
	 * @param items - Items that to be removed.
	 * @returns Successfully deleted count.
	 *
	 * @example
	 * ```javascript
	 * const array = ["apple", "orange", "pear", "pear"];
	 * array.removeAllItem("orange", "pear"); // 3
	 * console.log(array); // ["apple"]
	 * ```
	 */
	removeAllItem(...items: T[]): number;

	/**
	 * Insert items to the specified index in the array.
	 * @param index - The zero-based index of the desired code unit. A negative index will count back from the last item.
	 * @param items - Items that to be inserted.
	 *
	 * @example
	 * ```javascript
	 * const array = ["apple", "orange", "pear"];
	 * array.insert(1, "pineapple", "banana");
	 * console.log(array); // ["apple", "pineapple", "banana", "orange", "pear"]
	 * ```
	 */
	insert(index: number, ...items: T[]): void;

	/**
	 * Append the items to the end of the array only if they are not included.
	 * @param item - Items that to be added.
	 *
	 * @example
	 * ```javascript
	 * const array = ["apple", "orange", "pear"];
	 * array.pushUniquely("banana", "pear");
	 * console.log(array); // ["apple", "orange", "pear", "banana"]
	 * ```
	 */
	pushUniquely(...items: T[]): void;

	/**
	 * Empty the array.
	 *
	 * @example
	 * ```javascript
	 * const array = ["apple", "orange", "pear"];
	 * array.clearAll();
	 * console.log(array); // []
	 * ```
	 */
	clearAll(): void;

	/**
	 * Empty the source array and then inject new data.
	 * @remarks The difference from reassignment is that it does not change the pointer reference of the original array.
	 * @param items - New data.
	 *
	 * @example
	 * ```javascript
	 * const array = ["apple", "orange", "pear"];
	 * array.relist(["banana", "pineapple", "watermelon"]);
	 * console.log(array); // ["banana", "pineapple", "watermelon"]
	 * ```
	 */
	relist(items: Iterable<T>): void;

	/**
	 * Toggle the item whether the array contains it.
	 * If force is not given. And if the array contains the item, remove it; otherwise, add it.
	 *
	 * If force is true, adds item (same as `push()`). If force is false, removes item (same as `removeItem()`).
	 *
	 * @param item - Item.
	 * @param force - If included, turns the toggle into a one way-only operation.
	 * If set to false, then item will only be removed, but not added. If set to true, then item will only be added, but not removed.
	 *
	 * @example
	 * ```javascript
	 * const baseArray = ["apple", "orange", "pear"];
	 * {
	 *     const array = baseArray.slice();
	 *     array.toggle("banana");
	 *     console.log(array); // ["apple", "orange", "pear", "banana"]
	 * }
	 * {
	 *     const array = baseArray.slice();
	 *     array.toggle("orange");
	 *     console.log(array); // ["apple", "pear"]
	 * }
	 * {
	 *     const array = baseArray.slice();
	 *     array.toggle("orange", true);
	 *     console.log(array); // ["apple", "orange", "pear", "orange"]
	 * }
	 * {
	 *     const array = baseArray.slice();
	 *     array.toggle("banana", false);
	 *     console.log(array); // ["apple", "orange", "pear"]
	 * }
	 * ```
	 */
	toggle(item: T, force?: boolean): void;

	/**
	 * Returns a random item from the array.
	 * @param record - Random records. If provided, identical items will not be drawn until all items have been randomly drawn.
	 * @returns A random item in the array.
	 *
	 * @example
	 * ```javascript
	 * const array = ["apple", "orange", "pear"];
	 * array.randomOne(); // "orange" (The result is not unique.)
	 * ```
	 */
	randomOne(record?: MaybeRef<number[]>): T;

	/**
	 * Map to an object via any array.
	 * @param callbackFn - Generate key value tuples as objects.
	 * @returns The mapped object.
	 *
	 * @example
	 * ```javascript
	 * const array = ["apple", "orange", "pear"];
	 * const object = array.mapObject((item, index) => [item[0].toUpperCase(), `${index} - ${item}`]);
	 * console.log(object); // { A: "0 - apple", O: "1 - orange", P: "2 - pear" }
	 * ```
	 */
	mapObject<U>(callbackFn: (value: T, index: number, array: T[]) => Readonly<[PropertyKey, U]>): Record<T, U>;

	/**
	 * Array deduplication. This will return a new array.
	 * @returns Note that a new array will be returned.
	 *
	 * @example
	 * ```javascript
	 * const array = ["apple", "orange", "pear", "pear"];
	 * array.toUnique(); // ["apple", "orange", "pear"]
	 * ```
	 */
	toUnique(): T[];

	/**
	 * Remove any falsy values, such as `undefined`, `null`, `NaN`, `false`, `""`, `±0`, `0n`, `document.all`.
	 * This will return a new array.
	 * @returns A new array without any falsy values.
	 *
	 * @example
	 * ```javascript
	 * const array = [undefined, null, NaN, false, "", 0, -0, 0n, document.all];
	 * array.toCompacted(); // []
	 * ```
	 */
	toCompacted(): NonFalsy<T>[];

	/**
	 * Determine whether two arrays are equal, including positional order. Only shallow comparison.
	 * @deprecated Use `lodash.isEqual()` instead.
	 * @returns Are two arrays equal?
	 *
	 * @example
	 * ```javascript
	 * ["foo", "bar", "baz"].equals(["foo", "bar", "baz"]); // true
	 * ["foo", "bar", "baz"] == ["foo", "bar", "baz"]; // false
	 * ```
	 */
	equals(another: T[]): boolean;

	/**
	 * Get the last element of the array.
	 * @remarks If the array is empty, it will return undefined. However, at the TypeScript type level, there is an implicit empty removal,
	 * which is consistent with the type got when accessing elements directly using index values in `[]`. But if the type of the array
	 * already contains undefined, it will not remove empty.
	 * @return The last element of the array.
	 *
	 * @example
	 * ```javascript
	 * ["foo", "bar", "baz"].last(); // "baz"
	 * ```
	 */
	last(): T;

	/**
	 * Get the first element of the array.
	 * @remarks If the array is empty, it will return undefined. However, at the TypeScript type level, there is an implicit empty removal,
	 * which is consistent with the type got when accessing elements directly using index values in `[]`. But if the type of the array
	 * already contains undefined, it will not remove empty.
	 * @return The first element of the array.
	 *
	 * @example
	 * ```javascript
	 * ["foo", "bar", "baz"].first(); // "foo"
	 * ```
	 */
	first(): T;

	/**
	 * Array deduplication. This will modify the original array.
	 *
	 * @example
	 * ```javascript
	 * const array = ["apple", "orange", "pear", "pear"];
	 * array.unique();
	 * console.log(array); // ["apple", "orange", "pear"]
	 * ```
	 */
	unique(): void;

	/**
	 * Remove `undefined`, `null`, `NaN`, empty strings, or strings containing only white space characters from the array.
	 * This will return a new array.
	 *
	 * @example
	 * ```javascript
	 * const array = [undefined, null, NaN, "", "  ", "\n", "\r", "\t"];
	 * array.toTrimmed(); // []
	 * ```
	 */
	toTrimmed(): NonNullable<T>[];

	/**
	 * Remove `undefined`, `null`, `NaN`, empty strings, or strings containing only white space characters from the array.
	 * This will modify the original array.
	 *
	 * @example
	 * ```javascript
	 * const array = [undefined, null, NaN, "", "  ", "\n", "\r", "\t"];
	 * array.trim();
	 * console.log(array); // []
	 * ```
	 */
	trim(): void;

	/**
	 * Swap two items by their index in the array. This will modify the original array.
	 * @param index1 - The index of the first item.
	 * @param index2 - The index of the second item.
	 *
	 * @example
	 * ```javascript
	 * const array = ["apple", "orange", "pear"];
	 * array.swap(1, 2);
	 * console.log(array); // ["apple", "pear", "orange"]
	 * ```
	 */
	swap(index1: number, index2: number): T[];

	/**
	 * Get elements in both this and the other.
	 * @param other - Another collection to compare.
	 *
	 * @example
	 * ```javascript
	 * const array = ["apple", "orange", "pear"];
	 * array.intersection(["pen", "pineapple", "apple", "pen"]); // ["apple"]
	 * ```
	 */
	intersection(other: Iterable<T>): T[];

	/**
	 * Removes the last element from the copy of the array, and returns the copy of the array.
	 *
	 * @example
	 * ```javascript
	 * const array = ["apple", "orange", "pear"];
	 * array.toPopped(); // ["apple", "orange"]
	 * ```
	 */
	toPopped(): T[];

	/**
	 * Removes the first element from the copy of the array, and returns the copy of the array.
	 *
	 * @example
	 * ```javascript
	 * const array = ["apple", "orange", "pear"];
	 * array.toPopped(); // ["orange", "pear"]
	 * ```
	 */
	toShifted(): T[];

	/**
	 * Appends new elements to the end of the copy of an array, and returns the copy of the array.
	 * @param items - New elements to add to the array.
	 *
	 * @example
	 * ```javascript
	 * const array = ["apple", "orange", "pear"];
	 * array.toPushed("banana", "watermelon"); // ["apple", "orange", "pear", "banana", "watermelon"]
	 * ```
	 */
	toPushed(...items: T[]): T[];

	/**
	 * Inserts new elements at the start of the copy of an array, and returns the copy of the array.
	 * @param items - Elements to insert at the start of the array.
	 *
	 * @example
	 * ```javascript
	 * const array = ["apple", "orange", "pear"];
	 * array.toUnshifted("banana", "watermelon"); // ["banana", "watermelon", "apple", "orange", "pear"]
	 * ```
	 */
	toUnshifted(...items: T[]): T[];

	/**
	 * Calls a defined callback function on each element of an array, and replace the elements in the original array with the corresponding results.
	 * @note This will modify the original array.
	 * @param callbackfn - A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
	 * @param thisArg - An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
	 *
	 * @example
	 * ```javascript
	 * const array = ["apple", "orange", "pear"];
	 * array.mapImmer(fruit => fruit.toUpperCase());
	 * console.log(array); // ["APPLE", "ORANGE", "PEAR"]
	 * ```
	 */
	mapImmer<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];

	/**
	 * Calls a defined callback asynchronous function on each element of an array, and returns an array promise that contains the results.
	 * @param callbackfn An asynchronous function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
	 * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
	 *
	 * @example
	 * ```javascript
	 * const array = ["apple", "orange", "pear"];
	 * const responses = await array.asyncMap(article => fetch(`https://en.wikipedia.org/wiki/${article}`));
	 * console.log(responses); // [Response, Response, Response]
	 * ```
	 */
	asyncMap<U>(callbackfn: (value: T, index: number, array: T[]) => MaybePromise<U>, thisArg?: any): Promise<U[]>;

	/**
	 * Insert separators between every two elements in an array.
	 *
	 * @param separators - Get separators with its previous element and the index.
	 * @returns The processed new array, whose element type is a union of the type of the element in the original array and the type of the separators.
	 *
	 * @example
	 * ```javascript
	 * console.log("foo\nbar\nbaz".split("\n").interpose(i => document.createElement("h" + i)));
	 * // Output: ["foo", <h1>, "bar", <h2>, "baz"]
	 *
	 * console.log("foo\nbar\nbaz".split("\n").interpose(i => [document.createElement("h" + i), document.createElement("h" + i * 2)]));
	 * // Output: ["foo", <h1>, <h2>, "bar", <h2>, <h4>, "baz"]
	 * ```
	 */
	interpose<TSeparator>(separators: (index: number, previous: T, array: T[]) => TSeparator | TSeparator[]): (T | TSeparator)[];
	/**
	 * Insert separators between every two elements in an array.
	 *
	 * @param separators - Separators.
	 * @returns The processed new array, whose element type is a union of the type of the element in the original array and the type of the separators.
	 *
	 * @example
	 * ```javascript
	 * console.log("foo\nbar\nbaz".split("\n").interpose(document.createElement("br")));
	 * // Output: ["foo", <br>, "bar", <br>, "baz"]
	 *
	 * console.log("foo\nbar\nbaz".split("\n").interpose(document.createElement("br"), document.createElement("br")));
	 * // Output: ["foo", <br>, <br>, "bar", <br>, <br>, "baz"]
	 * ```
	 */
	interpose<TSeparator>(...separators: TSeparator[]): (T | TSeparator)[];

	/**
	 * If, on the other hand, you feel seriously enough that this use of includes() should be accepted with no type assertions,
	 * and you want it to happen in all of your code, you could merge in a custom declaration.
	 * @see https://stackoverflow.com/a/56745484/19553213
	 */
	includes(searchElement: any, fromIndex?: number): boolean;

	/**
	 * Returns the next item in the array relative to the current item, with optional offset and wrapping.
	 *
	 * @param array - The array to search within.
	 * @param currentItem - The current item to find the next of.
	 * @param offset - The number of positions to move forward (or backward if negative). Defaults to 1.
	 * @param defaultIndex - The index to use if the current item is not found. Defaults to 0.
	 * @returns The item at the calculated position, wrapping around the array if necessary.
	 * Or the item at the default index if the current item is not found.
	 *
	 * @example
	 * ```javascript
	 * const array = ["a", "b", "c", "d"];
	 * array.nextItem("a"); // "b"
	 * array.nextItem("d"); // "a"
	 * array.nextItem("a", -1); // "d"
	 * array.nextItem("c", 3); // "b"
	 * array.nextItem("e"); // "a"
	 * array.nextItem("e", 1, 2); // "c"
	 * ```
	 */
	nextItem(currentItem: T, offset?: number, defaultIndex?: number);

	/**
	 * Returns the reversed array if the `reverse` flag is `true`.
	 * Otherwise, returns the original array.
	 *
	 * @param reverse - Optional. If `true`, returns a reversed array; if `false`, returns the original array. Defaults to `true`.
	 * @returns A new reversed array if `reverse` is `true`, otherwise the original array.
	 *
	 * @example
	 * ```javascript
	 * const array = ["apple", "orange", "pear"];
	 * array.shouldReversed(true); // ["pear", "orange", "apple"]
	 * array.shouldReversed(false); // ["apple", "orange", "pear"]
	 * ```
	 */
	shouldReversed(reverse?: boolean): this;

	/**
	 * Removes elements from the end of the array while the predicate returns `true`. This will modify the original array.
	 *
	 * - **If no predicate is provided, removes elements that are `undefined`, `null`, `NaN`, empty strings, or strings containing only white space characters.**
	 * - ~~If an array is provided as the nullish items, removes elements that are included in the nullish array.~~
	 * - ~~If a function is provided as the predicate, removes elements for which the function returns `true`.~~
	 *
	 * @param array - The array to trim elements from the end.
	 * @param predicate - **Optional.** ~~A function to test each element~~, or ~~an array of values to remove~~, or **undefined for default behavior**.
	 *
	 * @example
	 * ```javascript
	 * [2, 3, -1, 0, "", undefined].trimEnd(); // [2, 3, -1]
	 * [2, 3, -1, 0, -1, undefined].trimEnd([-1, undefined]); // [2, 3, -1, 0]
	 * [2, 3, -1, 0, 2, undefined].trimEnd(item => !(item && item % 2)); // [2, 3, -1]
	 * ```
	 */
	trimEnd(): void;
	/**
	 * Removes elements from the end of the array while the predicate returns `true`. This will modify the original array.
	 *
	 * - ~~If no predicate is provided, removes elements that are `undefined`, `null`, `NaN`, empty strings, or strings containing only white space characters.~~
	 * - **If an array is provided as the nullish items, removes elements that are included in the nullish array.**
	 * - ~~If a function is provided as the predicate, removes elements for which the function returns `true`.~~
	 *
	 * @param array - The array to trim elements from the end.
	 * @param nullish - ~~Optional.~~ ~~A function to test each element~~, or **an array of values to remove**, or ~~undefined for default behavior~~.
	 *
	 * @example
	 * ```javascript
	 * [2, 3, -1, 0, "", undefined].trimEnd(); // [2, 3, -1]
	 * [2, 3, -1, 0, -1, undefined].trimEnd([-1, undefined]); // [2, 3, -1, 0]
	 * [2, 3, -1, 0, 2, undefined].trimEnd(item => !(item && item % 2)); // [2, 3, -1]
	 * ```
	 */
	trimEnd(nullish: T[]): void;
	/**
	 * Removes elements from the end of the array while the predicate returns `true`. This will modify the original array.
	 *
	 * - ~~If no predicate is provided, removes elements that are `undefined`, `null`, `NaN`, empty strings, or strings containing only white space characters.~~
	 * - ~~If an array is provided as the nullish items, removes elements that are included in the nullish array.~~
	 * - **If a function is provided as the predicate, removes elements for which the function returns `true`.**
	 *
	 * @param array - The array to trim elements from the end.
	 * @param predicate - ~~Optional.~~ **A function to test each element**, or ~~an array of values to remove~~, or ~~undefined for default behavior~~.
	 *
	 * @example
	 * ```javascript
	 * [2, 3, -1, 0, "", undefined].trimEnd(); // [2, 3, -1]
	 * [2, 3, -1, 0, -1, undefined].trimEnd([-1, undefined]); // [2, 3, -1, 0]
	 * [2, 3, -1, 0, 2, undefined].trimEnd(item => !(item && item % 2)); // [2, 3, -1]
	 * ```
	 */
	trimEnd(predicate: (value: T, index: number, obj: T[]) => unknown): void;

	/**
	 * Determines whether an array includes a certain element, using deep equality comparison.
	 *
	 * @param array - The array to search within.
	 * @param searchElement - The element to search for in the array.
	 * @returns `true` if the array contains an element deeply equal to `searchElement`, otherwise `false`.
	 */
	includesDeep(searchElement: T): boolean;

	/**
	 * Toggle the item whether the array contains it. Using deep equality comparison.
	 * If force is not given. And if the array contains the item, remove it; otherwise, add it.
	 *
	 * If force is true, adds item (same as `push()`). If force is false, removes item (same as `removeItem()`).
	 *
	 * @param item - Item.
	 * @param force - If included deeply, turns the toggle into a one way-only operation.
	 * If set to false, then item will only be removed, but not added. If set to true, then item will only be added, but not removed.
	 */
	toggleDeep(item: T, force?: boolean): void;

	/**
	 * Returns the index of the first occurrence of a value in an array, or -1 if it is not present. Using deep equality comparison.
	 * @param searchElement The value to locate in the array.
	 * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
	 * @returns The index of the first occurrence of a value in an array, or -1 if it is not present. Using deep equality comparison.
	 */
	indexOfDeep(searchElement: T, fromIndex?: number): number;
}

declare interface ReadonlyArray<T> extends Pick<Array<T>,
	"mapObject" | "nextItem" | "includes"
> {
	/**
	 * If, on the other hand, you feel seriously enough that this use of includes() should be accepted with no type assertions,
	 * and you want it to happen in all of your code, you could merge in a custom declaration.
	 * @see https://stackoverflow.com/a/56745484/19553213
	 */
	includes(searchElement: any, fromIndex?: number): boolean;
}

declare interface Set<T> {
	/**
	 * Appends multiple new elements with multiple specified values to the end of the Set.
	 */
	adds(...values: T[]): this;

	/**
	 * Removes multiple specified values from the Set.
	 * @returns Returns the number of the element in the Set existed and has been removed.
	 */
	deletes(...values: T[]): number;

	/**
	 * Toggle the item whether the set contains it.
	 * If the set contains the item, remove it; otherwise, add it.
	 * @param item - Item.
	 */
	toggle(item: T): void;

	/**
	 * Comparing two Sets for equality.
	 */
	equals(other: Set<T> | SetLike<T>): boolean;
}

declare interface Map<K, V> {
	/**
	 * Retrieves the value associated with the specified key in the Map.
	 * If the key does not exist in the Map, it will initialize the key with the provided default value and return it.
	 *
	 * @template K - The type of the keys in the Map.
	 * @template V - The type of the values in the Map.
	 *
	 * @param key - The key of the value to retrieve or initialize.
	 * @param defaultValue - Get the default value to use if the key does not exist in the Map.
	 * Note that the `defaultValue` is a function to get the value, not the value itself.
	 * If the key exists, the function will not be called again.
	 *
	 * @returns The value associated with the specified key. If the key does not exist, the default value is returned.
	 */
	emplace(key: K, defaultValue: () => MaybeRef<V>): V;
	/**
	 * Retrieves the value associated with the specified key in the Map.
	 * If the key does not exist in the Map, it will initialize the key with the provided default value and return it.
	 *
	 * @template K - The type of the keys in the Map.
	 * @template V - The type of the values in the Map.
	 *
	 * @param key - The key of the value to retrieve or initialize.
	 * @param defaultValue - Get the default value to use if the key does not exist in the Map.
	 * Note that the `defaultValue` is a function to get the value, not the value itself.
	 * If the key exists, the function will not be called again.
	 *
	 * @returns The value associated with the specified key. If the key does not exist, the default value is returned.
	 */
	emplace(key: K, defaultValue: () => Promise<MaybeRef<V>>): Promise<V>;

	/**
	 * Calls a defined callback function on each key value pair of a map, and returns an array that contains the results.
	 * @param callbackfn - A function that accepts up to four arguments. The map method calls the callbackfn function one time for each element in the array.
	 */
	map(callbackfn: (key: K, value: V, index: number, map: Map<K, V>) => U): U[];

	/**
	 * Retrieves the entry for a given key from a Map as a tuple.
	 *
	 * @param map - The Map instance to search.
	 * @param key - The key whose entry should be retrieved.
	 * @returns A tuple containing the key and its corresponding value if the key exists in the map, otherwise `undefined`.
	 */
	getEntry(key: K): [K, V] | undefined;
}
