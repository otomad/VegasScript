export /* @internal */ const sourceFromEnums = ["trackEvent", "projectMedia", "browseFile"] as const;
export /* @internal */ const startTimes = [
	{ id: "projectStart", name: t.source.startTime.projectStart, icon: "arrow_export" },
	{ id: "cursor", name: t.source.startTime.cursor, icon: "text_cursor" },
	{ id: "custom", name: t.custom, icon: "edit" },
] as const;
export /* @internal */ const selectGeneratedClipsType = [
	{ id: "audio", name: t.titles.audio, icon: "volume" },
	{ id: "visual", name: t.titles.visual, icon: "image" },
	{ id: "staff", name: t.titles.staff, icon: "g_clef" },
	{ id: "sonar", name: t.titles.sonar, icon: "sonar" },
	{ id: "lyrics", name: t.titles.lyrics, icon: "lyrics" },
] as const;
const allSelectGeneratedClips = Object.freeze(selectGeneratedClipsType.map(item => item.id));
const getAllSelectGeneratedClips = () => allSelectGeneratedClips.slice();
export /* @internal */ const trackNames = [
	{ id: "track", name: t.source.trackName.track, additional: t.source.trackName.voicebank, icon: "layer" },
	{ id: "trackIndex", name: t.source.trackName.trackIndex, icon: "layer_number" },
	{ id: "instrument", name: t.source.trackName.instrument, additional: t.source.trackName.voicebank, icon: "instrument" },
	{ id: "channel", name: t.source.trackName.channel, icon: "midi" },
	{ id: "clip", name: t.source.trackName.clip, icon: "track_event" },
	{ id: "media", name: t.source.trackName.media, icon: "media" },
	{ id: "score", name: t.source.trackName.score, icon: "document_score" },
	{ id: "unnamed", name: t.source.trackName.unnamed, icon: "prohibited" },
] as const;

export /* @internal */ const barOrBeatUnitTypes = ["bar", "beat"] as const;
const barOrBeatUnitNames = (count: number) => [t(count).units.bar, t(count).units.beat] as const;

/** @deprecated */
const isUnderVegas16 = true;

export default function Source() {
	const {
		sourceFrom, trimStart, trimEnd, startTime, customStartTime,
		belowAdjustmentTracks, preferredTrack: [preferredTrack, setPreferredTrack],
		trackGroup, collapseTrackGroup, trackName, consonant,
		secretBoxLimitToSelected, secretBoxForTrack, secretBoxForMarker, secretBoxForBarOrBeat, secretBoxForBarOrBeatPeriod, secretBoxForBarOrBeatPreparation,
	} = selectConfig(c => c.source);
	const { removeSourceClips, selectSourceClips, selectGeneratedClips: _selectGeneratedClips } = selectConfig(c => c.source.afterCompletion);
	const { enabled: [ytpEnabled] } = selectConfig(c => c.ytp);
	const secretBoxEnabled = secretBoxForTrack[0] || secretBoxForMarker[0] || secretBoxForBarOrBeat[0];
	/** @deprecated */ const manualEnabled = false;

	mutexSwitches(removeSourceClips, selectSourceClips);

	const selectGeneratedClips = useStateSelector(
		_selectGeneratedClips,
		items => typeof items === "boolean" ? getAllSelectGeneratedClips() : items === undefined ? [] : items,
		items => new Set(items).equals(new Set(allSelectGeneratedClips)) ? true : items,
		{ processPrevStateInSetterWithGetter: true },
	);

	const lockRemoveOrSelectSourceClips = sourceFrom[0] !== "trackEvent" ? false : null;

	return (
		<div className="container">
			<Card className="media-pool">
				<TabBar current={sourceFrom} aria-label={t.source.from}>
					<TabBar.Item id="trackEvent" icon="track_event">{t.source.trackEvent}</TabBar.Item>
					<TabBar.Item id="projectMedia" icon="media">{t.source.projectMedia}</TabBar.Item>
					<TabBar.Item id="browseFile" icon="open_file">{t.source.browseFile}</TabBar.Item>
				</TabBar>
				<TestThumbnail />
			</Card>

			<Expander title={t.source.trim} details={t.descriptions.source.trim} icon="aspect_ratio">
				<ExpanderChildTrim.Timecode start={trimStart} end={trimEnd} />
			</Expander>
			<ExpanderRadio
				title={t.source.startTime}
				details={t.descriptions.source.startTime}
				icon="start_point"
				items={startTimes}
				value={startTime}
				view="tile"
				idField="id"
				nameField="name"
				iconField="icon"
			>
				<CustomItem current={startTime}>
					{setToCustom => <TimecodeBox timecode={customStartTime} onFocus={setToCustom} />}
				</CustomItem>
			</ExpanderRadio>

			<Subheader>{t.subheaders.advanced}</Subheader>
			<Expander title={t.source.afterCompletion} icon="post_processing">
				<ToggleSwitch on={removeSourceClips} lock={lockRemoveOrSelectSourceClips} icon="delete">{t.source.afterCompletion.removeSourceClips}</ToggleSwitch>
				<ToggleSwitch on={selectSourceClips} lock={lockRemoveOrSelectSourceClips} icon="select_all">{t.source.afterCompletion.selectSourceClips}</ToggleSwitch>
				<SelectAll value={selectGeneratedClips} all={getAllSelectGeneratedClips()} title={t.source.afterCompletion.selectGeneratedClips} />
				<ItemsView view="tile" multiple current={selectGeneratedClips}>
					{selectGeneratedClipsType.map(({ id, name, icon }) =>
						<ItemsView.Item id={id} key={id} icon={icon}>{name}</ItemsView.Item>)}
				</ItemsView>
			</Expander>

			<Expander
				title={t.source.preferredTrack}
				selectInfo={preferredTrack === 0 ? t.source.preferredTrack.top : t(preferredTrack).source.preferredTrack.ordinal}
				icon="preferred_track"
			>
				<Expander.Item title={t.source.preferredTrack.index} details={t.descriptions.source.preferredTrack.fillingInstructions} icon="layer_number">
					<StackPanel>
						<TextBox.Number value={[preferredTrack, setPreferredTrack]} decimalPlaces={0} />
						<QuicklySelectCurrentTrack />
					</StackPanel>
				</Expander.Item>
				<ToggleSwitch
					on={belowAdjustmentTracks}
					selectInfo={isUnderVegas16 && t.descriptions.source.preferredTrack.belowAdjustmentTracks.versionRequest({ version: 16 })}
					icon="layer_sparkle_add_below"
					lock={isUnderVegas16 ? false : null}
				>
					{t.source.preferredTrack.belowAdjustmentTracks}
				</ToggleSwitch>
			</Expander>
			<SettingsCardToggleSwitch title={t.source.trackGroup} details={t.descriptions.source.trackGroup} icon="group" on={trackGroup}>
				<ToggleSwitch on={collapseTrackGroup} icon="chevron_down_up">{t.source.trackGroup.collapse}</ToggleSwitch>
			</SettingsCardToggleSwitch>
			<ExpanderRadio
				title={t.source.trackName}
				details={t.descriptions.source.trackName}
				icon="rename"
				items={trackNames}
				value={trackName}
				view="tile"
				idField="id"
				nameField={t.source.trackName}
				iconField="icon"
				detailsField="additional"
			/>

			<Expander
				title={t.source.secretBox}
				details={t.descriptions.source.secretBox}
				selectInfo={ytpEnabled && t.descriptions.source.secretBox.ytpEnabled}
				disabled={ytpEnabled}
				icon="dice"
				checkInfo={secretBoxEnabled ? t.on : t.off}
				alwaysShowCheckInfo
			>
				<ToggleSwitch on={secretBoxLimitToSelected} details={t.descriptions.source.secretBox.limitToSelected} icon="video_clip_multiple_checkmark">{t.source.secretBox.limitToSelected}</ToggleSwitch>
				<ToggleSwitch on={secretBoxForTrack} details={t.descriptions.source.secretBox.track} icon="layer">{t.source.secretBox.track}</ToggleSwitch>
				<ToggleSwitch on={secretBoxForMarker} details={t.descriptions.source.secretBox.marker} icon="marker">{t.source.secretBox.marker}</ToggleSwitch>
				<ToggleSwitch on={secretBoxForBarOrBeat} details={t.descriptions.source.secretBox.barOrBeat} icon="music_bar">{t.source.secretBox.barOrBeat}</ToggleSwitch>
				<Attrs disabled={!secretBoxForBarOrBeat[0]}>
					<Expander.Item title={t.source.secretBox.barOrBeat.period} details={t.descriptions.source.secretBox.barOrBeat.period} icon="timer">
						<TextBox.NumberUnit value={secretBoxForBarOrBeatPeriod} units={barOrBeatUnitTypes} unitNames={count => barOrBeatUnitNames(count)} decimalPlaces={0} min={1} />
					</Expander.Item>
					<Expander.Item title={t.source.secretBox.barOrBeat.preparation} details={t.descriptions.source.secretBox.barOrBeat.preparation} icon="hourglass">
						<TextBox.NumberUnit value={secretBoxForBarOrBeatPreparation} units={barOrBeatUnitTypes} unitNames={count => barOrBeatUnitNames(count)} decimalPlaces={0} min={0} />
					</Expander.Item>
				</Attrs>
			</Expander>

			<SettingsCardToggleSwitch
				title={t.source.consonant}
				details={t.descriptions.source.consonant}
				icon="consonant"
				on={consonant}
				lock={ytpEnabled || secretBoxEnabled ? false : manualEnabled ? true : null}
				selectInfo={withObject(t.descriptions.source.consonant, t => ytpEnabled ? t.ytpEnabled : secretBoxEnabled ? t.secretBoxEnabled : manualEnabled ? t.manualEnabled : undefined)}
				selectValid={!(ytpEnabled || secretBoxEnabled)}
			/>

			<DragToImport>{t.titles.source}</DragToImport>
		</div>
	);
}
