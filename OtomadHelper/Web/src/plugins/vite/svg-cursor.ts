import { readFile } from "fs/promises";
import { JSDOM } from "jsdom";
import type { Plugin } from "vite";

const getSvgPath = (id: string, ext: RegExp) => ext.test(id) ? id.replace(/\?.*/, "") : false;

const svgCursorExt = /\.svg\?cursor$/i;
export const svgCursor = (): Plugin => {
	return {
		name: "vite-plugin-svg-cursor",
		enforce: "pre",

		async load(id) {
			const filePath = getSvgPath(id, svgCursorExt);
			if (!filePath) return;

			const svgString = await readFile(filePath, "utf-8");
			const cursorAttrs = getSvgDataset<"hotspotX" | "hotspotY" | "fallback">(svgString);
			const { hotspotX = "0", hotspotY = "0", fallback = "default" } = cursorAttrs;

			return `import svg from "${filePath}";\nexport default \`url("\${svg}") ${hotspotX} ${hotspotY}, ${fallback}\`;`;
		},
	};
};

const svgDatasetExt = /\.svg\?dataset$/i;
export const svgDataset = (): Plugin => {
	return {
		name: "vite-plugin-svg-dataset",
		enforce: "pre",

		async load(id) {
			const filePath = getSvgPath(id, svgDatasetExt);
			if (!filePath) return;

			const svgString = await readFile(filePath, "utf-8");
			const dataset = getSvgDataset(svgString);

			return `export default ${JSON.stringify(dataset)};`;
		},
	};
};

function getSvgDataset(svgString: string): DOMStringMap;
function getSvgDataset<TKeys extends string>(svgString: string): Record<TKeys, string>;
function getSvgDataset(svgString: string) {
	const svg = new JSDOM(svgString, { contentType: "text/xml" });
	return svg.window.document.documentElement.dataset;
}
