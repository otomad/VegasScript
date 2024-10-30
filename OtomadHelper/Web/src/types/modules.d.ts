// cursors
declare module "*.cur" {
	const src: string;
	export default src;
}
declare module "*.ani" {
	const src: string;
	export default src;
}
declare module "*.svg?cursor" {
	const cssCursorValue: string;
	export default cssCursorValue;
}
declare module "*.svg?dataset" {
	const dataset: DOMStringMap;
	export default dataset;
}
