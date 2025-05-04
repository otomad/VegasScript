import type { ColorScheme } from "helpers/color-mode";

const TAB_ITEM_COUNT = 6;
const TAB_ITEM_RADIUS = 66;

const StyledPreviewColorScheme = styled.div.attrs({
	inert: true,
})`
	position: relative;

	&,
	.container {
		${styles.mixins.square("100%")};
		--padding: 1px;
		position: relative;
		display: flex;
		gap: 12px;
		padding: var(--padding);
		overflow: clip;
		background-color: ${c("background-color")};
		border-radius: 6px;
		zoom: 0.75;
	}

	.container:nth-child(2) {
		${styles.mixins.square("calc(100% - var(--padding) * 2)")};
		position: absolute;
		clip-path: polygon(33.333% 100%, 100% 100%, 100% 0%, 66.667% 0%);
	}

	.icon {
		color: ${c("foreground-color")};
	}

	.color-scheme-button {
		${styles.mixins.square("36px")};
		${styles.mixins.circle()};
		${styles.mixins.absoluteCenter()};
		padding-block-start: 6px;
		scale: 1.75;
	}

	.circular > * {
		${styles.mixins.absoluteCenter(undefined, false)};

		${forMap(TAB_ITEM_COUNT, i => css`
			&:nth-child(${i + 1}) {
				translate:
					calc(cos(${i} / ${TAB_ITEM_COUNT} * 1turn) * ${-TAB_ITEM_RADIUS}px)
					calc(sin(${i} / ${TAB_ITEM_COUNT} * 1turn) * ${-TAB_ITEM_RADIUS}px);
			}
		`)}
	}

	.tab-item {
		${styles.mixins.gridCenter()};
		/* position: relative; */
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

	.card > .base {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.toggle-switch-label {
		min-height: unset;
		padding: 0;

		.right {
			margin-inline-start: unset;
		}
	}

	.corner > * {
		position: absolute;

		&:nth-child(1) {
			bottom: -1px;
			left: -32%;
		}

		&:nth-child(2) {
			right: -36%;
			bottom: -4px;
		}

		&:nth-child(3) {
			top: -2px;
			right: -36%;

			& > .base {
				gap: 10px;
			}
		}

		&:nth-child(4) {
			top: -4px;
			left: -3px;
			inline-size: 90px;

			& > .base {
				gap: 7px;
				padding-block: 10px;
			}

			.button {
				block-size: 21.5px;
				min-block-size: unset;
				min-inline-size: unset;
			}
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
	const tabIcons: DeclaredIcons[] = ["home", "volume", "layer", "sonar", "ytp", "mosh"];
	return (
		<div className="container" data-scheme={scheme} inert>
			<Button icon={icon} minWidthUnbounded className="color-scheme-button" />
			<Contents className="circular">
				{tabIcons.map((tabIcon, i) => (
					<div key={tabIcon} className={["tab-item", { selected: i === 0 }]}>
						<Icon name={tabIcon} />
					</div>
				))}
			</Contents>
			<Contents className="corner">
				<Card>
					<Slider value={[85]} />
				</Card>
				<Card>
					<ToggleSwitch on={[true]} hideLabel />
					<ToggleSwitch on={[false]} hideLabel />
				</Card>
				<Card>
					<Checkbox value={[true]} plain />
					<RadioButton id="true" value={["true"]} plain />
				</Card>
				<Card>
					<Button accent />
					<Button />
				</Card>
			</Contents>
		</div>
	);
}
