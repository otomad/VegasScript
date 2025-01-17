export default function QuicklySelectCurrentTrack() {
	return (
		<Tooltip title={t.source.preferredTrack.quicklySelect} placement="y">
			<Button icon="cursor_hover" minWidthUnbounded />
		</Tooltip>
	);
}
