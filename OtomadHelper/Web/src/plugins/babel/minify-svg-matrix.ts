import type babelCore from "@babel/core";

const matrixAttrs = {
	feColorMatrix: ["values"],
	feConvolveMatrix: ["kernelMatrix"],
	feFuncR: ["tableValues"],
	feFuncG: ["tableValues"],
	feFuncB: ["tableValues"],
	feFuncA: ["tableValues"],
};

export default (_babel: typeof babelCore): babelCore.PluginObj | undefined => {
	const dev = process.env.NODE_ENV === "development";

	return {
		name: "babel-plugin-minify-svg-matrix",
		visitor: {
			JSXElement(path) {
				// Skip in development mode.
				if (dev) return;
				// Get the opening element from jsxElement node.
				const openingElement = path.node.openingElement;
				// TagName is name of tag like div, p etc.
				const tagName = (openingElement.name as babelCore.types.JSXIdentifier).name;
				for (const [expectedTagName, expectedAttributes] of Object.entries(matrixAttrs)) {
					if (tagName !== expectedTagName) continue;
					for (const attribute of openingElement.attributes)
						if ("name" in attribute && expectedAttributes.includes(attribute.name.name as string) && attribute.value?.type === "StringLiteral") {
							let value = attribute.value.value;
							value = value.trim().replaceAll(/\s+/g, " ");
							value = value.split(" ").map(n => n.replace(/^0+/, "").replace(/\.0*$/, "") || "0").join(" ");
							attribute.value.value = value;
						}
				}
			},
		},
	};
};
