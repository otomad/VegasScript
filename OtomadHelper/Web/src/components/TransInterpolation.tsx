import type { LocaleWithDefaultValue } from "locales/types";

const tagStart = String.fromCodePoint(0xe0000), tagCancel = String.fromCodePoint(0xe007f);

type KnownProps = {
	i18nKey(trans: LocaleWithDefaultValue): string;
	children?: never;
};

export default function TransInterpolation({ i18nKey, children: _children, ..._interpolations }: {
	i18nKey(trans: LocaleWithDefaultValue): string;
	children?: never;
} & Record<string, ReactNode | ValueOf<KnownProps>>) {
	const interpolations = _interpolations as Record<string, ReactNode>;
	const keys = Object.keys(interpolations);
	const internalInterpolations = keys.mapObject((key, index) => [key, encodeKeyToTag(index)] as const);
	const withInterpolations = t(internalInterpolations);
	const translatedString = i18nKey(withInterpolations).toString();
	const splitted = translatedString
		.split(new RegExp(`(${tagStart}.*${tagCancel})`, "u"))
		.map(segment => {
			if (!segment.startsWith(tagStart)) return segment;
			const index = decodeKeyFromTag(segment);
			if (index == null) return "";
			const key = keys[index];
			return interpolations[key];
		});
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
