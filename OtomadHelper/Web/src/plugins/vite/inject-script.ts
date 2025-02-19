import { readFile } from "fs/promises";
import path, { posix, resolve as resolve_ } from "path";
import type { HtmlTagDescriptor } from "vite";
import { compileTypeScript, minifyJavaScript, wrapIife } from "./utils";
import "../../utils/object";

export default (scripts: (string | PriorScript)[]): VitePlugin => {
	let config: VitePluginConfig;
	const resolve = (...paths: string[]) => resolve_(config.root, ...paths);
	let isDev: boolean;
	// let assetsDir: string[];
	let scripts_: (PriorScript & { source: string })[];
	const filters: Filter[] = [];
	const bundles = new Map<string, string>();

	return {
		name: "vite-plugin-inject-script",
		enforce: "pre",

		async configResolved(resolvedConfig) {
			config = resolvedConfig;
			isDev = config.command === "serve";

			scripts_ = await Promise.all(scripts.map(async script => {
				if (typeof script === "string") script = { src: script };
				script.src = script.src.trim();
				script.type ??= "script";
				script.injectTo ??= "head-append";
				if (script.filterHtml) filters.push(script.filterHtml);

				let source = await readFile(resolve(script.src), "utf-8");
				if (script.modify) source = script.modify(source);
				if (script.type === "iife") source = wrapIife(source);
				if (script.src.match(/\.[cm]?tsx?/i)) source = compileTypeScript(source);
				if (!isDev) source = await minifyJavaScript(source);

				return Object.assign(script, { source });
			}));
		},

		generateBundle() {
			for (const { src, source, inline } of scripts_) {
				if (inline) continue;
				const name = path.parse(src).name + ".js";
				const referenceId = this.emitFile({
					type: "asset",
					name,
					source,
				});
				bundles.set(src, this.getFileName(referenceId));
			}
		},

		configureServer(server) {
			for (const { src, source, inline } of scripts_) {
				if (inline) continue;
				let route = posix.join("/@inject-script", src);
				route = posix.format({ ...path.parse(route), base: "", ext: ".js" });
				server.middlewares.use(route, (_, res) => {
					res.setHeader("Content-Type", "text/javascript");
					res.end(source);
				});
				bundles.set(src, route);
			}
		},

		transformIndexHtml: {
			order: "pre",
			handler(_html, { filename }) {
				if (!filterHtmlFilename(filename, filters as never)) return;
				const tags = scripts_.map(script => {
					const { src, type, injectTo, modify: _modify, filterHtml, inline, blocking, source, ...attrs } = script;
					if (!filterHtmlFilename(filename, filterHtml)) return undefined!;

					if (blocking) attrs.blocking = blocking.join(" ");
					if (!inline) attrs.src = bundles.get(src);
					attrs.type = type === "script" || type === "iife" ? undefined : type;
					Object.compactUndefined(attrs);

					const result: HtmlTagDescriptor = { tag: "script", attrs };
					result.injectTo = injectTo === "head-append" ? "head" : injectTo === "body-append" ? "body" : injectTo;
					if (inline) result.children = source;
					return result;
				}).filter(Boolean);
				return tags;
			},
		},
	};
};

type Filter = (RegExp | string)[] | RegExp | string | ((filename: string) => boolean);
function filterHtmlFilename(filename: string, filter?: Filter): boolean {
	if (typeof filter === "function") return filter(filename);
	if (filter instanceof RegExp) return filter.test(filename);
	if (typeof filter === "string") return filename === filter;
	if (Array.isArray(filter) && filter.length > 0) return filter.some(oneFilter => filterHtmlFilename(filename, oneFilter));
	return true;
}

interface PriorScript {
	/** Path to the script (js/ts/jsx/tsx). */
	src: string;
	/**
	 * - `script` - Classic script.
	 * - `module` - JavaScript module.
	 * - `iife` - Wrap the script content with IIFE, and mark as "use strict".
	 * - Others - Directly pass to the type attribute.
	 */
	type?: "script" | "module" | "iife" | (string & {});
	/** Select where to insert the script. Defaults to "headAppend". */
	injectTo?: "head-prepend" | "head-append" | "body-prepend" | "body-append";
	/** Modify the source script content. */
	modify?(html: string): string;
	/** Filter the HTML files to be injected with the script. */
	filterHtml?: Filter;
	/** Directly set the script innerText? */
	inline?: boolean;
	/** The script will be fetched in parallel to parsing and evaluated as soon as it is available. */
	async?: boolean;
	/** Certain operations should be blocked on the fetching of the script. */
	blocking?: ("render")[];
	/** Allow error logging for sites which use a separate domain for static media. */
	crossOrigin?: "anonymous" | "use-credentials";
	/** Indicate the script is meant to be executed after the document has been parsed, but before firing `DOMContentLoaded` event. */
	defer?: boolean;
	/** Provide a hint of the relative priority to use when fetching an external script. */
	fetchPriority?: "high" | "low" | "auto";
	/** Contain inline metadata that a user agent can use to verify that a fetched resource has been delivered without unexpected manipulation. */
	integrity?: string;
	/** Serve fallback scripts to older browsers that do not support modular JavaScript code. */
	noModule?: boolean;
	/** A cryptographic nonce (number used once) to allow scripts in a script-src Content-Security-Policy. */
	nonce?: boolean;
	/** Indicate which referrer to send when fetching the script, or resources fetched by the script. */
	referrerPolicy?: "no-referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin" | "unsafe-url";
	/** Any other custom attributes. */
	[x: string]: Any;
}
