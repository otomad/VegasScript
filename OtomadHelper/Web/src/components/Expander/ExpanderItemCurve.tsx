const curves = ["linear", "fast", "slow", "smooth", "sharp", "hold"] as const; // TODO: i18n

export /* @internal */ default function ExpanderItemCurve({ curve }: FCP<{
	curve: StateProperty<CurveType>;
	children?: never;
}, "div">) {
	return (
		<Expander.Item title={t.curve} details={t.descriptions.curve} icon="curve">
			<ComboBox ids={curves} options={curves} icons={curves.map(curve => `curves/${curve}` as const)} current={curve} />
		</Expander.Item>
	);
}
