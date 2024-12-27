import type { LocaleWithDefaultValue } from "locales/types";

const tagStart = String.fromCodePoint(0xe0000), tagCancel = String.fromCodePoint(0xe007f);

export default function TransInterpolation<TInterpolations>({ i18nKey, children: _children, ..._interpolations }: WithOtherProperties<{
	i18nKey(trans: LocaleWithDefaultValue): string;
	children?: never;
}, ReactNode, TInterpolations>) {
	const interpolations = _interpolations as Record<string, ReactNode>;
	const keys = Object.keys(interpolations);
	const internalInterpolations = keys.mapObject((key, index) => [key, encodeKeyToTag(index)] as const);
	const withInterpolations = t(internalInterpolations);
	const translatedString = i18nKey(withInterpolations).toString();
	const lines = translatedString.split("\n");
	const splitted = lines
		.map(line => line
			.split(new RegExp(`(${tagStart}.*${tagCancel})`, "u"))
			.map(segment => {
				if (!segment.startsWith(tagStart)) return segment;
				const index = decodeKeyFromTag(segment);
				if (index == null) return "";
				const key = keys[index];
				return interpolations[key];
			}),
		);
	return splitted;
}

function encodeKeyToTag(key: number) {
	return tagStart + Array.from(key.toString(), char => String.fromCodePoint(char.codePointAt(0)! + 0xe0000)).join("") + tagCancel;
}

function decodeKeyFromTag(tag: string) {
	const matched = tag.match(new RegExp(`${tagStart}(.*)${tagCancel}`, "u"))?.[1];
	if (matched == null) return null;
	return parseInt(Array.from(matched, char => String.fromCodePoint(char.codePointAt(0)! - 0xe0000)).join(""), 10);
}
