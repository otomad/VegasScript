import exampleThumbnail from "assets/images/ヨハネの氷.png";

export /* @internal */ const trackLegatoModes = ["stacking", "stackingAllAfter", "stackingAllTracks", "limitStretch", "stretch", "lengthen", "increaseSpacing", "increaseSpacingAllTracks"] as const;

const StyledDeactivateButton = styled(Button).attrs({
	icon: "arrow_reset",
	accent: true,
})`
	&.hidden {
		scale: 0.9;
		opacity: 0;
		content-visibility: hidden;
		pointer-events: none;
		transition-behavior: allow-discrete;
	}
`;

const DeactivateButton = ({ activated: [activated, setActivated] }: { activated: StatePropertyNonNull<boolean> }) => (
	<Tooltip placement="y" title={t.descriptions.track.deactivate}>
		<StyledDeactivateButton
			className={{ hidden: !activated }}
			tabIndex={activated ? 0 : -1}
			onClick={() => setActivated(false)}
		>
			{t.track.deactivate}
		</StyledDeactivateButton>
	</Tooltip>
);

export default function Track() {
	const { pushPage } = useSnapshot(pageStore);
	const [layoutEnabled, layoutEnabledCount, deactivateAll] = useLayoutEnabled();
	const { mode: legatoMode, increaseSpacing, forClips: legatoForClips, includeGroup: legatoIncludeGroup, backwards: legatoBackwards } = useSelectConfig(c => c.track.legato);

	useEffect(() => {
		if (!legatoForClips[0] && legatoMode[0] === "stackingAllAfter") legatoMode[1]("stacking");
	}, [legatoMode[0], legatoForClips[0]]);

	return (
		<div className="container">
			<SettingsPageControl image={(<PreviewLayout thumbnail={exampleThumbnail} />)} learnMoreLink="">{t.descriptions.track}</SettingsPageControl>

			<Subheader>{t.track.layout}</Subheader>
			<SettingsCard
				title={t.titles.grid}
				type="button"
				icon="grid"
				onClick={() => pushPage("grid")}
			>
				<DeactivateButton activated={layoutEnabled.grid} />
			</SettingsCard>
			<SettingsCard
				title={t.titles.box3d}
				type="button"
				icon="cube"
				onClick={() => pushPage("box-3d")}
			>
				<DeactivateButton activated={layoutEnabled.box3d} />
			</SettingsCard>
			<SettingsCard
				title={t.titles.gradient}
				details={t.descriptions.track.gradient}
				type="button"
				icon="highlight"
				onClick={() => pushPage("gradient")}
			>
				<DeactivateButton activated={layoutEnabled.gradient} />
			</SettingsCard>

			<div>
				<Button icon="arrow_reset" disabled={layoutEnabledCount === 0} onClick={deactivateAll}>{t.track.deactivateAll}</Button>
			</div>

			<Subheader>{t.stream.legato}</Subheader>
			<Expander title={t.track.legato} details={t.descriptions.track.legato} icon="legato">
				<ItemsView view="grid" current={legatoMode} itemWidth={320} key={String(legatoForClips[0])}>
					{/* When `legatoForClips` change, re-render the entire component to avoid the animation of the newly added item being out of sync with other items. */}
					{trackLegatoModes.map(mode => {
						if (mode === "stackingAllAfter" && !legatoForClips[0]) return;
						const displayMode = mode === "stacking" && legatoForClips[0] ? "stackingSelected" : mode;
						const { legato } = t.track;
						const multiline = legato[displayMode].toString().split("\n");
						return (
							<ItemsView.Item
								id={mode}
								key={mode}
								details={multiline[1]}
								image={<PreviewTrackLegato mode={mode} />}
								withBorder
							>
								{multiline[0]}
							</ItemsView.Item>
						);
					})}
				</ItemsView>
				<ToggleSwitch on={legatoForClips} details={t.descriptions.track.legato.forClips} icon="track_event">{t.track.legato.forClips}</ToggleSwitch>
				<ToggleSwitch on={legatoIncludeGroup} details={t.descriptions.track.legato.includeGroup} icon="group">{t.track.legato.includeGroup}</ToggleSwitch>
				<ToggleSwitch on={legatoBackwards} details={t.descriptions.track.legato.backwards} icon="arrow_reply">{t.track.legato.backwards}</ToggleSwitch>
				<Expander.Item
					title={t.track.legato.increaseSpacing.toString().split("\n")[0]}
					details={t.descriptions.track.legato.increaseSpacing}
					disabled={!legatoMode[0].in("increaseSpacing", "increaseSpacingAllTracks")}
					icon="increase_spacing"
				>
					<TimecodeBox value={increaseSpacing} />
				</Expander.Item>
				<Expander.ChildWrapper>
					<Button icon="checkmark">{t.apply}</Button>
				</Expander.ChildWrapper>
			</Expander>

			<Subheader>{t.track.clear}</Subheader>
			<div>
				<Button icon="clear_motion" accent="critical">{t.track.clear.motion}</Button>
				<Button icon="clear_plugin" accent="critical">{t.track.clear.effect}</Button>
			</div>
		</div>
	);
}

function useLayoutEnabled() {
	const enabled = {
		grid: useSelectConfig(c => c.track.grid).enabled,
		box3d: useSelectConfig(c => c.track.box3d).enabled,
		gradient: useSelectConfig(c => c.track.gradient).enabled,
	};
	const states = Object.values(enabled);
	const count = states.filter(state => state[0]).length;
	const deactivateAll = () => states.forEach(state => state[1](false));
	return [enabled, count, deactivateAll] as const;
}
