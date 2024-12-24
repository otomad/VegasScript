/*
 * I used to try lottie-minify: https://github.com/ahaoboy/lottie-minify
 * However it would break the lottie behavior.
 */

import esbuild from "esbuild";
import { readFile } from "fs/promises";
import { noop } from "lodash-es";
import type { Plugin } from "vite";

const lottieJsonExt = /\.json\?lottie$/i;
const getPath = (id: string) => lottieJsonExt.test(id) ? id.replace(/\?.*/, "") : false;

export default (): Plugin => {
	// @ts-ignore
	let config: Parameters<Plugin["configResolved"]>[0];

	return {
		name: "vite-plugin-minify-lottie-json",
		enforce: "pre",

		configResolved(resolvedConfig) {
			config = resolvedConfig;
		},

		async transform(_src, id) {
			const filePath = getPath(id);
			if (!filePath) return;

			const raw = await readFile(filePath, "utf-8");
			if (config.command === "serve") return raw;

			const json = JSON.parse(raw);
			const promises = walk(json);
			await Promise.all(promises);

			return JSON.stringify(json);
		},
	};
};

type AnyObject = Record<string, unknown>;
const isObject = (x: unknown): x is AnyObject => x !== null && typeof x === "object";

function walk(json: AnyObject) {
	const promises: Promise<unknown>[] = [];
	for (const key in json)
		if (Object.hasOwn(json, key)) {
			const value = json[key];
			if (isObject(value))
				promises.push(...walk(value));
			if (key === "x" && typeof value === "string" && value.startsWith("var $bm_rt")) {
				const minified = minify(value).then(min => json[key] = min.trimEnd()).catch(noop);
				promises.push(minified);
			} else if (key === "cm" && typeof value === "string")
				try {
					const jsonMarker = JSON.parse(value);
					json[key] = JSON.stringify(jsonMarker);
				} catch { }
		}
	return promises;
}

async function minify(code: string) {
	return (await esbuild.transform(code, {
		minify: true,
		charset: "utf8",
	})).code;
}
