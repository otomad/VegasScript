import { PREVIEW_IMAGE_HEIGHT } from "./SettingsPageControlPreviewImage";
const IMAGE_MARGIN = 16;

const StyledSettingsPageControl = styled.div<{
	/** The file path of the Easter egg mouse cursor. */
	$cursor?: string;
}>`
	display: flex;
	gap: 0.5em ${IMAGE_MARGIN}px;
	${({ $cursor }) => $cursor && css`
		cursor: ${$cursor.startsWith("url(") ? $cursor : `url("${$cursor}"), auto`};
	`}

	.settings-page-control-preview-image {
		transition: ${fallbackTransitions}, margin 0s;

		:where(img) {
			width: ${PREVIEW_IMAGE_HEIGHT / 9 * 16}px;
			height: ${PREVIEW_IMAGE_HEIGHT}px;
		}
	}

	> .paragraph-wrapper {
		${styles.effects.text.caption};
		overflow-y: clip;

		> .scroll-wrapper {
			--scroll-mask-height: 1.75em;
			max-block-size: ${PREVIEW_IMAGE_HEIGHT + 1}px;
			overflow-y: auto;
			mask: linear-gradient(
				to bottom,
				rgb(0 0 0 / var(--scroll-start-mask-transparency)) 0%,
				black var(--scroll-mask-height),
			black calc(100% - var(--scroll-mask-height)),
				rgb(0 0 0 / var(--scroll-end-mask-transparency)) 100%
			);
			animation: ${keyframes`
				0% {
					--scroll-start-mask-transparency: 1;
					--scroll-end-mask-transparency: 0;
				}

				10%,
				90% {
					--scroll-start-mask-transparency: 0;
					--scroll-end-mask-transparency: 0;
				}

				100% {
					--scroll-start-mask-transparency: 0;
					--scroll-end-mask-transparency: 1;
				}
			`} 1s linear;
			animation-timeline: scroll(self);

			> p {
				margin-block-start: -3px;
			}
		}


		> .learn-more-wrapper {
			display: block;
			margin-block-start: 0.5em;
		}
	}

`;

export default function SettingsPageControl({ image, imageOverlay, learnMoreLink, cursor, children, ref, ...htmlAttrs }: FCP<{
	/** Image. */
	image?: string | ReactNode;
	/** Something overlay on the image. */
	imageOverlay?: ReactNode;
	/** "Learn More" link href. */
	learnMoreLink?: string;
	/** The file path of the Easter egg mouse cursor. */
	cursor?: string;
}, "div">) {
	const { hideUseTips } = useSnapshot(configStore.settings);
	if (hideUseTips) return;

	const LearnMore = learnMoreLink ? Link : "a";

	return (
		<StyledSettingsPageControl
			ref={ref}
			$cursor={cursor}
			{...htmlAttrs}
		>
			{image && <SettingsPageControlPreviewImage image={image}>{imageOverlay}</SettingsPageControlPreviewImage>}
			<div className="paragraph-wrapper">
				<div className="scroll-wrapper">
					<p><Preserves spacing>{children}</Preserves></p>
				</div>
				{learnMoreLink !== undefined && <div className="learn-more-wrapper"><LearnMore>{t.learnMore}</LearnMore></div>}
			</div>
		</StyledSettingsPageControl>
	);
}
