import { autoColorPalettes } from "helpers/basic-color-palette";
import colors from "./colors";
type AccentPalette = WebMessageEvents.AccentPalette;
const getAutoColor = (prefix: string, color: typeof autoColorPalettes[number] | (string & {})) =>
	autoColorPalettes.includes(color) ? `var(--${prefix}-${color})` : color;

const StyledDynamicAccentColor = createGlobalStyle<{
	$palette?: AccentPalette;
	$customize: {
		accentColor: string;
		backgroundColor: string;
		currentDominantColor?: string;
	};
}>(({ $palette, $customize: { accentColor, backgroundColor, currentDominantColor } }) => [
	css`
		--colorization: #005fb8;
		--accent-color-windows: ${colors["accent-color"][1]};
		--accent-color-vegas: #198cfe;
		--accent-color-wallpaper: var(--image-dominant-color, var(--accent-color-windows));
		--background-color-windows: ${colors["background-color"][1]};
		--background-color-vegas: #222;
		--background-color-wallpaper: var(--image-dominant-color, var(--background-color-windows));

		&[data-scheme~="light"] {
			--accent-color-windows: ${colors["accent-color"][0]};
			--accent-color-vegas: #198cfe;
			--background-color-windows: ${colors["background-color"][0]};
			--background-color-vegas: #eee;
		}
	`,
	$palette && css`
		--colorization: ${$palette.colorization};
		--accent-color: ${$palette.darkAccentColor};
		--accent-color-windows: ${$palette.darkAccentColor};
		--accent-color-vegas: ${$palette.darkAccentColor};

		&[data-scheme~="light"] {
			--accent-color: ${$palette.lightAccentColor};
			--accent-color-windows: ${$palette.lightAccentColor};
			--accent-color-vegas: ${$palette.lightAccentColor};
		}
	`,
	css`
		${currentDominantColor && css`--image-dominant-color: ${currentDominantColor};`}
		${!(accentColor === "windows" || accentColor === "wallpaper" && !currentDominantColor) && css`--colorization: var(--accent-color);`}
		--accent-color: ${getAutoColor("accent-color", accentColor)};
		--background-color: ${getAutoColor("background-color", backgroundColor)};
	`,
	css`
		&[data-scheme~="contrast"] {
			--colorization: transparent;
			--accent-color: Highlight;
			--background-color: Canvas;
		}
	`,
].map((rules, i) => css`
	:root${important(i)},
	[data-scheme]${important(i)} {
		${rules}
	}
`));

export default function DynamicAccentColor() {
	const [palette, setPalette] = useState<AccentPalette>();
	const { accentColor, backgroundColor } = useSnapshot(configStore).settings;
	const { currentDominantColor } = useBackgroundImages();
	const resolveViewTransition = useRef<() => void>(undefined);

	useListen("host:accentPalette", setPalette);

	useListen("app:startColorPaletteViewTransition", async () => {
		if (resolveViewTransition.current) return; // Avoid recursion, or transitions will break.
		forceCursor("wait");
		const { promise, resolve } = Promise.withResolvers<void>();
		resolveViewTransition.current = resolve;
		const restoreTransitions = stopTransition();
		try {
			await startColorViewTransition(() => promise, [[{ opacity: [0, 1] }, { easing: eases.easeOutMax }]]);
		} finally {
			restoreTransitions();
			resolveViewTransition.current = undefined;
			forceCursor(null);
		}
	});

	useEffect(() => resolveViewTransition.current?.());

	return <StyledDynamicAccentColor $palette={palette} $customize={{ accentColor, backgroundColor, currentDominantColor }} />;
}
