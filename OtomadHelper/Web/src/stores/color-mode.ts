import type { ColorScheme } from "helpers/color-mode";

export const colorModeStore = createPersistStore("colorMode", {
	scheme: "auto" as ColorScheme,
	amoledDark: false,
	contrast: false,
	backgroundColor: "#202020",

	useSchemes() {
		const { scheme, amoledDark, contrast } = useSnapshot(colorModeStore);
		const schemes = contrast ? "contrast" :
			amoledDark ?
				scheme === "auto" ? "auto-black" :
				scheme === "dark" ? "black" :
				scheme :
				scheme;
		const setSchemes = (value: typeof schemes) => {
			colorModeStore.contrast = value === "contrast";
			colorModeStore.amoledDark = value.includes("black");
			if (value.includes("auto")) colorModeStore.scheme = "auto";
			if (value.includes("black") || value.includes("dark")) colorModeStore.scheme = "dark";
			if (value === "light") colorModeStore.scheme = "light";
		};
		return [schemes, setSchemes] as const;
	},
});
