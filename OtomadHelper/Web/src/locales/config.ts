import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import type { AvailableLanguageTags } from "./all";
import allLanguages from "./all";
import formatInterpolation from "./utils/interpolations";
import { fullwidthQuotesProcessor, panguProcessor } from "./utils/processors";

i18n
	// Detect the language user used currently
	// Docs: https://github.com/i18next/i18next-browser-languageDetector
	.use(LanguageDetector)
	// Inject react-i18next instance
	.use(initReactI18next)
	// Pangu plugin, insert spaces between East-asian word and Western word
	.use(panguProcessor)
	// Add fullwidth quotation marks Unicode Standardized Variation Sequence (SVS)
	.use(fullwidthQuotesProcessor)
	// Initial i18next
	// Docs: https://www.i18next.com/overview/configuration-options
	.init({
		debug: import.meta.env.DEV,
		ns: ["javascript"],
		defaultNS: "javascript",
		fallbackLng: "en",
		interpolation: {
			escapeValue: false,
			format: formatInterpolation,
		},
		postProcess: [
			// Fullwidth quotes should run before pangu, otherwise it won't work.
			fullwidthQuotesProcessor.name,
			panguProcessor.name,
		],
		resources: allLanguages,
		detection: {
			// htmlTag: document.documentElement,
		},
	});

document.documentElement.lang = i18n.language;
document.dir = i18n.dir();

function useLanguageGetter() {
	const [language, setLanguage] = useState(i18n.language);
	i18n.on("languageChanged", language => setLanguage(language));
	return language as AvailableLanguageTags;
}

export function useLanguage() {
	const language = useLanguageGetter();

	function changeLanguage(lng: AvailableLanguageTags) {
		if (i18n.language === lng && document.documentElement.lang === lng)
			return;
		bridges.bridge.setCulture(i18n.t("metadata.culture", { lng }));
		startColorViewTransition(async () => {
			await i18n.changeLanguage(lng);
			const dir = i18n.dir();
			document.documentElement.lang = lng;
			document.dir = dir;
			devStore.rtl = dir === "rtl";
		}, [
			[{
				clipPath: ["inset(0 0 100%)", "inset(0)"],
			}, {
				duration: 500,
			}],
		], "wait");
	}

	return [language, changeLanguage] as StatePropertyNonNull<AvailableLanguageTags>;
}

export default i18n;
