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
}>`
	${styles.mixins.square("100%")};
	direction: ltr;
	writing-mode: horizontal-tb;

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

	${({ $mirrorEdges, $overlay }) => $mirrorEdges && !$overlay && css`
		img:nth-child(even) {
			scale: -1 1;
		}
	`}

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
				graduallySaturated: css`
					filter: saturate(calc(pow(var(--i) / var(--n), 1.5) * 5));
				`,
				graduallyContrasted: css`
					filter: contrast(max(0.25, calc(pow(var(--i) / var(--n), 1.5) * 5)));
				`,
				threshold: css`
					filter: brightness(calc(11.044 / (1 + pow((1 - var(--i) / (var(--n) - 1)) / 1.559, -2.885)) + 0.6)) contrast(10);
				`,
				alternatelyChromatic: css`
					&:nth-child(${parity}) {
						filter: grayscale(1);
					}
				`,
				alternatelyNegative: css`
					&:nth-child(${parity}) {
						filter: invert(1);
					}
				`,
			}[$effect];
		}}
	}
`;

export default function PreviewGradient({ thumbnail, square, mirrorEdges, overlay, effect, descending, ...htmlAttrs }: FCP<{
	/** Thumbnail. */
	thumbnail: string;
	/** Square or linear? */
	square: boolean;
	/** Mirror the even X edges? */
	mirrorEdges: boolean;
	/** Overlay the filter? */
	overlay: boolean;
	/** Effect identifier. */
	effect: string;
	/** Reverse the order? */
	descending: boolean;
}, "div">) {
	const count = square ? 9 : 5;

	return (
		<StyledPreviewGradient
			$square={square}
			$mirrorEdges={mirrorEdges}
			$overlay={overlay}
			$effect={effect}
			$descending={descending}
			{...htmlAttrs}
			style={{ "--n": count }}
		>
			{forMap(count, i => <img key={i} src={thumbnail} style={{ "--i": descending ? count - i - 1 : i, "--j": i }} />)}
		</StyledPreviewGradient>
	);
}
