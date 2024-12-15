import exampleThumbnail from "assets/images/ヨハネの氷.png";
import { legatos, stretches, unlengthens } from "./visual";
const unlengthensInAudio = unlengthens.filter(item => item.availableInAudio);

export /* @internal */ const tuningMethods = [
	{ id: "noTuning", icon: "prohibited" },
	{ id: "pitchShift", icon: "plugin" },
	{ id: "elastic", icon: "plus_minus" },
	{ id: "classic", icon: "history" },
	{ id: "scaleless", icon: "scaleless" },
] as const;

export /* @internal */ const exceeds = [
	{ id: "plugin", icon: "plugin_multiple" },
	{ id: "octave", icon: "octave" },
	{ id: "octaveExp", icon: "octave_beaker" },
	{ id: "wrap", icon: "abs_leq" },
	{ id: "silent", icon: "speaker_mute" },
] as const;
const getExceedsName = (id: string | undefined, tuningMethod: string) => !id ? "" : t.stream.tuning.alternativeForExceedsTheRange[
	id === "plugin" && tuningMethod === "pitchShift" ? "multiple" : id
];

export /* @internal */ const beepEngines = ["WebAudio"] as const;
const beepWaveforms = ["sine", "triangle", "square", "sawtooth"] as const satisfies OscillatorCommonType[];

/** @deprecated */
const tracks = [t.source.preferredTrack.newTrack, "1: Lead"];

const buildInPresets = ["normal", "fadeOut"];

const TooltipPartial = Tooltip.with({ placement: "y" });

const PrelistenActions = styled(Disabled).attrs({
	container: StackPanel,
})`
	position: relative;
	display: flex;
	align-items: stretch;

	* {
		transition-behavior: allow-discrete;
	}

	:has(~ .stop.shown) {
		opacity: 0;
		pointer-events: none;
		// Do not use \`visibility: hidden;\`, it has a bad behavior.
	}

	.stop {
		position: absolute;
		inset: 0;

		&:not(.shown) {
			opacity: 0;
			pointer-events: none;
		}
	}
`;

export default function Audio() {
	const {
		enabled, preferredTrack: preferredTrackIndex,
		stretch, loop, normalize, unlengthen, legato, multitrackForChords, stack, timeUnremapping, autoPan, autoPanCurve,
		tuningMethod, stretchAttribute, alternativeForExceedsTheRange, resample, preserveFormant, currentPreset,
		basePitch, basePitchBased, cent,
	} = selectConfig(c => c.audio);
	const { engine, waveform, duration: beepDuration, volume: beepVolume, adjustAudioToBasePitch } = selectConfig(c => c.audio.prelistenAttributes);
	const { createGroups } = selectConfig(c => c);
	const { hideUseTips } = useSnapshot(configStore.settings);
	const activeParameterScheme = selectConfigArray(c => c.audio.activeParameterScheme);
	const [stopPrelistenings, setStopPrelistenings] = useImmer<(() => void)[]>([]);
	const isPrelistening = stopPrelistenings.length > 0;

	const { pushPage } = useSnapshot(pageStore);

	function prelistenBasePitch() {
		if (isPrelistening) {
			stopPrelistening();
			return;
		}
		if (engine[0] === "WebAudio") {
			const { stop, promise } = beep(waveform[0],
				(adjustAudioToBasePitch[0] ? new Pitch("C", 5) : new Pitch(basePitch[0])).frequency, beepDuration[0], beepVolume[0]);
			setStopPrelistenings(draft => void draft.pushUniquely(stop));
			promise.then(() => setStopPrelistenings(draft => void draft.removeItem(stop)));
		} else return;
	}
	function stopPrelistening() {
		stopPrelistenings.forEach(stop => stop());
		setStopPrelistenings([]);
	}

	return (
		<div className="container">
			<SettingsPageControlMedia stream="audio" fileName="ヨハネの氷.mp4" enabled={enabled} thumbnail={exampleThumbnail} />

			<EmptyMessage.Typical icon="volume" title="audio" enabled={enabled}>
				<SettingsCard title={t.source.preferredTrack} details={t.descriptions.source.preferredTrack} icon="preferred_track">
					<StackPanel>
						<ComboBox current={preferredTrackIndex} ids={[...tracks.keys()]} options={tracks} />
						<QuicklySelectCurrentTrack />
					</StackPanel>
				</SettingsCard>
				<SettingsCardToggleSwitch title={t.stream.createGroups} details={t.descriptions.stream.createGroups} icon="group" on={createGroups} />
				<ExpanderStreamPlaybackRate stream="audio" />
				<SettingsCardToggleSwitch title={t.stream.normalize} details={t.descriptions.stream.normalize} icon="normalize" on={normalize} />
				<SettingsCard
					title={t.stream.loop}
					details={t.descriptions.stream.loop}
					selectInfo={loop[0] === "auto" && t.descriptions.stream.loop.preserve}
					icon="loop"
				>
					<ThreeStageSwitch current={loop} indetText={t.preserve} indetIcon="sync_off" />
				</SettingsCard>
				<EmptyMessage.YtpDisabled>
					<ExpanderRadio
						title={t.stream.stretch}
						details={t.descriptions.stream.stretch}
						icon="stretch"
						items={stretches}
						value={stretch}
						view="tile"
						idField="id"
						nameField={t.stream.stretch}
						iconField="icon"
					/>
					<ExpanderRadio
						title={t.stream.unlengthen}
						details={t.descriptions.stream.unlengthen}
						icon="arrow_import_prohibited"
						items={unlengthensInAudio}
						value={unlengthen}
						view="tile"
						idField="id"
						nameField={t.stream.unlengthen}
						iconField="icon"
					/>
					<ExpanderRadio
						title={t.stream.legato}
						details={t.descriptions.stream.legato}
						icon="legato"
						items={legatos}
						value={legato}
						view="grid"
						idField="id"
						nameField={t.stream.legato}
						iconField="icon"
						imageField="image"
						itemWidth={566 / 196 * GRID_VIEW_ITEM_HEIGHT}
					/>
					{!hideUseTips && <InfoBar status="accent" title={t.descriptions.stream.unlengthenAndLegatoConflictInAudio} />}
					<SettingsCardToggleSwitch
						title={t.stream.multitrackForChords}
						details={t.descriptions.stream.multitrackForChords}
						icon="chords"
						on={multitrackForChords}
					/>
					<SettingsCardToggleSwitch
						title={t.stream.stack}
						details={t.descriptions.stream.stack}
						icon="database_stack"
						on={stack}
					/>
					<SettingsCardToggleSwitch
						title={t.stream.timeUnremapping}
						details={t.descriptions.stream.timeUnremapping}
						icon="timer_off"
						on={timeUnremapping}
					/>
					<SettingsCardToggleSwitch
						title={t.stream.autoPan}
						details={t.descriptions.stream.autoPan}
						icon="stereo"
						on={autoPan}
					>
						<Expander.Item.Curve curve={autoPanCurve} />
					</SettingsCardToggleSwitch>

					<Subheader>{t.stream.tuning}</Subheader>
					<ExpanderRadio
						title={t.stream.tuning.tuningMethod}
						icon="tuning"
						items={tuningMethods}
						value={tuningMethod}
						view="list"
						idField="id"
						iconField="icon"
						nameField={t.stream.tuning.tuningMethod}
						detailsField={t.descriptions.stream.tuning.tuningMethod}
					/>
					<Disabled disabled={tuningMethod[0].in("noTuning", "scaleless")}>
						<ExpanderRadio
							title={t.stream.tuning.stretchAttributes}
							details={t.descriptions.stream.tuning.stretchAttributes}
							icon="tuning_wrench"
							items={[]}
							value={stretchAttribute}
							view="tile"
							idField="id"
							nameField={t.stream.tuning.stretchAttributes}
						/>
						<ExpanderRadio
							title={t.stream.tuning.alternativeForExceedsTheRange}
							details={t.descriptions.stream.tuning.alternativeForExceedsTheRange}
							icon="exceeds"
							items={exceeds}
							value={alternativeForExceedsTheRange}
							view="list"
							idField="id"
							iconField="icon"
							nameField={item => getExceedsName(item.id, tuningMethod[0])}
							detailsField={item => (
								<TransInterpolation
									i18nKey={t => t.descriptions.stream.tuning.alternativeForExceedsTheRange[item.id]}
									formulaFor39={<MathFormulaFor39 />}
									formulaFor24={<MathFormulaFor24 />}
								/>
							)}
							checkInfoCondition={id => getExceedsName(id, tuningMethod[0])}
						/>
						<SettingsCardToggleSwitch title={t.stream.tuning.resample} details={t.descriptions.stream.tuning.resample} icon="lock" on={resample} />
						<SettingsCardToggleSwitch title={t.stream.tuning.preserveFormant} details={t.descriptions.stream.tuning.preserveFormant} icon="speech" on={preserveFormant} />
						<Expander
							title={t.stream.tuning.basePitch}
							details={t.descriptions.stream.tuning.basePitch}
							icon="music_note"
							actions={<PitchPicker spn={basePitch} />}
						>
							<Expander.Item title={t.stream.tuning.basePitch.cent} details={t.descriptions.stream.tuning.basePitch.cent} icon="fine_tune">
								<SliderWithBox
									value={cent}
									min={-100}
									max={100}
									decimalPlaces={0}
									defaultValue={0}
									suffix={t(cent[0]).units.cent}
								/>
							</Expander.Item>
							<ToggleSwitch icon="relative" on={basePitchBased} details={t.descriptions.stream.tuning.basePitch.based}>{t.stream.tuning.basePitch.based}</ToggleSwitch>
							<ToggleSwitch icon="tuning_sparkle" on={[false]} disabled details={<p style={{ color: c("fill-color-system-critical") }}>{t.underConstruction}</p>}>{t.stream.tuning.basePitch.auto}</ToggleSwitch>
						</Expander>
						<Expander
							title={t.stream.tuning.prelisten}
							details={t.descriptions.stream.tuning.prelisten}
							icon="headphone"
							actions={(
								<PrelistenActions>
									<Button onClick={prelistenBasePitch}>{t.stream.tuning.prelisten.basePitch}</Button>
									<Button>{t.stream.tuning.prelisten.audio}</Button>
									<Button icon="stop" className={["stop", { shown: isPrelistening }]} onClick={stopPrelistening}>{t.stream.tuning.prelisten.stop}</Button>
								</PrelistenActions>
							)}
						>
							<Expander.Item icon="table_column_top_bottom" title={t.stream.tuning.prelisten.engine}>
								<ComboBox options={beepEngines} ids={beepEngines} current={engine} />
							</Expander.Item>
							<Expander.Item icon="sound_wave" title={t.stream.tuning.prelisten.waveform}>
								<ComboBox ids={beepWaveforms} options={beepWaveforms.map(waveform => t.stream.tuning.prelisten.waveform[waveform])} current={waveform} />
							</Expander.Item>
							<Expander.Item icon="timer" title={t.stream.tuning.prelisten.duration}>
								<TextBox.Number value={beepDuration} min={0} decimalPlaces={0} spinnerStep={100} suffix={t.units.millisecond} />
							</Expander.Item>
							<Expander.Item icon="volume" title={t.stream.tuning.prelisten.volume}>
								<Slider
									value={beepVolume}
									min={0}
									max={1}
									step={0.01}
									defaultValue={1}
									displayValue={value => (value * 100 | 0) + "%"}
								/>
							</Expander.Item>
							<ToggleSwitch icon="remix_add" on={adjustAudioToBasePitch} details={t.descriptions.stream.tuning.prelisten.adjustAudioToBasePitch}>{t.stream.tuning.prelisten.adjustAudioToBasePitch}</ToggleSwitch>
						</Expander>
					</Disabled>

					<Subheader>{t.stream.mapping}</Subheader>
					<Expander title={t.stream.mapping.velocity} icon="signal" />
					<Expander title={t.stream.mapping.pitch} icon="music_note" />
					<Expander title={t.stream.mapping.duration} icon="timer" />
					<Expander title={t.stream.mapping.pan} icon="stereo" />
					<Expander title={t.stream.mapping.progress} icon="progress_bar" />

					<Subheader>{t.subheaders.parameters}</Subheader>
					<ExpanderRadio
						title={t.preset}
						details={t.descriptions.stream.preset}
						icon="preset"
						items={buildInPresets}
						value={currentPreset}
						view="tile"
						idField
						nameField
					>
						<Expander.ChildWrapper>
							<Button icon="add">{t.stream.preset.add}</Button>
						</Expander.ChildWrapper>
					</ExpanderRadio>
					{activeParameterScheme.map((scheme, i) => (
						<SettingsCard
							title={scheme.name[0]}
							details={listFormat(scheme.parameters[0], "conjunction", "narrow")}
							type="button"
							key={i}
							icon
							onClick={() => pushPage("parameters")}
						>
							<ToggleSwitch on={scheme.enabled} />
						</SettingsCard>
					))}
					<div>
						<Button icon="add">{t.new}</Button>
					</div>
				</EmptyMessage.YtpDisabled>
			</EmptyMessage.Typical>
		</div>
	);
}

subscribeStoreKey(configStore.audio, "unlengthen", value => value !== "lengthenable" && (configStore.audio.legato = "portato"));
subscribeStoreKey(configStore.audio, "legato", value => value !== "portato" && (configStore.audio.unlengthen = "lengthenable"));
