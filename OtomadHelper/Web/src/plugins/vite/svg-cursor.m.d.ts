declare module "*.svg?cursor" {
	const cssCursorValue: `url("${string}")`;
	export default cssCursorValue;
}

declare module "*.svg?dataset" {
	const dataset: DOMStringMap;
	export default dataset;
}
