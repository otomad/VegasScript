import crypto from "crypto";
import esbuild from "esbuild";
import ts from "typescript";

/**
 * Compile TypeScript source code to JavaScript code.
 * @param source - Source code.
 * @param target - Target environment.
 * @returns Compiled JavaScript code.
 */
export function compileTypeScript(source: string, target: keyof typeof ts.ScriptTarget = "ESNext") {
	return ts.transpileModule(source, {
		compilerOptions: {
			module: ts.ModuleKind.ESNext,
			target: ts.ScriptTarget[target],
		},
	}).outputText;
}

/**
 * Minify JavaScript source code.
 * @param source - Source code.
 * @returns Minified code.
 */
export async function minifyJavaScript(code: string) {
	return (await esbuild.transform(code, {
		minify: true,
		charset: "utf8",
	})).code;
}

/**
 * Wrap JavaScript source code with an IIFE self-executing function.
 * @param source - Source code.
 * @param useStrict - Prepend "use strict" directive?
 * @returns Converted code.
 */
export function wrapIife(source: string, useStrict: boolean = true) {
	return `(function () {\n${useStrict ? '"use strict";\n' : ""}${source}\n})();`;
}

/**
 * Create a hash.
 * @param data - String or binary.
 * @param algorithm - SHA-256, MD5, or something else.
 * @param encoding - Base64, Hex, or something else.
 * @returns Hash of data.
 */
export function createHash(data: string | crypto.BinaryLike, algorithm: "sha256" | "md5", encoding: crypto.BinaryToTextEncoding = "base64url") {
	return crypto.createHash(algorithm).update(data).digest(encoding);
}
