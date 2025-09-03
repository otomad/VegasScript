/* eslint-disable import/order */
import LogoIconFluent from "assets/svg/Otomad Helper/fluent.svg?react";
import LogoIconMono from "assets/svg/Otomad Helper/mono.svg?react";
import LogoIconLiquidGlass from "assets/svg/Otomad Helper/liquid_glass.svg?react";
import LogoIconAero from "assets/svg/Otomad Helper/aero.svg?react";
import LogoTitle from "assets/svg/Otomad Helper/title.svg?react";
import LogoSubtitle from "assets/svg/Otomad Helper/subtitle.svg?react";

const floatLeft = keyframes`
	from {
		translate: 24px;
		opacity: 0;
	}
`;

const StyledSettingsAboutLogo = styled.div`
	display: inline-flex;
	flex-direction: column;
	direction: ltr;
	text-align: center;
	zoom: 1.325;

	.row-1 {
		display: flex;
		align-items: center;
		margin-top: -8px;
		margin-left: -8px;
		filter: drop-shadow(0 3px 3px #21262c40);

		${ifColorScheme.contrast} & {
			filter: none;
		}

		${ifColorScheme.reduceTransparency} {
			filter: none;
		}
	}

	.icon-wrapper {
		display: none;

		${ifColorScheme.light} &.light {
			display: block;
		}

		${ifColorScheme.dark} &.dark {
			display: block;
		}

		&.light {
			cursor: pointer;
		}

		&:active {
			scale: 0.95;
		}
	}

	.title,
	.subtitle {
		${ifColorScheme.dark} & {
			--color-scheme: dark;
		}
	}

	.page-content.jump main.page:is(.enter, .enter-done) & {
		.icon-wrapper {
			animation: ${keyframes`
				from {
					scale: 1.5;
					rotate: -45deg;
					opacity: 0;
				}
			`} 500ms ${eases.easeOutMax} backwards;
		}

		.title,
		.subtitle {
			animation: ${floatLeft} 500ms ${eases.easeOutMax} backwards;
		}
	}

	.subtitle {
		align-self: end;
		animation-delay: 250ms !important;
	}

	.title {
		margin: -2.5px;
		animation-delay: 125ms !important;
	}

	${ifColorScheme.light} & [data-icon-style="liquid glass"] ~ .title {
		margin-left: 9px;
	}

	svg {
		display: block;
	}
`;

const StyledSettingsAboutLogoWrapper = styled.div`
	display: block;
	inline-size: 100%;
	margin-block-end: 0 !important;
	padding-block: 16px 8px;
	text-align: center;
	content-visibility: auto;
	animation: none;
`;

export /** @internal */ default function SettingsAboutLogo() {
	const iconStyles = ["fluent", "aero", "liquid glass"] as const;
	const [iconStyle, setIconStyle] = useState<ValueOf<typeof iconStyles>>("fluent");
	const nextIconStyle = () => setIconStyle(iconStyle => iconStyles.nextItem(iconStyle));

	return (
		<StyledSettingsAboutLogoWrapper>
			<StyledSettingsAboutLogo role="img" aria-hidden>
				<div className="row-1">
					<div className="icon-wrapper light" data-icon-style={iconStyle} onClick={nextIconStyle}>
						{
							iconStyle === "liquid glass" ? <LogoIconLiquidGlass /> :
							iconStyle === "aero" ? <LogoIconAero /> :
							<LogoIconFluent />
						}
					</div>
					<div className="icon-wrapper dark">
						<LogoIconMono />
					</div>
					<LogoTitle className="title" />
				</div>
				<LogoSubtitle className="subtitle" />
			</StyledSettingsAboutLogo>
		</StyledSettingsAboutLogoWrapper>
	);
}
