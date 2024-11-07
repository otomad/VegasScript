import cursor from "assets/cursors/treble_clef.svg?cursor";
import tipsImage from "assets/images/tips/classical_music_mashup.jpg";

export default function Staff() {
	const {
		enabled,
	} = selectConfig(c => c.visual.staff);

	return (
		<div className="container">
			<SettingsPageControl image={tipsImage} cursor={cursor} learnMoreLink="">{t.descriptions.staff}</SettingsPageControl>
			<SettingsCardToggleSwitch title={t.enabled} icon="enabled" on={enabled} resetTransitionOnChanging />

			<EmptyMessage.Typical icon="g_clef" title="staff" enabled={enabled}>
				TODO
			</EmptyMessage.Typical>
		</div>
	);
}
