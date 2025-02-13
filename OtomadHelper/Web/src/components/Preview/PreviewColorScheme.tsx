import type { ColorScheme } from "helpers/color-mode";

const StyledPreviewColorScheme = styled.div.attrs({
	inert: true,
})`
	position: relative;

	&,
	.container {
		${styles.mixins.square("100%")};
		display: flex;
		gap: 12px;
		padding: 1px;
		background-color: ${c("background-color")};
		zoom: 0.65;
	}

	.container:nth-child(2) {
		position: absolute;
		clip-path: polygon(30% 100%, 100% 100%, 100% 0%, 70% 0%);
	}

	.tab-bar {
		display: flex;
		flex-direction: column;
		gap: 1.5px;
		margin: 4px 5px;
	}

	.vertical-spring {
		height: 100%;
	}

	.tab-item {
		${styles.mixins.gridCenter()};
		position: relative;
		padding: 9px 12px;
		color: ${c("foreground-color")};
		border-radius: 4px;

		&.disabled {
			color: ${c("foreground-color")};
			opacity: ${c("disabled-text-opacity")};
		}

		&.selected {
			background-color: ${c("fill-color-subtle-secondary")};

			&::before {
				${styles.mixins.oval()}
				content: "";
				position: absolute;
				inset-inline-start: 0;
				block-size: 20px;
				inline-size: 3px;
				background-color: ${c("accent-color")};
			}
		}
	}

	.container${ifColorScheme.contrast} .tab-item.selected {
		color: ${cc("HighlightText")};
		background-color: ${cc("Highlight")};

		&::before {
			background-color: ${cc("HighlightText")};
		}
	}

	.main {
		${styles.mixins.square("100%")};
	}

	.text {
		--font-size: 12px;
		block-size: var(--font-size);
		inline-size: 100%;
		border-radius: 4px;

		&.heading {
			margin-block: calc((42px - var(--font-size)) / 2);
			inline-size: 4em;
			background-color: ${c("foreground-color")};
		}
	}
`;

type ColorSchemeEx = ColorScheme | "black" | "contrast";

export default function PreviewColorScheme({ colorScheme: value }: FCP<{
	/** Color scheme. */
	colorScheme: ColorSchemeEx;
	children?: never;
}>) {
	const { amoledDark } = useSnapshot(colorModeStore);
	const scheme = value === "black" ? "dark black" : value;

	return (
		<StyledPreviewColorScheme>
			{value === "auto" ? (
				<>
					<PreviewColorSchemeContent scheme="light" />
					<PreviewColorSchemeContent scheme={amoledDark ? "dark black" : "dark"} />
				</>
			) : <PreviewColorSchemeContent scheme={scheme} />}
		</StyledPreviewColorScheme>
	);
}

function PreviewColorSchemeContent({ scheme }: { scheme: string }) {
	return (
		<div className="container" data-scheme={scheme} inert>
			<div className="tab-bar">
				{(["back", "global_nav_button", "home", "placeholder", "placeholder", "", "settings"] as DeclaredIcons[]).map((icon, index) =>
					!icon ? <div key={index} className="vertical-spring" /> :
					<div className={["tab-item", { disabled: icon === "back", selected: icon === "home" }]} key={index}><Icon name={icon} /></div>)}
			</div>
			<div className="main">
				<div className="text heading" />
			</div>
		</div>
	);
}
