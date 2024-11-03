const StyledPreviewGradient = styled.div<{
	/** Square or linear? */
	$square: boolean;
	/** Mirror the even X edges? */
	$mirrorEdges: boolean;
	/** Overlay the filter? */
	$overlay: boolean;
}>`
	${styles.mixins.square("100%")};

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
				clip-path: xywh(calc(var(--i) / var(--n) * 100%) 0 calc(100% / var(--n)) 100%);
			` : css`
				clip-path: xywh(calc(mod(var(--i), 3) / 3 * 100%) calc(round(down, var(--i) / 3) / 3 * 100%) calc(100% / 3) calc(100% / 3));
			`}
		}
	`}
`;

export default function PreviewGradient({ thumbnail, square, mirrorEdges, overlay, ...htmlAttrs }: FCP<{
	/** Thumbnail. */
	thumbnail: string;
	/** Square or linear? */
	square: boolean;
	/** Mirror the even X edges? */
	mirrorEdges: boolean;
	/** Overlay the filter? */
	overlay: boolean;
}, "div">) {
	const count = square ? 9 : 5;

	/* function getClipPath(index: number) {
		if (!overlay) return;
		if (!square)
			return ""
	} */

	return (
		<StyledPreviewGradient $square={square} $mirrorEdges={mirrorEdges} $overlay={overlay} {...htmlAttrs} style={{ "--n": count }}>
			{forMap(count, i => <img key={i} src={thumbnail} style={{ "--i": i }} />)}
		</StyledPreviewGradient>
	);
}
