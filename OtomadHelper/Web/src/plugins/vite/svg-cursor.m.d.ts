declare module "*.svg?cursor" {
	const cssCursorValue: (props: { theme: import("styled-components").DefaultTheme }) => `url("${string}")`;
	export default cssCursorValue;
}

declare module "*.svg?dataset" {
	const dataset: DOMStringMap;
	export default dataset;
}
