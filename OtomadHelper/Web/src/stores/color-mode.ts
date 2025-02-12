import type { ColorScheme } from "helpers/color-mode";

export const colorModeStore = createPersistStore("colorMode", {
	scheme: "auto" as ColorScheme,
	amoledDark: false,
	contrast: false,
	backgroundColor: "#202020",
});
