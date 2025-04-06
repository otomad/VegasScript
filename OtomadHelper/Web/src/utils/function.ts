/**
 * Detect if the provided function is a native JavaScript function.
 *
 * A native function is identified by its string representation containing
 * the `[native code]` segment, which is typical for built-in JavaScript functions.
 *
 * @param func - The value to check, which can be of any type.
 * @returns Does the function's string representation match the pattern of a native function?
 */
export function isNativeFunction(func: unknown) {
	return typeof func === "function" && /^\s*function\s*(\b[a-z$_][a-z0-9$_]*\b)*\s*\((|([a-z$_][a-z0-9$_]*)(\s*,[a-z$_][a-z0-9$_]*)*)\)\s*{\s*\[native code\]\s*}\s*$/i.test(String(func));
}

/**
 * Compares two functions to determine if they are approximately equal.
 *
 * This function checks if both values are of type `function` and either:
 * - They are strictly equal (`===`);
 * - They are not native functions;
 * - Their `toString()` representations are equal.
 *
 * @param a - The first value to compare.
 * @param b - The second value to compare.
 * @returns Are both functions approximately equal?
 */
export function areFunctionsApproxEqual(a: unknown, b: unknown) {
	return typeof a === "function" && typeof b === "function" && (a === b ||
		!isNativeFunction(a) && !isNativeFunction(b) && a.toString() === b.toString()
	);
}

/**
 * Compares two functions to determine if they have the same name and number of parameters.
 *
 * @param a - The first value to compare.
 * @param b - The second value to compare.
 * @returns Are both functions have the same name and parameter count?
 */
export function areFunctionsGenerallyEqual(a: unknown, b: unknown) {
	return typeof a === "function" && typeof b === "function" &&
		a.name === b.name && a.length === b.length;
}
