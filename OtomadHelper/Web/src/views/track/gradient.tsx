import exampleThumbnail from "assets/images/ヨハネの氷.png";
import { directionTypes, getParityIcon, parityTypes } from "./grid";

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
	const {
		enabled: enableGridIntegration, columns, autoColumns, direction,
		mirrorEdgesHFlip, mirrorEdgesVFlip, // H = Horizontal = Hue, V = Vertical = Value
	} = useSelectConfig(c => c.track.gradient.gridIntegration);
	pageStore.useOnSave(() => configStore.track.gradient.enabled = true);
	const order = useMemo(() => descending ? "descending" : "ascending", [descending]);
	const [showGridIntegration, setShowGridIntegration] = useState(false);

	return (
		<div className="container" style={{ marginBlockStart: 0 }}>
			<CommandBar.Group>
				<CommandBar position="right">
					<CommandBar.Item icon={order} caption={t[order]} details={t.descriptions.track.descending} onClick={() => setDescending(desc => !desc)} />
					<CommandBar.Item icon="grid" altCaption={t.titles.grid} caption={t.track.gradient.gridIntegration} details={t.descriptions.track.gradient.gridIntegration} onClick={() => setShowGridIntegration(true)} />
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
				title={t.track.gradient.gridIntegration}
				shown={[showGridIntegration, setShowGridIntegration]}
				width={1000}
			>
				<div className="container">
					<SettingsCardToggleSwitch on={enableGridIntegration} icon="enabled" title={t.enabled} />
					<EmptyMessage.Typical icon="grid" name={t.track.gradient.gridIntegration} enabled={enableGridIntegration}>
						<SettingsCard icon="columns" title={t({ context: "full" }).track.grid.column}>
							<TextBox.Number value={columns} min={1} max={100} />
						</SettingsCard>
						<SettingsCardToggleSwitch on={autoColumns} icon="checkmark" title="Set it automatically when generating" />
						<Subheader>{t.subheaders.parameters}</Subheader>
						<ExpanderRadio
							title={t.track.grid.direction}
							items={directionTypes}
							value={direction}
							view="tile"
							idField
							nameField={dir => t.track.grid.direction[new VariableName(dir).camel]}
							checkInfoCondition={dir => t.track.grid.direction[new VariableName(dir!).camel]}
							icon="lr_tb"
							iconField={() => "lr_tb"}
							dirBasedIcon={direction[0]}
							itemsViewItemAttrs={dir => ({ dirBasedIcon: dir })}
						/>
						<Subheader>{t.track.gradient.group.gradually}</Subheader>
						<Subheader>{t.track.gradient.group.alternately}</Subheader>
						<ExpanderRadio
							title={t.track.grid.mirrorEdges}
							items={parityTypes}
							value={mirrorEdgesHFlip}
							iconField={parity => getParityIcon(parity, "column")}
							view="tile"
							idField
							nameField={t.track.grid.mirrorEdges}
						/>
					</EmptyMessage.Typical>
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
