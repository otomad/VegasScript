import tipsImage from "assets/images/tips/bathroom_mirror.jpg";

export /* @internal */ const musicalNotationSystems = ["scientific", "helmholtz", "solfege", "numbered", "gongche", "gongshang", "lyulyu", "midiNumber", "frequency"] as const;

export default function Shupelunker() {
	const { enabled, presetTemplate } = selectConfig(c => c.lyrics);
	const { enabled: karaokeEnabled, futureFill: [futureFill, setFutureFill], pastFill: [pastFill, setPastFill] } = selectConfig(c => c.lyrics.karaoke);
	const { enabled: notationEnabled, type } = selectConfig(c => c.lyrics.pitchNotation);

	mutexSwitches(karaokeEnabled, notationEnabled);

	const { changePage } = useSnapshot(pageStore);

	const previewKaraoke = <PreviewKaraoke reset={!enabled[0]} {...karaokeEnabled[0] ? { futureFill, pastFill } : null} />;
	return (
		<div className="container">
			<SettingsPageControl image={tipsImage} imageOverlay={previewKaraoke} learnMoreLink="">{t.descriptions.lyrics}</SettingsPageControl>

			<SettingsCardToggleSwitch title={t.enabled} icon="enabled" on={enabled} resetTransitionOnChanging />
			<EmptyMessage.Typical icon="lyrics" title="lyrics" enabled={enabled}>
				<EmptyMessage.YtpDisabled fully={t.titles.lyrics}>
					<SettingsCard title={t.lyrics.presetTemplate} details={t.descriptions.lyrics.presetTemplate} icon="subtitles">
						<ComboBox current={presetTemplate} options={[]} ids={[]} />
					</SettingsCard>

					<Subheader>{t.lyrics.karaoke.toString()}</Subheader>
					<SettingsCardToggleSwitch title={t.lyrics.enableMode({ mode: t.lyrics.karaoke })} details={t.descriptions.lyrics.karaoke} icon="mic_handheld" on={karaokeEnabled} />
					<Disabled disabled={!karaokeEnabled[0]}>
						<SettingsCard icon="karaoke_future_fill" title={t.lyrics.karaoke.futureFill} details={t.descriptions.lyrics.karaoke.futureFill}>
							<ColorPicker color={[futureFill, setFutureFill]} />
						</SettingsCard>
						<SettingsCard icon="karaoke_past_fill" title={t.lyrics.karaoke.pastFill} details={t.descriptions.lyrics.karaoke.pastFill}>
							<ColorPicker color={[pastFill, setPastFill]} />
						</SettingsCard>
					</Disabled>

					<Subheader>{t.lyrics.pitchNotation}</Subheader>
					<SettingsCardToggleSwitch title={t.lyrics.enableMode({ mode: t.lyrics.pitchNotation })} details={t.descriptions.lyrics.pitchNotation} icon="genre" on={notationEnabled} />
					<Disabled disabled={!notationEnabled[0]}>
						<ExpanderRadio
							title={t.lyrics.pitchNotation.system}
							details={t.descriptions.lyrics.pitchNotation.system}
							icon="genre_search"
							items={musicalNotationSystems}
							value={type}
							view="tile"
							idField
							iconField={id => "notation_" + new VariableName(id).snake}
							nameField={id => <Preserves>{t.lyrics.pitchNotation[id].toString().split("\n")[0]}</Preserves>}
							detailsField={id => t.lyrics.pitchNotation[id].toString().split("\n")[1]}
							checkInfoCondition={id => t.lyrics.pitchNotation[id!].toString().split("\n")[0]}
						/>
					</Disabled>

					<Subheader>{t.subheaders.seeAlso}</Subheader>
					<div>
						<Button hyperlink onClick={() => changePage(["tools"])}>{t.lyrics.useStaticText}</Button>
					</div>
				</EmptyMessage.YtpDisabled>
			</EmptyMessage.Typical>
		</div>
	);
}
