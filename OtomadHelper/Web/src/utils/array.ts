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
		for (const item of items)
			while (true) {
				const index = this.indexOf(item);
				if (!~index) break;
				this.splice(index, 1);
			}
	};

	Array.prototype.insert = function (index, ...items) {
		if (index < 0) index = this.length + 1 + index;
		this.splice(index, 0, ...items);
	};

	Array.prototype.pushUniquely = function (item) {
		if (!this.includes(item))
			this.push(item);
	};

	Array.prototype.clearAll = function () {
		this.splice(0, Infinity);
	};

	Array.prototype.relist = function (items) {
		this.splice(0, Infinity, ...items);
	};

	Array.prototype.toggle = function (item) {
		const index = this.indexOf(item);
		if (!~index)
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
		const copy = this.slice();
		copy.pop();
		return copy;
	};

	Array.prototype.toShifted = function () {
		const copy = this.slice();
		copy.shift();
		return copy;
	};

	Array.prototype.mapImmer = function (callbackfn, thisArg) {
		// `forEach` doesn't support async function, so use `for` instead.
		for (let index = 0; index < this.length; index++) {
			const element = this[index];
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

	makePrototypeKeysNonEnumerable(Map);
}

/**
 * Map to an object via a constant array.
 * @remarks This JSDoc deliberately does not add "-" after the `@param` parameter, otherwise bugs will occur.
 * @param this **Constant** string array.
 * @param callbackFn - Generate key value tuples as objects.
 * @returns The mapped object.
 */
export function mapObjectConst<const T extends string, U>(array: T[], callbackFn: (value: T, index: number, array: T[]) => U) {
	return Object.fromEntries(array.map((value, index, array) => ([value, callbackFn(value, index, array)] as [T, U]))) as Record<T, U>;
}

/**
 * If the passed parameter is not an array, wrap it into an array that only one element,
 * otherwise return the array parameter itself.\
 * To ensure that the returned object is always an array.
 * @param maybeArray - Maybe an array, or something else.
 * @returns The original array or an array containing only one original parameter.
 */
export function wrapIfNotArray<T>(maybeArray: T): T extends Any[] ? T : T[] {
	return (Array.isArray(maybeArray) ? maybeArray : [maybeArray]) as never;
}

export async function asyncIterMap<TIn, TOut>(asyncIter: AsyncGenerator<TIn>, callbackfn: (value: TIn) => MaybePromise<TOut>) {
	const promises = [];
	for await (const value of asyncIter)
		promises.push(callbackfn(value));
	return await Promise.all(promises);
}

/** Creates a new tuple that is correctly recognized by TypeScript. */
export const Tuple = <T extends Any[]>(...args: T): T => args;

export const NEVER_MIND = [] as never;
