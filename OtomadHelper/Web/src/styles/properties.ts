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
	name: "--grid-template-width",
	syntax: "<length>",
	inherits: true,
	initialValue: "200px",
});

/**
 * Grid template item count.
 */
CSS.registerProperty({
	name: "--grid-template-count",
	syntax: "<integer>",
	inherits: true,
	initialValue: "1",
});

/**
 * Preview waveform scale.
 */
CSS.registerProperty({
	name: "--preview-waveform-scale",
	syntax: "<number>",
	inherits: true,
	initialValue: "1",
});

/**
 * The transparency (not opacity) of the gradient mask at the start of the scrolling area.
 */
CSS.registerProperty({
	name: "--scroll-start-mask-transparency",
	syntax: "<number> | <percentage>",
	inherits: true,
	initialValue: "1",
});

/**
 * The transparency (not opacity) of the gradient mask at the end of the scrolling area.
 */
CSS.registerProperty({
	name: "--scroll-end-mask-transparency",
	syntax: "<number> | <percentage>",
	inherits: true,
	initialValue: "1",
});

/**
 * Sortable overlay scale.
 */
CSS.registerProperty({
	name: "--sortable-overlay-scale",
	syntax: "<number>",
	inherits: true,
	initialValue: "1",
});
