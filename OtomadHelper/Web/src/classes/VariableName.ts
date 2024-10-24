/**
 * Variable name helper class.
 *
 * Used to easily convert a variable name into camelCase, kebab-case, and so on.
 */
export default class VariableName {
	#words: string[] = [];

	constructor(str: string, public keepCase: boolean = false) {
		this.value = str;
	}

	/**
	 * Reset the value.
	 * @param str - Any form of variable name.
	 */
	set value(str: string) {
		str = str.trim();
		this.#words =
			str.includes("_") ? str.split("_") :
			str.includes("-") ? str.split("-") :
			str
				.replaceAll(/(\d+)/g, " $1 ")
				.replaceAll(/([A-Z]+)/g, " $1")
				.replaceAll(/([A-Z][a-z])/g, " $1")
				.replaceAll(/^\s+|\s+$|\s+(?=\s)/g, "")
				.split(" ");
	}

	/**
	 * Convert to kebab-case.
	 */
	get kebab() {
		return this.#toLowerIfNotKeepCase(this.#words.join("-"));
	}

	/**
	 * Convert to snake_case.
	 */
	get snake() {
		return this.#toLowerIfNotKeepCase(this.#words.join("_"));
	}

	/**
	 * Convert to CONSTANT_CASE.
	 */
	get const() {
		return this.#words.join("_").toUpperCase();
	}

	/**
	 * Convert to PascalCase.
	 */
	get pascal() {
		return this.#words.map(word => this.#capitalize(word)).join("");
	}

	/**
	 * Convert to camelCase.
	 */
	get camel() {
		return this.#words.map((word, i) =>
			i !== 0 ? this.#capitalize(word) :
			this.keepCase ?
				VariableName.areAllUpper(word) ? word : word.toLowerCase() :
				word.toLowerCase(),
		).join("");
	}

	/**
	 * Convert to lowercase without any separators.
	 */
	get lower() {
		return this.#words.join("").toLowerCase();
	}

	/**
	 * Convert to UPPERCASE without any separators.
	 */
	get upper() {
		return this.#words.join("").toUpperCase();
	}

	/**
	 * Convert to word case, separated by spaces, all in lowercase.
	 */
	get words() {
		return this.#toLowerIfNotKeepCase(this.#words.join(" "));
	}

	/**
	 * Convert to Sentence case, separated by spaces, with only the first letter of the sentence capitalized.
	 */
	get sentence() {
		return this.#words.map((word, i) => i === 0 ? this.#capitalize(word) : this.#toLowerIfNotKeepCase(word)).join(" ");
	}

	/**
	 * Convert to Title Case, separated by spaces, with all first letters of words capitalized.
	 */
	get title() {
		return this.#words.map(word => this.#capitalize(word)).join(" ");
	}

	/**
	 * Convert to --css-custom-property-name-form, which is kebab-case with two dashes as the prefix.
	 */
	get cssVar() {
		return "--" + this.kebab;
	}

	/**
	 * Convert to css-property-form, which just like kebab-case, but if the first word is in "webkit", "moz", "ms", "o",
	 * it will use one dash as the prefix.
	 */
	get cssProperty() {
		const prefix = ["webkit", "moz", "ms", "o"].includes(this.#words[0]) ? "-" : "";
		return prefix + this.kebab;
	}

	/**
	 * Convert a word to uppercase the first letter and lowercase other letters.
	 * @param str - Word.
	 * @param keepCase - Do not modify other letters case?
	 * @returns Capitalize the first letter and lowercase other letters.
	 */
	#capitalize(str: string) {
		return str[0].toUpperCase() + this.#toLowerIfNotKeepCase(str.slice(1));
	}

	/**
	 * Check if all letters in the string are uppercase (ignoring numbers, punctuation, etc.).
	 * @param str - String.
	 * @returns Are all letters uppercase?
	 */
	static areAllUpper(str: string) {
		return str.toUpperCase() === str;
	}

	/**
	 * Converts all the alphabetic characters in a string to lowercase if not keep the case.
	 * @param str - String.
	 */
	#toLowerIfNotKeepCase(str: string) {
		return this.keepCase ? str : str.toLowerCase();
	}

	toString() { return this.#words.join(" "); }
	toJSON() { return this.camel; }
}
