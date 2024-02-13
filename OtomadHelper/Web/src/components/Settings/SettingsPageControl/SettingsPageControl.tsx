const IMAGE_MARGIN = 16;

const StyledSettingsPageControl = styled.div<{
	/** 清除浮动。 */
	$clearFloat?: boolean;
}>`
	&:is(:lang(zh), :lang(ja), :lang(ko)) {
		text-align: justify;
	}

	${({ $clearFloat }) => $clearFloat ? css`
		display: flex;
		gap: ${IMAGE_MARGIN}px;
	` : css`
		margin-bottom: ${IMAGE_MARGIN}px;
		padding: 0 1px;

		.settings-page-control-preview-image {
			float: left;
			margin-right: ${IMAGE_MARGIN}px;
			margin-bottom: 5px;
		}
	`}
`;

export default forwardRef(function SettingsPageControl({ image, learnMoreLink, clearFloat, children, ...htmlAttrs }: FCP<{
	/** 图片。 */
	image: string;
	/** “了解更多”链接地址。 */
	learnMoreLink?: string;
	/** 清除浮动。 */
	clearFloat?: boolean;
}, "div">, ref: ForwardedRef<HTMLDivElement>) {
	const [hideFeatureTips] = selectConfig(c => c.settings.hideFeatureTips);
	if (hideFeatureTips) return;

	const LearnMore = learnMoreLink ? OpenLink : "a";
	const TextWrapper = clearFloat ? "p" : Fragment;

	return (
		<StyledSettingsPageControl ref={ref} $clearFloat={clearFloat} {...htmlAttrs}>
			<SettingsPageControlPreviewImage image={image} />
			<TextWrapper>
				<Preserves>{children}</Preserves>
				{learnMoreLink !== undefined && (
					<>
						<br /><br />
						<LearnMore>{t.learnMore}</LearnMore>
					</>
				)}
			</TextWrapper>
		</StyledSettingsPageControl>
	);
});
