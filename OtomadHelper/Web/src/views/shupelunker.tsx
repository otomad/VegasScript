import tipsImage from "assets/images/tips/shuzo_of_shupelunker_tactics.jpg";

const affixes = [
	{ id: "prefix", symbol: "C5-⋯" },
	{ id: "suffix", symbol: "⋯-C5" },
];

export default function Shupelunker() {
	const { enabled, affix, exclusiveTrack, offset } = useSelectConfig(c => c.shupelunker);
	const { octaves, fillUp, fillDown, default: defaultAll } = useSelectConfig(c => c.shupelunker.unallocated);

	return (
		<div className="container">
			<SettingsPageControl image={tipsImage} learnMoreLink="">{t.descriptions.shupelunker}</SettingsPageControl>

			<SettingsCardToggleSwitch title={t.enabled} icon="enabled" on={enabled} resetTransitionOnChanging />
			<EmptyMessage.Typical icon="slice" title="shupelunker_full" enabled={enabled}>
				<EmptyMessage.YtpDisabled fully={t.titles.shupelunker}>
					<ExpanderRadio
						title={t.shupelunker.affix}
						details={t.descriptions.shupelunker.affix}
						icon="affix"
						items={affixes}
						value={affix}
						view="tile"
						idField="id"
						nameField={t.shupelunker.affix}
						iconField={item => <span lang="en">{item.symbol}</span>}
					/>
					<Expander title={t.shupelunker.unallocated} details={t.descriptions.shupelunker.unallocated} icon="unallocated">
						<ToggleSwitch on={octaves} details={t.descriptions.shupelunker.unallocated.octaves} icon="unallocated_octaves">{t.shupelunker.unallocated.octaves}</ToggleSwitch>
						<ToggleSwitch on={fillUp} details={t.descriptions.shupelunker.unallocated.fillUp} icon="unallocated_fill_up">{t.shupelunker.unallocated.fillUp}</ToggleSwitch>
						<ToggleSwitch on={fillDown} details={t.descriptions.shupelunker.unallocated.fillDown} icon="unallocated_fill_down">{t.shupelunker.unallocated.fillDown}</ToggleSwitch>
						<ToggleSwitch on={defaultAll} details={t.descriptions.shupelunker.unallocated.default} icon="unallocated_default">{t.shupelunker.unallocated.default}</ToggleSwitch>
					</Expander>
					<SettingsCardToggleSwitch on={exclusiveTrack} title={t.shupelunker.exclusiveTrack} details={t.descriptions.shupelunker.exclusiveTrack} icon="exclusive_track" />
					<SettingsCard title={t.offset} details={t.descriptions.shupelunker.offset} icon="table_resize">
						<TextBox.Number value={offset} decimalPlaces={0} suffix={t.units.semitone} positiveSign />
					</SettingsCard>

					<Subheader>{t.shupelunker.keyMappingZones}</Subheader>
					<PreviewPiano />
				</EmptyMessage.YtpDisabled>
			</EmptyMessage.Typical>
		</div>
	);
}
