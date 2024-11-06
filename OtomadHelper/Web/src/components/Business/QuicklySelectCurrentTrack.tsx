export default function QuicklySelectCurrentTrack() {
	return (
		<Tooltip title={t.source.preferredTrack.quicklySelect} placement="y">
			<Button icon="layer_sparkle" minWidthUnbounded />
		</Tooltip>
	);
}
