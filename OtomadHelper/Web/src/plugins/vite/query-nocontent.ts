import type { Plugin } from "vite";

export default (): Plugin => {
	return {
		name: "vite-plugin-query-nocontent",
		enforce: "pre",

		load(id) {
			if (id.endsWith("?nocontent"))
				return "export { };";
		},
	};
};
