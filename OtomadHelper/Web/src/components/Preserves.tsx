type RTFs = (string | JSX.Element)[];

function replaceLfToBr(longText: string | string[], spacing?: string | boolean) {
	longText = wrapIfNotArray(longText);
	return longText.flatMap(text => text
		.replaceAll(/\r\n|\n\r|\r/g, "\n")
		.split("\n")
		.interpose(i => <Br key={i} spacing={spacing} />)
		.filter(line => typeof line === "string" ? line.trim() : true));
}

function replaceAsteriskToEm(longText: string | RTFs) {
	longText = wrapIfNotArray(longText);
	const ASTERISK_REPLACEMENT = "\u{e002a}";
	return longText.flatMap(text => typeof text !== "string" || !text.includes("*") ? text : text
		.replaceAll(/\*{2,}/g, i => ASTERISK_REPLACEMENT.repeat(i.length - 1))
		.split("*")
		.map((segment, i) => i % 2 ? <em key={i}>{segment}</em> : segment)
		.filter(line => typeof line === "string" ? line.trim() : true));
}

/**
 * Automatically convert `\n` in the passed string to `<br />` to preserve line breaks.
 */
export default function Preserves({ spacing, autoItalic = true, children }: FCP<{
	/**
	 * Paragraph spacing, or height of `<br>`. CSS `<length>` type. Defaults to `0`.\
	 * If you pass `true`, it will be `0.5em`.
	 */
	spacing?: string | boolean;
	/** Allows auto convert text enclosed by asterisk to italic (`*italic*`)? Defaults to true. */
	autoItalic?: boolean;
}>): ReactNode {
	return React.Children.map(children, child => {
		if (typeof child === "string" || isI18nItem(child)) {
			let result = replaceLfToBr(child.toString(), spacing);
			if (autoItalic) result = replaceAsteriskToEm(result);
			return result;
		} else return child;
	});
}

const SpacingBr = styled.br<{
	/** Paragraph spacing, or height of `<br>`. */
	$spacing?: string;
}>`
	content: "";
	display: block;
	margin-block-start: ${styledProp("$spacing", "0.5em")};
`;

export function Br({ repeat = 1, spacing, ...htmlAttrs }: FCP<{
	/** Repeat times. Defaults to 1. */
	repeat?: number;
	/**
	 * Paragraph spacing, or height of `<br>`. CSS `<length>` type. Defaults to `0`.\
	 * If you pass `true`, it will be `0.5em`.
	 */
	spacing?: string | boolean;
	children?: never;
}, "br">) {
	const BrTag = spacing ? SpacingBr : "br";
	return forMap(repeat, i =>
		<BrTag key={i} $spacing={typeof spacing === "string" ? spacing : undefined} {...htmlAttrs} />);
}
