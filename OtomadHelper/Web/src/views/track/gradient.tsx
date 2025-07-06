import exampleThumbnail from "assets/images/ヨハネの氷.png";

const gradients = [
	{ group: "gradually", items: ["rainbow", "graSaturated", "graContrasted", "threshold"] },
	{ group: "alternately", items: ["altChromatic", "altNegative", "altLuminInvert", "altHueInvert", "rotInvert"] },
];

const DEFAULT_ITEM_WIDTH = 325;

export default function Gradient() {
	const {
		effect, descending: [descending, setDescending],
		viewOverlay, viewSquare, viewMirrorEdges, viewSize,
	} = useSelectConfig(c => c.track.gradient);
	pageStore.useOnSave(() => configStore.track.gradient.enabled = true);
	const order = useMemo(() => descending ? "descending" : "ascending", [descending]);
	const [showGridIntegration, setShowGridIntegration] = useState(false);

	return (
		<div className="container" style={{ marginBlockStart: 0 }}>
			<CommandBar.Group>
				<CommandBar position="right">
					<CommandBar.Item icon={order} caption={t[order]} details={t.descriptions.track.descending} onClick={() => setDescending(desc => !desc)} />
					<CommandBar.Item icon="grid" caption={t.titles.grid} details={t.descriptions.track.gradient.grid} onClick={() => setShowGridIntegration(true)} />
					<hr />
					<CommandBar.Item iconOnly icon="extra_large_icons" caption={t.view} details={t.descriptions.track.view}>
						<ToggleSwitch on={viewOverlay} icon="photo_filter">{t.track.gradient.view.overlay}</ToggleSwitch>
						<ToggleSwitch on={viewSquare} icon="grid">{t.track.grid.square}</ToggleSwitch>
						<ToggleSwitch on={viewMirrorEdges} icon="image_reflection" lock={viewOverlay[0] ? false : null}>{t.track.grid.mirrorEdges}</ToggleSwitch>
						<Flyout.Item icon="resize" title={t.size} />
						<Flyout.Item style={{ paddingBlockStart: "4px" }}>
							<Slider
								value={viewSize}
								min={200}
								max={487}
								step={1}
								defaultValue={DEFAULT_ITEM_WIDTH}
								displayValue
							/>
						</Flyout.Item>
					</CommandBar.Item>
				</CommandBar>
			</CommandBar.Group>

			<ContentDialog
				title={t.track.gradient.grid}
				shown={[showGridIntegration, setShowGridIntegration]}
				width={1000}
			>
				<div className="container">
					<SettingsCard icon="parity_odd_columns" title={t.track.grid.column}>
						<TextBox.Number value={[0]} />
					</SettingsCard>
					<SettingsCardToggleSwitch on={[true]} icon="checkmark" title="Set automatically when generating" />
				</div>
			</ContentDialog>

			{gradients.map(({ group, items }) => (
				<Fragment key={group}>
					<ItemsView view="grid" current={effect} itemWidth={viewSize[0]}>
						<Subheader>{t.track.gradient.group[group]}</Subheader>
						{items.map(id => (
							<ItemsView.Item
								key={id}
								id={id}
								image={(
									<PreviewGradient
										thumbnail={exampleThumbnail}
										square={viewSquare[0]}
										mirrorEdges={viewMirrorEdges[0]}
										overlay={viewOverlay[0]}
										effect={id}
										descending={descending}
									/>
								)}
							>
								{t.track.gradient.effects[id]}
							</ItemsView.Item>
						))}
					</ItemsView>
				</Fragment>
			))}
		</div>
	);
}
