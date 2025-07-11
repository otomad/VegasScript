import { IN_CONTEXT_LANGUAGE_CODE } from "helpers/jipt-activator";
import type { TOptions as _TOptions } from "i18next";
import type { AvailableLanguageTags } from "locales/all";
import type { LocaleWithDefaultValue } from "locales/types";
const I18N_ITEM_SYMBOL = Symbol.for("react-i18next.i18n_item");
const toPrimitives = [Symbol.toPrimitive, "toString", "toJSON", "valueOf"];
interface AdditionalOptions {
	format: string | string[];
}
type TOptions = _TOptions & Partial<AdditionalOptions>;

export function isI18nItem(newChild: Any): newChild is Record<string, string> {
	return !!newChild?.[I18N_ITEM_SYMBOL];
}

const getProxy = (target: object, fallbackMode: boolean = false) => {
	const getParentsPrefix = (...prefixes: string[]) => prefixes.length > 0 ? prefixes.join(".") : "";
	const getDeclarationInfo = (...keys: string[]) => {
		const key = getParentsPrefix(...keys);
		const raw = i18n.getResource("en", "javascript", key) as string | object;
		return {
			isCategory: typeof raw === "object",
			includesInterpolation: typeof raw === "string" && raw.includes("{{"),
			missing: raw === undefined,
			missingDefault: typeof raw === "object" && !("_" in raw),
			isStringMethod: keys.last() in String.prototype,
			key,
			raw,
		};
	};
	const has = (keys: string[], currentName: string) => !getDeclarationInfo(...keys, currentName).missing;
	const sharedProxyHandler = (keys: string[] = []): ProxyHandler<Any> => ({
		has(target, currentName) {
			if (typeof currentName === "symbol")
				return currentName in target;
			return has(keys, currentName);
		},
		ownKeys() {
			const { raw } = getDeclarationInfo(...keys);
			return isObject(raw) ? Reflect.ownKeys(raw) : [];
		},
		getOwnPropertyDescriptor(target, currentName) {
			if (typeof currentName === "string" && has(keys, currentName))
				return { enumerable: true, configurable: true };
		},
	});
	return new Proxy(target, {
		get(target, rootName) {
			if (typeof rootName === "symbol")
				if (rootName === I18N_ITEM_SYMBOL) return true;
				else return;
			if (typeof target === "function") target = {};
			const getMissingKey = (key: string) => {
				if (fallbackMode) return undefined;
				const displayValue = `<${key}>`;
				console.error("Missing translation key: " + key);
				return displayValue;
			};
			const translate = (keys: string[], options?: TOptions) => {
				const { isCategory, missingDefault } = getDeclarationInfo(...keys);
				if (missingDefault) return getMissingKey(getParentsPrefix(...keys));
				const formatters = [
					...target?.format ? wrapIfNotArray(target.format) : [],
					...options?.format ? wrapIfNotArray(options.format) : [],
				];
				const key = !isCategory ? getParentsPrefix(...keys) : getParentsPrefix(...keys, "_");
				let result = i18n.t(key, { ...target, ...options }) as string;
				if (formatters.length > 0) {
					const sep: string = options?.interpolation?.formatSeparator ?? target?.interpolation?.formatSeparator ?? ",";
					result = i18n.format(result, formatters.join(sep), options?.lng);
				}
				return result;
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
					const lastKey = keys.last();
					if (lastKey === "name")
						return translate(keys.toPopped());
					if (info.isStringMethod)
						return translate(keys.toPopped())?.toString()?.[lastKey as "toUpperCase"];
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
					...sharedProxyHandler(keys),
				});
			};
			return getWithArgsProxy();
		},
		...sharedProxyHandler(),
	}) as LocaleDictionary;
};
type LocaleDictionary = LocaleWithDefaultValue;
const targetFunction = (options?: number | bigint | TOptions) => {
	if (options === undefined) options = {};
	else if (typeof options === "number" || typeof options === "bigint") options = { count: Number(options) };
	return getProxy(options);
};
/** Get localize string objects. */
export const t = getProxy(targetFunction) as Trans;
export const tf = getProxy(targetFunction, true) as Trans;
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
	return panguSpacing(result);
}

/**
 * Get all language tags.
 * @returns All language tags.
 */
export function useLanguageTags({ omitInContextLanguage = true }: {
	/** Omit in-context language? @default true */
	omitInContextLanguage?: boolean;
} = {}) {
	const { i18n } = useTranslation();
	const languages = Object.keys(i18n.options.resources ?? {});
	if (omitInContextLanguage)
		languages.removeItem(IN_CONTEXT_LANGUAGE_CODE);
	return languages as AvailableLanguageTags[];
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

	return language as AvailableLanguageTags;
}

/**
 * Validates and normalizes a given locale identifier.
 *
 * This function checks if the input is a valid BCP 47 locale identifier or `Intl.Locale` object.
 * It first attempts to construct an `Intl.Locale` instance from the input string, returning `null`
 * if the construction fails (i.e., due to incorrect format).
 *
 * Then, it compares the maximized and minimized forms of the locale. If both forms are equal,
 * it indicates that the locale does not correspond to a real-world locale, and the function returns `null`.
 * Otherwise, the locale is considered valid and existing.
 *
 * @param locale - The locale identifier as a string or an `Intl.Locale` object.
 * @returns The valid `Intl.Locale` object if the locale is valid and exists, otherwise `null`.
 */
export function getValidLocale(locale: Intl.UnicodeBCP47LocaleIdentifier | Intl.Locale) {
	if (typeof locale === "string")
		try {
			// If error "Incorrect locale information provided" is raised when constructing the `Intl.Locale` object,
			// the provided locale is considered invalid.
			// For example, `locale` is "a" or "abcd", because the language identifier can only be two to three letters.
			// But at this point it means that locale does not match the format of locale identifier.
			// However, even if a locale identifier that does not exist at all will be passed here.
			// For example, `locale` is "cc-cccc-cc", which is valid, but there is no such locale in the real world.
			locale = new Intl.Locale(locale);
		} catch {
			return null;
		}
	if (locale.maximize().toString() === locale.minimize().toString())
		// By maximizing and minimizing the locale, if its maximized value is equal to its minimized value,
		// the locale is considered not to exist in the real world at all.
		// At this point, no matter it is "oo", "cc-cccc-cc", etc., invalid locale can be found.
		return null;
	return locale;
}

/**
 * Determines whether the provided locale identifier is valid and exists in the real world.
 *
 * This function checks if the input is a valid BCP 47 locale identifier or `Intl.Locale` object.
 * It first attempts to construct an `Intl.Locale` instance from the input string, returning `false`
 * if the construction fails (i.e., due to incorrect format).
 *
 * Then, it compares the maximized and minimized forms of the locale. If both forms are equal,
 * it indicates that the locale does not correspond to a real-world locale, and the function returns `false`.
 * Otherwise, the locale is considered valid and existing.
 *
 * @param locale - The locale identifier as a string or `Intl.Locale` object.
 * @returns `true` if the locale is valid and exists; otherwise, `false`.
 */
export function isValidLocale(locale: Intl.UnicodeBCP47LocaleIdentifier | Intl.Locale) {
	return getValidLocale(locale) != null;
}

/**
 * Check if the provided language is English? Whether it is American English, British English, or something else.
 * @param lang - Language tag string or Intl.Locale object.
 * @returns The provided language is English?
 */
export function isEnglish(lang: Intl.UnicodeBCP47LocaleIdentifier | Intl.Locale) {
	return getValidLocale(lang)?.language === "en";
}

/**
 * Get the name of the target language in the current display language.
 * @param targetLocale - Target language.
 * @param displayLocale - Current display language. ~~It will be automatically gotten when it is not provided.~~
 * @returns The name of the target language.
 * @example
 * ```typescript
 * console.log(getLocaleName("en", "zh")); // "英语"
 * console.log(getLocaleName("zh", "en")); // "Chinese"
 * ```
 */
export function getLocaleName(targetLocale: string | Intl.Locale, displayLocale: string | Intl.Locale) {
	if (targetLocale instanceof Intl.Locale) targetLocale = targetLocale.toString();
	if (displayLocale instanceof Intl.Locale) displayLocale = displayLocale.toString();
	targetLocale = targetLocale === "zh-CN" ? "zh-Hans" : targetLocale === "zh-TW" ? "zh-Hant" : targetLocale;
	const fallbackLocales = [displayLocale];
	// if (displayLocale === "yue") fallbackLocales.push("zh-Hant-HK");
	return new Intl.DisplayNames(fallbackLocales, { type: "language" }).of(targetLocale)!;
}
