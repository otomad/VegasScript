import { matchParity } from "views/track/grid";

const StyledPreviewGradient = styled.div<{
	/** Square or linear? */
	$square: boolean;
	/** Mirror the even X edges? */
	$mirrorEdges: boolean;
	/** Overlay the filter? */
	$overlay: boolean;
	/** Effect identifier. */
	$effect: string;
	/** Reverse the order? */
	$descending: boolean;
	/** Flow direction or writing mode. */
	$direction: Config.GridDirectionOrderType;
}>`
	${styles.mixins.square("100%")};
	direction: ${({ $direction }) => $direction === "rl-tb" ? "rtl" : "ltr"};
	writing-mode: ${({ $direction }) => $direction === "tb-lr" ? "vertical-lr" : $direction === "tb-rl" ? "vertical-rl" : "horizontal-tb"};

	.image-wrapper:has(&) {
		height: calc(100cqw / 16 * 9);
		transition: none;
	}

	img {
		${styles.mixins.square("100%")};
		flex: 1;
		object-fit: cover;
		transition: none;
	}

	${({ $square }) => $square ? css`
		display: grid;
		grid-template-columns: repeat(3, 1fr);
	` : css`
		display: flex;

		img {
			width: 0;
		}
	`};

	${({ $mirrorEdges, $overlay, $square }) => $mirrorEdges && !$overlay && (!$square ? css`
		img:nth-child(even) {
			scale: -1 1;
		}
	` : css`
		img:nth-child(3n + 2) {
			scale: -1 1;
		}
		img:nth-child(n + 4):where(:nth-child(-n + 6)) {
			scale: 1 -1;
		}
		img:nth-child(5) {
			scale: -1;
		}
	`)}

	${({ $overlay, $square }) => $overlay && css`
		display: block;

		img {
			${styles.mixins.square("100%")};
			position: absolute;
			${!$square ? css`
				clip-path: xywh(calc(var(--j) / var(--n) * 100%) 0 calc(100% / var(--n)) 100%);
			` : css`
				clip-path: xywh(calc(mod(var(--j), 3) / 3 * 100%) calc(round(down, var(--j) / 3) / 3 * 100%) calc(100% / 3) calc(100% / 3));
			`}
		}
	`}

	// stylelint-disable-next-line no-duplicate-selectors
	img {
		${({ $effect, $descending }) => {
			const parity = $descending ? "odd" : "even";
			return {
				rainbow: css`
					filter: hue-rotate(calc(var(--i) / var(--n) * 1turn));
				`,
				graSaturated: css`
					filter: saturate(calc(pow(var(--i) / var(--n), 1.5) * 5));
				`,
				graContrasted: css`
					filter: contrast(max(0.25, calc(pow(var(--i) / var(--n), 1.5) * 5)));
				`,
				threshold: css`
					filter: brightness(calc(11.044 / (1 + pow((1 - var(--i) / (var(--n) - 1)) / 1.559, -2.885)) + 0.6)) contrast(10);
				`,
				altChromatic: css`
					&:not(.parity):nth-child(${parity}), &.parity.parity-h {
						filter: grayscale(1);
					}
				`,
				altNegative: css`
					&:not(.parity):nth-child(${parity}), &.parity.parity-h {
						filter: invert(1);
					}
				`,
				altLuminInvert: css`
					&:not(.parity):nth-child(${parity}), &.parity.parity-h {
						filter: invert(1) hue-rotate(0.5turn);
					}
				`,
				altHueInvert: css`
					&:not(.parity):nth-child(${parity}), &.parity.parity-h {
						filter: hue-rotate(0.5turn);
					}
				`,
				rotInvert: css`
					&:not(.parity):nth-child(4n + ${$descending ? 1 : 3}), &.parity.parity-h.parity-v {
						filter: invert(1);
					}
					&:not(.parity):nth-child(4n + ${$descending ? 2 : 4}), &.parity.parity-v {
						filter: invert(1) hue-rotate(0.5turn);
					}
					&:not(.parity):nth-child(4n + ${$descending ? 4 : 2}), &.parity.parity-h {
						filter: hue-rotate(0.5turn);
					}
				`,
			}[$effect];
		}}
	}
`;

export default function PreviewGradient({ thumbnail, square, mirrorEdges, overlay, effect, descending, direction, parity, ...htmlAttrs }: FCP<{
	/** Thumbnail. */
	thumbnail: string;
	/** Square or linear? */
	square: boolean;
	/** Mirror the even edges? */
	mirrorEdges: boolean;
	/** Overlay the filter? */
	overlay: boolean;
	/** Effect identifier. */
	effect: string;
	/** Reverse the order? */
	descending: boolean;
	/** Flow direction or writing mode. */
	direction: Config.GridDirectionOrderType;
	/** Parity pattern. */
	parity?: [h: Config.GridParityType, v: Config.GridParityType] | false;
}, "div">) {
	const count = square ? 9 : 5;
	if (!square) parity = undefined;
	const getCell = (i: number): TwoD => !square ? [i + 1, 1] : [i % 3 + 1, (i / 3 | 0) + 1];

	return (
		<StyledPreviewGradient
			$square={square}
			$mirrorEdges={mirrorEdges}
			$overlay={overlay}
			$effect={effect}
			$descending={descending}
			$direction={direction}
			{...htmlAttrs}
			style={{ "--n": count }}
		>
			{forMap(count, i => (
				<img
					key={i}
					src={thumbnail}
					alt=""
					style={{
						"--i": descending ? count - i - 1 : i,
						"--j": i,
					}}
					className={{
						parity,
						parityH: parity && matchParity(parity[0], ...getCell(i)),
						parityV: parity && matchParity(parity[1], ...getCell(i)),
					}}
				/>
			))}
		</StyledPreviewGradient>
	);
}
