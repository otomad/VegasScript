const Links = {
	otomadHelper: {
		documentation: fallbackWithLocale({
			en: "https://otomadhelper.readthedocs.io/",
			"zh-CN": "https://otomadhelper.readthedocs.io/zh-cn",
		}),
		repository: "https://github.com/otomad/OtomadHelper",
		changelog: "https://github.com/otomad/OtomadHelper/releases",
		issues: "https://github.com/otomad/OtomadHelper/issues",
	},
	api: {
		versionTagGitHubApi: "https://api.github.com/repos/otomad/OtomadHelper/releases/latest",
		versionTagGitHubRaw: "https://raw.githubusercontent.com/otomad/OtomadHelper/webview2/version.txt",
	},
	crowdin: {
		contributeTranslation: fallbackWithLocale({
			en: "https://crowdin.com/project/otomadhelper",
			"zh-CN": "https://zh.crowdin.com/project/otomadhelper",
			ja: "https://ja.crowdin.com/project/otomadhelper",
		}),
	},
	gpl3: "https://www.gnu.org/licenses/gpl-3.0.html",
	react: "https://github.com/facebook/react",
};

export default Links;
