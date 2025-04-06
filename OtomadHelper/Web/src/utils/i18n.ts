import type { TOptions } from "i18next";
import type { LocaleWithDefaultValue } from "locales/types";
import { spacing } from "pangu";
const I18N_ITEM_SYMBOL = Symbol.for("i18n_item");
const toPrimitives = [Symbol.toPrimitive, "toString", "toJSON", "valueOf"];

export function isI18nItem(newChild: Any): newChild is Record<string, string> {
	return !!newChild?.[I18N_ITEM_SYMBOL];
}

const getProxy = (target: object, fallbackMode: boolean = false) =>
	new Proxy(target, {
		get(target, rootName) {
			if (typeof rootName === "symbol") return;
			if (typeof target === "function") target = {};
			const getParentsPrefix = (...prefixes: string[]) => prefixes.length > 0 ? prefixes.join(".") : "";
			const getDeclarationInfo = (...keys: string[]) => {
				const key = getParentsPrefix(...keys);
				const raw = i18n.getResource("en", "javascript", key) as string | object;
				return {
					isCategory: typeof raw === "object",
					includesInterpolation: typeof raw === "string" && raw.includes("{{"),
					missing: raw === undefined,
					missingDefault: typeof raw === "object" && !("_" in raw),
					key,
					raw,
				};
			};
			const getMissingKey = (key: string) => {
				if (fallbackMode) return undefined;
				const displayValue = `<${key}>`;
				console.error("Missing translation key: " + key);
				return displayValue;
			};
			const translate = (keys: string[], options?: TOptions) => {
				const { isCategory, missingDefault } = getDeclarationInfo(...keys);
				if (missingDefault) return getMissingKey(getParentsPrefix(...keys));
				const key = !isCategory ? getParentsPrefix(...keys) : getParentsPrefix(...keys, "_");
				return i18n.t(key, { ...target, ...options });
				// NOTE: If directly return a string, when user switches language, some local variables which store the i18n items will not update the language.
			};
			const getWithArgsFunction = (...prefixes: string[]) => {
				const func = (options: TOptions) => translate(prefixes, options);
				func[I18N_ITEM_SYMBOL] = true;
				return func;
			};
			const getWithArgsProxy = (...parents: string[]) => {
				const keys = [rootName, ...parents];
				const info = getDeclarationInfo(...keys);
				if (info.missing) {
					if (keys.at(-1) === "name")
						return translate(keys.toPopped());
					return getMissingKey(info.key);
					// eslint-disable-next-line @stylistic/brace-style
				}
				// else if (!info.includesInterpolation && !info.isCategory)
				// 	return translate(keys);
				else return new Proxy(getWithArgsFunction(...keys), {
					get(target, currentName): unknown {
						if (toPrimitives.includes(currentName))
							return () => translate(keys);
						if (currentName === Symbol.toStringTag)
							return "String";
						if (typeof currentName === "string")
							return getWithArgsProxy(...parents, currentName);
						if (typeof currentName === "symbol")
							return target[currentName as typeof I18N_ITEM_SYMBOL];
					},
				});
			};
			return getWithArgsProxy();
		},
	}) as LocaleDictionary;
type LocaleDictionary = LocaleWithDefaultValue;
const targetFunction = (options?: number | bigint | TOptions) => {
	if (options === undefined) options = {};
	else if (typeof options === "number" || typeof options === "bigint") options = { count: Number(options) };
	return getProxy(options);
};
/** Get localize string objects. */
export const t = getProxy(targetFunction) as Trans;
export const tf = getProxy(targetFunction, true) as Trans;
Object.freeze(t);
Object.freeze(tf);
type Trans = LocaleDictionary & typeof targetFunction;

/**
 * Check if the current page is written from right to left (such as in Arabic) rather than from left to right (such as in English).
 * @param container - Specify the container. Defaults to `<html>`.
 * @returns Is the horizontal writing direction of the current page written from right to left?
 */
export function isRtl(container?: Element | null) {
	container ??= document.documentElement;
	return getComputedStyle(container).direction === "rtl";
}

/**
 * Swaps the "ArrowLeft" and "ArrowRight" key codes if the current layout is right-to-left (RTL).
 *
 * @template T - A string type representing the key code.
 * @param code - The key code to potentially swap.
 * @returns The original key code if the layout is not RTL, or the swapped key code if the layout is RTL.
 */
export function swapArrowLeftRightIfRtl<T extends string>(code: T) {
	return !isRtl() ? code : (code === "ArrowLeft" ? "ArrowRight" : code === "ArrowRight" ? "ArrowLeft" : code) as T;
}

/**
 * Returns a string with a language-specific representation of the list.
 * @param list - An iterable object, such as an Array.
 * @param type - The format of output message.
 * @param style - The length of the internationalized message.
 * @returns A language-specific formatted string representing the elements of the list.
 */
export function listFormat(list: string[], type?: Intl.ListFormatType, style?: Intl.ListFormatStyle) {
	const formatter = new Intl.ListFormat(i18n.language, { type, style });
	const result = formatter.format(list);
	return spacing(result);
}

/**
 * Get all language tags.
 * @returns All language tags.
 */
export function useLanguageTags() {
	const { i18n } = useTranslation();
	const languages = Object.keys(i18n.options.resources ?? {});
	return languages;
}

/**
 * Get reactive current language.
 * @returns Reactive current language.
 */
export function useCurrentLanguage() {
	const { i18n } = useTranslation();
	const [language, setLanguage] = useState(i18n.language);

	useMountEffect(() => {
		const onLanguageChanged = (lang: string) => setLanguage(lang);
		i18n.on("languageChanged", onLanguageChanged);
		return () => i18n.off("languageChanged", onLanguageChanged);
	});

	return language;
}

/**
 * Check if the provided language is English? Whether it is American English, British English, or something else.
 * @param lang - Language tag string or Intl.Locale object.
 * @returns The provided language is English?
 */
export function isEnglish(lang: string | Intl.Locale) {
	if (typeof lang === "string")
		try {
			lang = new Intl.Locale(lang);
		} catch {
			return false;
		}
	lang = lang.maximize();
	return lang.language === "en";
}
