// cspell:disable-next-line
import Waveform1 from "assets/svg/waveform_benfuxingkong_dong.svg?react";
// cspell:disable-next-line
import Waveform2 from "assets/svg/waveform_nianshanhai.svg?react";

const StylePreviewTrackEvent = styled.div`
	position: absolute;
	overflow: clip;
	background-color: ${c("accent-color")};
	border: 2px solid color-mix(in srgb, ${c("accent-color")}, ${c("fill-color-text-on-accent-primary")});
	border-radius: 8px;
	fill: ${c("fill-color-text-on-accent-primary")};

	svg {
		position: absolute;
		top: 0;
		width: 200%;
		height: 100%;
	}

	&.double svg {
		width: 100%;

		&:nth-of-type(2) {
			width: 150%;
		}
	}
`;

function PreviewTrackEvent({ trackIndex, subsequent, double }: {
	/** Track index. */
	trackIndex?: number;
	/** Includes subsequent? */
	subsequent?: boolean;
	/** Double portion? */
	double?: boolean;
}) {
	return (
		<StylePreviewTrackEvent className={{ double }} style={{ "--i": trackIndex }}>
			<Waveform1 />
			{subsequent && <Waveform2 />}
		</StylePreviewTrackEvent>
	);
}

const StyledPreviewTrackLegato = styled.div`
	position: relative;
	overflow: clip;

	.track-line {
		position: absolute;
		top: calc(100% / 3);
		left: -15px;
		width: calc(100% + 30px);
		height: calc(100% / 3);
		background-image: linear-gradient(to right, ${c("fill-color-accent-disabled")} 50%, transparent 0%);
		background-repeat: repeat-x;
		background-size: 20px 2px;

		&:nth-of-type(2) {
			background-position: left bottom;
		}
	}

	${StylePreviewTrackEvent} {
		top: calc((var(--i) - 1) * 100% / 3);
		width: calc(100% / 9);
		height: calc(100% / 3);
	}
`;

export default function PreviewTrackLegato({ children, ...htmlAttrs }: FCP<{

}, "div">) {
	return (
		<StyledPreviewTrackLegato {...htmlAttrs}>
			<div className="track-line" />
			<div className="track-line" />
			<PreviewTrackEvent trackIndex={2} subsequent />
		</StyledPreviewTrackLegato>
	);
}
