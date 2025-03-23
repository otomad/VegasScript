const TEXT_MARGIN = [10, 8] as const;

const StyledPreviewLanguage = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	align-items: flex-start;
	height: 100%;
	border-radius: inherit;

	.text {
		${styles.effects.text.subtitle};
		margin: ${TEXT_MARGIN[1]}px ${TEXT_MARGIN[0]}px;

		.items-view-item.selected & {
			color: ${c("accent-color")};
		}
	}

	.items-view-item.grid:has(&) {
		.text-part .title {
			padding-inline-start: ${TEXT_MARGIN[0] + 1}px;
		}

		&.selected .text-part .title {
			color: ${c("accent-color")};
		}
	}

	progress {
		height: 8px;

		.items-view-item.selected & {
			${progressFinishedPart`
				border-start-start-radius: 0;
				border-end-start-radius: 0;
			`}

			&[value="100"] {
				${progressFinishedPart`
					border-radius: none;
				`}
			}
		}

		.items-view-item:not(.selected) & {
			${progressFinishedPart`
				background-color: ${c("fill-color-text-secondary")};
			`}
		}
	}

	.approval-progress {
		position: absolute;
		inset-block-start: ${TEXT_MARGIN[1]}px;
		inset-inline-end: ${TEXT_MARGIN[0]}px;
		display: flex;
		gap: 4px;
		align-items: center;

		.icon {
			font-size: 16px;
		}
	}
`;

const approvalProgresses = atomWithStorageAndImmer("translationProgress", new Map<string, number>());
approvalProgresses.onMount = setProgress => {
	fetch("/api/crowdin")
		.then(response => response.json())
		.then(data => {
			setProgress(draft => draft.set("en", 100));
			(data.progress as AnyObject[]).forEach(({ data }) => {
				const { id } = data.language;
				const progress = parseFloat(data.approvalProgress);
				setProgress(draft => draft.set(id, progress));
			});
		}).catch(noop);
};

export default function PreviewLanguage({ language }: FCP<{
	/** The ISO language code. */
	language: string;
	children?: never;
}>) {
	const languageName = t({ lng: language }).metadata.name;
	const [progresses] = useAtom(approvalProgresses);
	const progress = progresses.get(language) ?? -1;
	const showProgressPercentage = progress >= 0 && progress < 100;

	return (
		<StyledPreviewLanguage lang={language}>
			<div className="text">{languageName}</div>
			<progress value={progress} max={100} />
			{showProgressPercentage && (
				<div className="approval-progress">
					<Icon name="logo/crowdin" />
					<span>{progress}%</span>
				</div>
			)}
		</StyledPreviewLanguage>
	);
}
