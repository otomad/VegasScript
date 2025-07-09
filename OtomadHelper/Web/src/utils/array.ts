{ // Init array extensions
	Array.prototype.removeAt = function (index) {
		this.splice(index, 1);
	};

	Array.prototype.removeItem = function (...items) {
		let successes = 0;
		for (const item of items) {
			const index = this.indexOf(item);
			if (!~index) continue;
			this.splice(index, 1);
			successes++;
		}
		return successes;
	};

	Array.prototype.removeAllItem = function (...items) {
		let successes = 0;
		for (let i = this.length - 1; i >= 0; i--)
			if (items.includes(this[i])) {
				this.splice(i, 1);
				successes++;
			}
		return successes;
	};

	Array.prototype.insert = function (index, ...items) {
		if (index < 0) index = this.length + 1 + index;
		this.splice(index, 0, ...items);
	};

	Array.prototype.pushUniquely = function (...items) {
		for (const item of items)
			if (!this.includes(item))
				this.push(item);
	};

	Array.prototype.clearAll = function () {
		this.splice(0, Infinity);
	};

	Array.prototype.relist = function (items) {
		this.splice(0, Infinity, ...items);
	};

	Array.prototype.toggle = function (item, force) {
		const index = this.indexOf(item);
		if (!~index || force)
			this.push(item);
		else
			this.removeAt(index);
	};

	Array.prototype.randomOne = function (record) {
		if (this.length === 0) return null;
		record = toValue(record);
		let index = randBetween(0, this.length - 1);
		if (record !== undefined) {
			if (record.length !== this.length + 1 || record.every((n, i) => i === 0 || n)) {
				let last = +record[0];
				if (!Number.isFinite(last)) last = -1;
				record.relist(Array(this.length + 1).fill(0));
				record[0] = last;
			}
			while (record[index + 1] !== 0 || index === record[0])
				index = randBetween(0, this.length - 1);
			record[index + 1] = 1;
			record[0] = index;
		}
		return this[index];
	};

	Array.prototype.mapObject = function (callbackFn) {
		const array = this;
		return Object.fromEntries(array.map((value, index, array) => callbackFn(value, index, array)));
	};

	Array.prototype.toUnique = function () {
		return [...new Set(this)];
	};

	Array.prototype.toCompacted = function () {
		return this.filter(Boolean);
	};

	Array.prototype.equals = function (another) {
		if (this === another) return true;
		if (this == null || another == null) return false;
		if (this.length !== another.length) return false;

		for (let i = 0; i < this.length; i++)
			if (this[i] !== another[i])
				return false;
		return true;
	};

	Array.prototype.last = function () {
		return this.at(-1);
	};

	Array.prototype.first = function () {
		return this[0];
	};

	Array.prototype.unique = function () {
		return this.relist(new Set(this));
	};

	Array.prototype.toTrimmed = function () {
		return this.filter(item => !(isUndefinedNullNaN(item) || typeof item === "string" && item.trim() === ""));
	};

	Array.prototype.trim = function () {
		return this.relist(this.toTrimmed());
	};

	Array.prototype.swap = function (index1, index2) {
		[this[index1], this[index2]] = [this[index2], this[index1]];
		return this;
	};

	Array.prototype.intersection = function (other) {
		return [...new Set(this).intersection(new Set(other))];
	};

	Array.prototype.toPopped = function () {
		return this.slice(0, -1);
	};

	Array.prototype.toShifted = function () {
		return this.slice(1);
	};

	Array.prototype.toPushed = function (...items) {
		return this.concat(items);
	};

	Array.prototype.toUnshifted = function (...items) {
		return this.toSpliced(0, 0, ...items);
	};

	Array.prototype.mapImmer = function (callbackfn, thisArg) {
		for (const [index, element] of this.entries()) {
			const result = callbackfn.call(thisArg, element, index, this);
			if (result instanceof Promise) result.then(value => this[index] = value);
			else this[index] = result;
		}
		return this;
	};

	Array.prototype.asyncMap = function (callbackfn, thisArg) {
		return Promise.all(this.map(callbackfn, thisArg));
	};

	Array.prototype.interpose = function (...separators) {
		const getSeparators = separators.length === 1 && typeof separators[0] === "function" ? separators[0] as Function : undefined;
		return this.reduce((result, current, index) => (result.push(...[...index ? getSeparators ? wrapIfNotArray(getSeparators(index, current, this)) : separators : [], current]), result), []);
	};

	Array.prototype.nextItem = function (currentItem, offset = 1, defaultIndex = 0) {
		if (this.length === 0) return undefined; // Prevent divided by 0.
		let index = this.indexOf(currentItem);
		if (!~index) // If current item is not in the array.
			// Note that the default index may also exceed the index range of the array.
			// But do not use `Array.prototype.at()`. For example, if the array length is 4, and the default index:
			// input: -1, output: 3;
			// input: 4, output: 0; (← `Array.prototype.at()` won't support this)
			return this[floorMod(defaultIndex, this.length)];
		index = floorMod(index + offset, this.length);
		return this[index];
	};

	Array.prototype.shouldReversed = function (reverse = true) {
		return reverse ? this.toReversed() : this;
	};

	Array.prototype.trimEnd = function <T>(nullish?: T[] | ((value: T, index: number, obj: T[]) => unknown)) {
		for (let i = this.length - 1; i >= 0; i--) {
			const item = this[i];
			if (
				!nullish && (isUndefinedNullNaN(item) || typeof item === "string" && item.trim() === "") ||
				Array.isArray(nullish) && nullish.includes(item) ||
				typeof nullish === "function" && nullish(item, i, this)
			) this.pop();
			else break;
		}
	};

	Array.prototype.includesDeep = function (searchElement) {
		return !!~this.indexOfDeep(searchElement);
	};

	Array.prototype.toggleDeep = function (item, force) {
		const index = this.indexOfDeep(item);
		if (!~index || force)
			this.push(item);
		else
			this.removeAt(index);
	};

	Array.prototype.indexOfDeep = function (searchElement, fromIndex = 0) {
		return this.findIndex((element, index) => index >= fromIndex && lodash.isEqual(element, searchElement));
	};

	Array.prototype.moveItemIndex = function (oldIndex, newIndex) {
		if (oldIndex < 0) oldIndex = this.length + oldIndex;
		if (newIndex < 0) newIndex = this.length + newIndex;
		this.splice(newIndex, 0, this.splice(oldIndex, 1)[0]);
		return this;
	};

	makePrototypeKeysNonEnumerable(Array);
}

{ // Init set extensions
	Set.prototype.adds = function (...values) {
		for (const value of values)
			this.add(value);
		return this;
	};

	Set.prototype.deletes = function (...values) {
		let successes = 0;
		for (const value of values)
			if (this.delete(value))
				successes++;
		return successes;
	};

	Set.prototype.toggle = function (item) {
		if (!this.has(item))
			this.add(item);
		else
			this.delete(item);
	};

	Set.prototype.equals = function (other) {
		return this.symmetricDifference(other).size === 0;
	};

	makePrototypeKeysNonEnumerable(Set);
}

{ // Init map extensions
	Map.prototype.emplace = async function (key, defaultValue) {
		if (!this.has(key)) {
			const value = await defaultValue();
			this.set(key, value);
			return value;
		} else
			return this.get(key);
	};

	Map.prototype.map = function (callbackfn) {
		return Array.from(this, ([key, value], index) => callbackfn(key, value, index, this));
	};

	Map.prototype.getEntry = function (key) {
		if (!this.has(key)) return;
		return [key, this.get(key)] as const;
	};

	makePrototypeKeysNonEnumerable(Map);
}

/**
 * Map to an object via a constant array.
 * @remarks This JSDoc deliberately does not add "-" after the `@param` parameter, otherwise bugs will occur.
 * @param constArray - **Constant** string array.
 * @param callbackFn - Generate key value tuples as objects.
 * @returns The mapped object.
 */
export function mapObjectConst<const T extends string, U>(constArray: readonly T[], callbackFn: (value: T, index: number, array: typeof constArray) => U) {
	return Object.fromEntries(constArray.map((value, index, array) => ([value, callbackFn(value, index, array)] as [T, U]))) as Record<T, U>;
}

/**
 * If the passed parameter is not an array, wrap it into an array that only one element,
 * otherwise return the array parameter itself.\
 * To ensure that the returned object is always an array.
 * @param maybeArray - Maybe an array, or something else.
 * @returns The original array or an array containing only one original parameter.
 * @example
 * ```typescript
 * wrapIfNotArray(["foo", "bar", "baz"]); // ["foo", "bar", "baz"]
 * wrapIfNotArray("foo"); // ["foo"]
 * ```
 */
export function wrapIfNotArray<T>(maybeArray: T): T extends Any[] ? T : [T] {
	return (Array.isArray(maybeArray) ? maybeArray : [maybeArray]) as never;
}

/**
 * Applies an asynchronous callback function to each value yielded by an AsyncGenerator,
 * collects the resulting promises, and returns a promise that resolves to an array of results.
 *
 * @template TIn - The type of values yielded by the input AsyncGenerator.
 * @template TOut - The type of values returned by the callback function.
 * @param asyncIter - The AsyncGenerator to iterate over.
 * @param callbackfn - A function that takes a value from the generator and returns a value or a promise of a value.
 * @returns A promise that resolves to an array of results from the callback function.
 */
export async function asyncIterMap<TIn, TOut>(asyncIter: AsyncGenerator<TIn>, callbackfn: (value: TIn) => MaybePromise<TOut>) {
	const promises = [];
	for await (const value of asyncIter)
		promises.push(callbackfn(value));
	return await Promise.all(promises);
}

/**
 * Concatenates multiple iterables into a single generator.
 *
 * @typeParam T - The type of elements in the iterables.
 * @param iterators - A list of iterables to concatenate.
 * @yields Elements from each iterable in the order they are provided.
 *
 * @example
 * ```typescript
 * const a = [1, 2];
 * const b = [3, 4];
 * for (const value of concatIter(a, b)) {
 *     console.log(value); // 1, 2, 3, 4
 * }
 * ```
 */
export function *concatIter<T, U>(...iterators: (Iterable<T> | Iterator<U>)[]) {
	for (const it of iterators)
		yield* it as Iterable<T | U>;
}

/** Creates a new tuple that is correctly recognized by TypeScript. */
export const Tuple = <T extends Any[]>(...args: T): T => args;

/** Aren't you teaching me what to do? */
export const NEVER_MIND = [] as never;
