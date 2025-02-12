import dedent from "dedent";

{ // Init string extensions
	String.prototype.countChar = function (...chars) {
		let count = 0;
		for (const char of this)
			if (chars.includes(char))
				count++;
		return count;
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

	String.prototype.inTwo = function (sep = ",") {
		return Array.from(this).join(sep);
	};

	String.prototype.in = function (this: undefined, ...list) {
		return list.includes(this);
	} as string["in"];

	String.prototype.removeSpace = function () {
		return this.replace(/\s/g, "");
	};

	String.prototype.holeString = function (start, end) {
		return this.slice(0, start) + this.slice(end);
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
		return this.inTwo("\u2060");
	};

	String.prototype.replaceStart = function (start, replacement = "") {
		if (!this.startsWith(start)) return this.valueOf();
		else return replacement + this.slice(start.length);
	};

	String.prototype.replaceEnd = function (end, replacement = "") {
		if (!this.endsWith(end)) return this.valueOf();
		else return this.slice(0, -end.length) + replacement;
	};

	makePrototypeKeysNonEnumerable(String);
}

export { default as replacerWithGroups } from "helpers/replacerWithGroups";
