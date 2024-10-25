export default function QuicklySelectCurrentTrack() {
	return (
		<Tooltip title={t.source.preferredTrack.quicklySelect} placement="y">
			<Button icon="flash" minWidthUnbounded />
		</Tooltip>
	);
}
