type AccentPalette = WebMessageEvents.AccentPalette;

const StyledDynamicAccentColor = createGlobalStyle<{
	$palette?: AccentPalette;
}>(({ $palette }) => $palette && css`
	:root${important()},
	[data-scheme]${important()} {
		--colorization: ${$palette.colorization};
		--accent-color: ${$palette.darkAccentColor};

		&[data-scheme~="light"] {
			--accent-color: ${$palette.lightAccentColor};
		}

		&[data-scheme~="contrast"] {
			--colorization: transparent;
			--accent-color: Highlight;
		}
	}
`);

export default function DynamicAccentColor() {
	const [palette, setPalette] = useState<AccentPalette>();

	useListen("host:accentPalette", setPalette);

	return <StyledDynamicAccentColor $palette={palette} />;
}
