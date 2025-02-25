const availableLanguages: Record<string, string> = {
	"zh-CN": "zh",
	ja: "ja",
};

export const contributeTranslationLink = new Proxy(availableLanguages, {
	get(tags, language) {
		if (typeof language === "symbol") return;
		const protocol = "https://";
		let tag = tags[language];
		if (!tag)
			try {
				const locale = new Intl.Locale(language).minimize();
				tag = tags[locale.baseName];
			} catch { }
		let url = "crowdin.com/project/otomadhelper";
		if (tag) url = tag + "." + url;
		return protocol + url;
	},
});
