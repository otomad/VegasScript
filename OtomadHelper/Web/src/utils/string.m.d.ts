declare interface String {
	/**
	 * Find the number of times a specified character appears in a string.
	 *
	 * @param chars - The characters to search for.
	 * @returns Find the number of specified characters.
	 *
	 * @example
	 * ```javascript
	 * console.log("hello world!".countChar("l")); // Output: 3
	 * ```
	 */
	countChar(...chars: string[]): number;

	/**
	 * Reverse the order of strings.
	 *
	 * Using `Array.from()` can avoid the problem of characters other than Unicode BMP not be reversed properly.
	 *
	 * @returns Reversed string.
	 *
	 * @example
	 * ```javascript
	 * console.log("hello world!".reverse()); // Output: "!dlrow olleh"
	 * console.log("🌸🐔".reverse()); // Output: "🐔🌸"
	 * ```
	 */
	reverse(): string;

	/**
	 * Convert the string to a boolean.
	 *
	 * Used to solve problems such as `"false" == false` being false.
	 *
	 * @returns Boolean.
	 */
	toBoolean(): boolean;

	/**
	 * Convert a string to a character array similar to C, where each item in the array corresponds to each character in the string.
	 *
	 * The function uses `Array.from()` which can avoid the problem of characters other than Unicode BMP are split into UTF-16 surrogate pairs.
	 *
	 * @returns An array in string form containing each character in the source string.
	 *
	 * @example
	 * ```javascript
	 * console.log("🌸🐔".toArray()); // Output: ["🌸", "🐔"]
	 *
	 * const string = "🌸🐔";
	 * const array = string.toArray();
	 *
	 * // Use indexer in the array
	 * console.log(array[0]); // Output: "🌸"
	 * console.log(array[1]); // Output: "🐔"
	 *
	 * // Use indexer in the string directly
	 * console.log(string[0]); // Output: "\uD83C"
	 * console.log(string[1]); // Output: "\uDF38"
	 * // As you can see, this will not return the original characters we expected.
	 * ```
	 */
	toArray(): string[];

	/**
	 * Insert a separator between every two characters in a string.
	 *
	 * @param separator - Separator. Defaults to `,`.
	 * @returns The processed string.
	 *
	 * @example
	 * ```javascript
	 * console.log("hello world!".interpose("|")); // Output: "h|e|l|l|o| |w|o|r|l|d|!"
	 * ```
	 */
	interpose(separator?: string): string;

	/**
	 * Is the string a certain string in the function parameters.
	 *
	 * This can be more conveniently used in TypeScript's type guard.
	 *
	 * @param list - To test whether a string array is included.
	 * @returns Included.
	 *
	 * @example
	 * ```typescript
	 * declare const a: "foo" | "bar" | "baz";
	 *
	 * // Use type guard
	 * a.in("foo", "bar") ?
	 *     a : // Type: "foo" | "bar";
	 *     a;  // Type: "baz";
	 *
	 * // Use `Array.prototype.includes` directly, this will never guard the type
	 * ["foo", "bar"].includes(a) ?
	 *     a : // Type: "foo" | "bar" | "baz";
	 *     a;  // Type: "foo" | "bar" | "baz";
	 *
	 * // Use `Array.prototype.includes` with a constant array, this will raise an error
	 * (["foo", "bar"] as const).includes(a) ? // Error: Type '"c"' is not assignable to type '"a" | "b"'
	 *     a : // Type: "foo" | "bar" | "baz";
	 *     a;  // Type: "foo" | "bar" | "baz";
	 * ```
	 */
	in<const T extends string>(...list: (T | undefined | null)[]): this is T;

	/**
	 * Remove all the white space characters in the string.
	 *
	 * @example
	 * ```javascript
	 * console.log("hello world ! ! !".removeSpace()); // Output: "helloworld!!!"
	 * ```
	 */
	removeSpace(): string;

	/**
	 * The hole is `[holeStart, holeEnd)`.
	 *
	 * And `String.prototype.holeString(holeStart, holeEnd)` will create a substring which contains `[0, holeStart) ∪ [holeEnd, end]`.
	 *
	 * @example
	 * ```javascript
	 * console.log("hello world!".holeString(3, 6)); // Output: "helworld!"
	 * ```
	 */
	holeString(holeStart: number, holeEnd: number): string;
	/**
	 * Create a substring which contains `[0, hole) ∪ (hole, end]`.
	 *
	 * @example
	 * ```javascript
	 * console.log("hello world!".holeString(4)); // Output: "hell world!"
	 * ```
	 */
	holeString(hole: number): string;

	/**
	 * A string that gets so long you need to break it over multiple lines.
	 * Luckily dedent is here to keep it readable without lots of spaces ending up in the string itself.
	 *
	 * Leading and trailing lines will be trimmed, so you can write something like this and have it work as you expect:
	 *
	 *   * how convenient it is
	 *   * that I can use an indented list
	 *     - and still have it do the right thing
	 *
	 * That's all.
	 */
	dedent(): string;

	/**
	 * Capitalizes the first character of a string.
	 *
	 * @param keepCase - If true, maintains the case of characters after the first one. If false, converts them to lowercase. Default is false.
	 * @returns A new string with the first character capitalized and the rest either maintained or converted to lowercase based on the `keepCase` parameter.
	 *
	 * @example
	 * ```javascript
	 * console.log("getElementById".toCapitalized()); // "Getelementbyid"
	 * console.log("getElementById".toCapitalized(true)); // "GetElementById"
	 * ```
	 */
	toCapitalized(keepCase?: boolean): string;

	/**
	 * Make sure there are no line breaks between every two words in the string.
	 *
	 * This will replace all the space characters in the string with the No-Break Space (U+00A0) characters.
	 * Note that other white space characters are not affected.
	 */
	nowrapPerWord(): string;

	/**
	 * Make sure there are no line breaks between any two characters in the string.
	 * Applicable to languages that do not use spaces as a boundary between words.
	 *
	 * This will insert a Word Joiner (U+2060; formerly Zero-Width No-Break Space, U+FEFF) character between any two characters in the string.
	 */
	nowrapPerChar(): string;

	/**
	 * Check if the string starts with the specified substring. If it is, replace it with a new substring.
	 * @param start - The starting substring to check.
	 * @param replacement - The new substring to replace. Defaults to empty string.
	 * @returns If the string does not start with the specified substring, return the original string;
	 * otherwise, return the replaced new string.
	 */
	replaceStart(start: string, replacement: string = ""): string;

	/**
	 * Check if the string ends with the specified substring. If it is, replace it with a new substring.
	 * @param end - The ending substring to check.
	 * @param replacement - The new substring to replace. Defaults to empty string.
	 * @returns If the string does not end with the specified substring, return the original string;
	 * otherwise, return the replaced new string.
	 */
	replaceEnd(end: string, replacement?: string = ""): string;

	/**
	 * Similar to C, replacing the character of an index in a string.
	 *
	 * @remarks
	 * Copies the string, then overwrites the character at the provided index with the given value.
	 * If the index is negative, then it replaces from the end of the array.
	 *
	 * @note
	 * Since the string in JavaScript belong to primitive type, it cannot be directly modified like C,
	 * and must be assigned to itself.
	 *
	 * @example
	 * ```javascript
	 * let str = "hello world!";
	 * str = str.with(1, "a"); // "hallo world!"
	 * ```
	 *
	 * @param index The index of the character to overwrite.
	 * If the index is negative, then it replaces from the end of the string.
	 * @param value The character to write into the copied string.
	 * @returns The copied string with the updated character.
	 */
	with(index: number, character: string): string;
}
