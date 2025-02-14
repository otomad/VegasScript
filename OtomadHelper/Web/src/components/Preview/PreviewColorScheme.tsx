import type { ColorScheme } from "helpers/color-mode";

const StyledPreviewColorScheme = styled.div.attrs({
	inert: true,
})`
	position: relative;

	&,
	.container {
		${styles.mixins.square("100%")};
		--padding: 1px;
		display: flex;
		gap: 12px;
		padding: var(--padding);
		background-color: ${c("background-color")};
		zoom: 0.65;
	}

	.container:nth-child(2) {
		${styles.mixins.square("calc(100% - var(--padding) * 2)")};
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
		flex-shrink: 1;
		height: 100%;
	}

	.icon {
		color: ${c("foreground-color")};
	}

	.tab-item {
		${styles.mixins.gridCenter()};
		position: relative;
		padding: 9px 12px;
		color: ${c("foreground-color")};
		border-radius: 4px;

		&.disabled {
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
		background-color: ${cc("Highlight")};

		&,
		.icon {
			color: ${cc("HighlightText")};
		}

		&::before {
			background-color: ${cc("HighlightText")};
		}
	}

	.main {
		${styles.mixins.square("100%")};
		display: flex;
		flex-direction: column;
		padding-block-end: 9px;
		padding-inline-end: 12px;

		@layer base {
			> * {
				flex-shrink: 0;
			}
		}
	}

	.text {
		--font-size: 12px;
		block-size: var(--font-size);
		inline-size: 100%;
		background-color: ${c("foreground-color")};
		border-radius: 4px;

		&.heading {
			margin-block: calc((45px - var(--font-size)) / 2);
			inline-size: 4em;
		}
	}

	.page-control {
		display: flex;
		gap: 16px;
		margin-block: 8px 10px;

		.icon {
			font-size: 40px;
		}

		.texts {
			display: flex;
			flex-direction: column;
			gap: 8px;
			margin-block: 2px;
			inline-size: 100%;
		}

		.text {
			block-size: 100%;
			background-color: ${c("fill-color-text-secondary")};

			${[84, 100, 100, 100, 42].map((percent, index) => css`
				&:nth-child(${index + 1}) {
					width: ${percent}%;
				}
			`)}
		}

		.card {
			${styles.mixins.square("64px")};
			${styles.mixins.gridCenter()};
			flex-shrink: 0;
		}
	}

	.card {
		background-color: ${c("background-fill-color-card-background-default")};
		border: 1px solid ${c("stroke-color-card-stroke-default")};
		border-radius: 4px;

		&.settings-card {
			margin-block-start: 6px;
			block-size: 35px;
			inline-size: 100%;
		}
	}

	.command-bar {
		display: flex;
		gap: 5px;
		justify-content: flex-end;
	}

	.button {
		block-size: 24px;
		inline-size: 50px;
		background-color: ${c("background-fill-color-card-background-default")};
		border: 1px solid ${c("stroke-color-control-stroke-default")};
		border-radius: 4px;

		&.accent {
			background-color: ${c("accent-color")};
			border-color: ${c("stroke-color-control-stroke-on-accent-default")};
		}
	}

	.container${ifColorScheme.light} .button {
		border-block-end-color: ${c("stroke-color-control-stroke-secondary-on-default")};

		&.accent {
			background-color: ${c("accent-color")};
			border-block-end-color: ${c("stroke-color-control-stroke-on-accent-secondary")};
		}
	}

	.container${ifColorScheme.dark} .button {
		border-block-start-color: ${c("stroke-color-control-stroke-secondary-on-default")};

		&.accent {
			background-color: ${c("accent-color")};
			border-block-start-color: ${c("stroke-color-control-stroke-on-accent-secondary")};
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
	const icon = ({
		light: "sun",
		dark: "moon",
		black: "star",
		contrast: "contrast",
		auto: "desktop",
	} satisfies Record<ColorSchemeEx, DeclaredIcons>)[value];

	return (
		<StyledPreviewColorScheme>
			{value === "auto" ? (
				<>
					<PreviewColorSchemeContent scheme="light" icon={icon} />
					<PreviewColorSchemeContent scheme={amoledDark ? "dark black" : "dark"} icon={icon} />
				</>
			) : <PreviewColorSchemeContent scheme={scheme} icon={icon} />}
		</StyledPreviewColorScheme>
	);
}

function PreviewColorSchemeContent({ scheme, icon }: {
	scheme: string;
	icon: DeclaredIcons;
}) {
	return (
		<div className="container" data-scheme={scheme} inert>
			<div className="tab-bar">
				{(["back", "global_nav_button", "home", "placeholder", "placeholder", "", "settings"] as DeclaredIcons[]).map((icon, index) =>
					!icon ? <div key={index} className="vertical-spring" /> :
					<div className={["tab-item", { disabled: icon === "back", selected: icon === "home" }]} key={index}><Icon name={icon} /></div>)}
			</div>
			<div className="main">
				<div className="text heading" />
				<div className="page-control">
					<div className="card">
						<Icon name={icon} />
					</div>
					<div className="texts">
						{forMap(5, i => <div className="text" key={i} />)}
					</div>
				</div>
				{forMap(2, i => <div className="card settings-card" key={i} />)}
				<div className="vertical-spring" />
				<div className="command-bar">
					<div className="button accent" />
					<div className="button" />
				</div>
			</div>
		</div>
	);
}
