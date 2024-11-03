/**
 * The box shadow length on the outer edge of the focus ring individually controlled by the transition timing function.
 */
CSS.registerProperty({
	name: "--focus-ring-length-outer",
	syntax: "<length>",
	inherits: false,
	initialValue: "0",
});

/**
 * The box shadow length on the inner edge of the focus ring individually controlled by the transition timing function.
 */
CSS.registerProperty({
	name: "--focus-ring-length-inner",
	syntax: "<length>",
	inherits: false,
	initialValue: "0",
});

/**
 * Items View Item (Grid) width.
 */
CSS.registerProperty({
	name: "--grid-view-item-width",
	syntax: "<length>",
	inherits: true,
	initialValue: "200px",
});
