declare module "*.svg?cursor" {
	const cssCursorValue: string;
	export default cssCursorValue;
}

declare module "*.svg?dataset" {
	const dataset: DOMStringMap;
	export default dataset;
}
