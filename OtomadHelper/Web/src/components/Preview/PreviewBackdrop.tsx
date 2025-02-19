import noise from "assets/images/noise_asset.png";
import type { systemBackdrops } from "views/settings";
type SystemBackdrop = typeof systemBackdrops[number]["name"];
const TRANSLATE = 7;

const StyledPreviewBackdrop = styled.div`
	${styles.mixins.square("100%")};
	${styles.mixins.gridCenter()};
	container: image / size;
	position: relative;

	.card {
		${styles.mixins.square("calc(78cqmin - 20px)")}
		--box-shadow-base:
			inset 0 0 0 1px ${c("stroke-color-control-stroke-default")},
			0 3px 6px ${c("black", 43.9)};
		--opacity: 100%;
		position: absolute;
		overflow: clip;
		background-image: linear-gradient(135deg, rgb(from ${c("accent-color")} r g b / var(--opacity)) 0%, rgb(from color-mix(in oklch, ${c("accent-color")} 100%, black 30%) r g b / var(--opacity)) 100%);
		border-radius: 6px;

		${ifColorScheme.light} & {
			box-shadow: var(--box-shadow-base), inset 0 -2px 8px ${c("stroke-color-control-stroke-on-accent-secondary", 22)};

			&.solid {
				box-shadow: var(--box-shadow-base), inset 0 -2px 2px ${c("stroke-color-control-stroke-on-accent-secondary", 22)};
			}
		}

		${ifColorScheme.dark} & {
			box-shadow: var(--box-shadow-base), inset 0 2px 2px ${c("stroke-color-control-stroke-on-accent-secondary")};
		}

		${ifColorScheme.contrast} & {
			border: 1px solid black;
			box-shadow: none !important;
		}

		&.back {
			translate: ${-TRANSLATE}cqmin ${TRANSLATE}cqmin;
		}

		&.fore {
			--blur: 0;
			translate: ${TRANSLATE}cqmin ${-TRANSLATE}cqmin;
			backdrop-filter: blur(var(--blur)) !important;

			&::before,
			&::after {
				${styles.mixins.square("100%")};
				position: absolute;
				display: block;
				pointer-events: none;
			}

			&::after {
				content: "";
				background-color: ${c("background-color", "var(--mix)")};
			}

			&.acrylic {
				--blur: 3.5px;
				--opacity: 50%;
				--mix: 30%;

				&::before {
					--dpi: 1;
					content: "";
					background: url("${noise}") left top repeat;
					background-size: calc(256px / var(--dpi));
					opacity: 0.125;
					mix-blend-mode: multiply;

					${forMapFromTo(1.25, 5, 0.25, dpi => css`
						@media (resolution >= ${dpi}x) {
							--dpi: ${dpi};
						}
					`)}
				}
			}

			&.mica {
				--blur: 24px;
				--opacity: 40%;
				--mix: 75%;

				&.mica-alt {
					--opacity: 30%;
					--mix: 50%;

					${ifColorScheme.dark} & {
						/* filter: saturate(0.5); */
						backdrop-filter: blur(var(--blur)) brightness(0.05) !important;
					}
				}
			}

			&.solid {
				background: ${c("background-color")};

				&::after {
					content: none;
				}
			}
		}
	}

	.items-view-item.grid:has(&) {
		.text-part .title {
			padding-inline-start: 13.5px;
		}
	}
`;

export default function PreviewBackdrop({ type }: { type: SystemBackdrop }) {
	return (
		<StyledPreviewBackdrop>
			<div className="card back" />
			<div className={["card fore", type === "micaAlt" ? "mica mica-alt" : type]} />
		</StyledPreviewBackdrop>
	);
}
