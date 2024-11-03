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
			<Expander title={t.view} icon="grid">
				<ToggleSwitch on={viewOverlay}>{t.track.gradient.view.overlay}</ToggleSwitch>
				<ToggleSwitch on={viewSquare}>{t.track.grid.square}</ToggleSwitch>
				<ToggleSwitch on={viewMirrorEdges} lock={viewOverlay[0] ? false : null}>{t.track.grid.mirrorEdges}</ToggleSwitch>
				<Expander.Item title={t.size}>
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
			<SettingsCardToggleSwitch on={descending} title={t.descending} icon="descending" />

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
