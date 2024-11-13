/// <reference path="./query-nothing.d.ts" />

import type { Plugin } from "vite";

export default (): Plugin => {
	return {
		name: "vite-plugin-query-nothing",
		enforce: "pre",

		load(id) {
			if (id.endsWith("?nothing"))
				return "export { };";
		},
	};
};
