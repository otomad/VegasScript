import exampleThumbnail from "assets/images/ヨハネの氷.png";

const gradients = ["rainbow", "graduallySaturated", "graduallyContrasted", "threshold", "alternatelyChromatic", "alternatelyNegative"];

const DEFAULT_ITEM_WIDTH = 325;

export default function Gradient() {
	const {
		effect, descending,
		viewOverlay, viewSquare, viewMirrorEdges, viewSize,
	} = selectConfig(c => c.track.gradient);

	pageStore.useOnSave(() => configStore.track.gradient.enabled = true);

	return (
		<div className="container">
			<Expander title={t.view} icon="apps_list" details={t.descriptions.track.view}>
				<ToggleSwitch on={viewOverlay} icon="photo_filter">{t.track.gradient.view.overlay}</ToggleSwitch>
				<ToggleSwitch on={viewSquare} icon="grid">{t.track.grid.square}</ToggleSwitch>
				<ToggleSwitch on={viewMirrorEdges} icon="image_reflection" lock={viewOverlay[0] ? false : null}>{t.track.grid.mirrorEdges}</ToggleSwitch>
				<Expander.Item title={t.size} icon="resize">
					<Slider
						value={viewSize}
						min={200}
						max={487}
						step={1}
						defaultValue={DEFAULT_ITEM_WIDTH}
						displayValue
					/>
				</Expander.Item>
			</Expander>
			<SettingsCardToggleSwitch on={descending} title={t.descending} icon="descending" details={t.descriptions.track.descending} />

			<ItemsView view="grid" current={effect} $itemWidth={viewSize[0]}>
				{gradients.map(id => (
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
								descending={descending[0]}
							/>
						)}
					>
						{t.track.gradient.effects[id]}
					</ItemsView.Item>
				))}
			</ItemsView>
		</div>
	);
}
