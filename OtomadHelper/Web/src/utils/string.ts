import dedent from "dedent";

{ // Init string extensions
	String.prototype.count = function (...substrings) {
		return sum(...substrings.map(substring => this.split(substring).length - 1));
	};

	String.prototype.reverse = function () {
		return Array.from(this).reverse().join("");
	};

	String.prototype.toBoolean = function () {
		return this.trim().toLowerCase() !== "false";
	};

	String.prototype.toArray = function () {
		return Array.from(this);
	};

	String.prototype.interpose = function (separator = ",") {
		return Array.from(this).join(separator);
	};

	String.prototype.in = function (this: undefined, ...list) {
		return list.includes(this);
	} as string["in"];

	String.prototype.removeSpace = function () {
		return this.replaceAll(/\s/g, "");
	};

	String.prototype.holeString = function (start, end?: number) {
		return this.slice(0, start) + this.slice(end ?? start + 1);
	};

	String.prototype.dedent = function () {
		return dedent(this.valueOf());
	};

	String.prototype.toCapitalized = function (keepCase = false) {
		const decapitated = this.slice(1);
		return this[0].toUpperCase() + (keepCase ? decapitated : decapitated.toLowerCase());
	};

	String.prototype.nowrapPerWord = function () {
		return this.replaceAll(" ", "\xa0");
	};

	String.prototype.nowrapPerChar = function () {
		return this.interpose("\u2060");
	};

	String.prototype.replaceStart = function (start, replacement = "") {
		if (!this.startsWith(start)) return this.valueOf();
		else return replacement + this.slice(start.length);
	};

	String.prototype.replaceEnd = function (end, replacement = "") {
		if (!this.endsWith(end)) return this.valueOf();
		else return this.slice(0, -end.length) + replacement;
	};

	String.prototype.with = function (index, character) {
		return Array.from(this).with(index, String(character)).join("");
	};

	makePrototypeKeysNonEnumerable(String);
}

/**
 * Verify that the object's toString output is meaningful and human-readable, rather than the default implementation "[object *]".
 * @param test - The object to test.
 * @returns The object's toString output doesn't match "[object *]".
 */
// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
export const canToString = (test: Object | undefined | null): test is string => !!test && !test.toString().match(/^\[object .*\]$/);

export { default as replacerWithGroups } from "helpers/replacerWithGroups";
