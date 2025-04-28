/* eslint-disable import/order */
import en from "./English";
import zhCN from "./Chinese Simplified";
import ja from "./Japanese";
import vi from "./Vietnamese";
import ii from "./Sichuan Yi";

const allLanguages = {
	en,
	"zh-CN": zhCN,
	ja,
	vi,
	ii,
};

export default allLanguages;

export type AvailableLanguageTags = keyof typeof allLanguages;
