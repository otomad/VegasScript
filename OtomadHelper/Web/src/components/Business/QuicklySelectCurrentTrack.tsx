export default function QuicklySelectCurrentTrack() {
	return (
		<Tooltip title={t.source.preferredTrack.quicklySelect} placement="y">
			<Button icon="layer_diagonal_sparkle" minWidthUnbounded />
		</Tooltip>
	);
}
