import exampleThumbnail from "assets/images/ヨハネの氷.png";

export /* @internal */ const arrayTypes = ["square", "custom"] as const;
export /* @internal */ const fitTypes = ["cover", "contain"] as const;
export /* @internal */ const parityTypes = ["unflipped", "odd", "even"] as const;

type GridParityType = typeof parityTypes[number];

const PreviewGrid = styled.div<{
	$fit: typeof fitTypes[number];
}>`
	display: grid;
	grid-template-columns: repeat(var(--grid-template-count), 1fr);
	align-self: center;
	width: calc(30cqh / 9 * 16);
	height: 30cqh;
	margin-block-end: 16px;
	transition: ${fallbackTransitions}, --grid-template-count ${eases.easeOutMax} 250ms;

	img {
		${styles.mixins.square("100%")};
		min-height: 0;
		padding: var(--padding, 0);
		object-fit: ${styledProp("$fit")};

		&.h-flip {
			scale: -1 1;
		}

		&.v-flip {
			scale: 1 -1;
		}

		&.h-flip.v-flip {
			scale: -1 -1;
		}
	}
`;

const Determinant = styled.div`
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	gap: 6px;
	align-self: center;

	p {
		align-content: center;
	}

	.multiply {
		padding-block-end: 3px;
	}

	.text-box {
		inline-size: 200px;
	}
`;

export default function Grid() {
	const { columns: [columns, _setColumns], array, fit, mirrorEdgesHFlip, mirrorEdgesVFlip, descending, padding } = selectConfig(c => c.track.grid);
	const count = 25;
	const rows = Math.ceil(count / columns);
	const radicand = Math.ceil(Math.sqrt(count));
	const square = array[0] === "square";

	pageStore.useOnSave(() => configStore.track.grid.enabled = true);

	const setColumns = setStateInterceptor(_setColumns, input => clamp(input, 1, 100));

	const getMirrorEdgesText = (parity: GridParityType, direction: "hFlip" | "vFlip") =>
		parity === "unflipped" ? t.track.grid.mirrorEdges.unflipped : t.track.grid.mirrorEdges[direction][parity];
	const getMirrorEdgesIcon = (parity: GridParityType, field: "column" | "row"): DeclaredIcons =>
		parity === "unflipped" ? "prohibited" : `parity_${parity}_${field}s`;

	return (
		<>
			<div className="container">
				<PreviewGrid
					$fit={fit[0]}
					style={{
						"--grid-template-count": Math.min(square ? radicand : columns, count),
						"--padding": padding[0] + "px",
					}}
				>
					{forMap(count, i => {
						const divisor = square ? radicand : rows;
						const row = i % divisor, column = i / divisor | 0;
						return (
							<img
								key={i}
								className={{
									hFlip: mirrorEdgesHFlip[0] === "even" && row % 2 === 1 || mirrorEdgesHFlip[0] === "odd" && row % 2 === 0,
									vFlip: mirrorEdgesVFlip[0] === "even" && column % 2 === 1 || mirrorEdgesVFlip[0] === "odd" && column % 2 === 0,
								}}
								src={exampleThumbnail}
							/>
						);
					})}
				</PreviewGrid>

				<Determinant>
					<p>{t(square ? radicand : columns).track.grid.column}</p>
					<p />
					<p>{t(square ? radicand : rows).track.grid.row}</p>
					<TextBox.Number value={square ? [radicand] : [columns, setColumns]} min={1} max={100} readOnly={square} />
					<p className="multiply">×</p>
					<TextBox.Number value={[rows]} min={1} max={100} readOnly />
				</Determinant>

				<SettingsCard title={t.track.grid.fastFill} icon="edit_sparkle" disabled={square} appearance="secondary">
					<Disabled as={StackPanel} $gap={4}>
						<Button subtle minWidthUnbounded accent onPointerDown={() => setColumns(1)}>{t.track.grid.min}</Button>
						<Button subtle minWidthUnbounded accent onPointerDown={() => setColumns(100)}>{t.track.grid.max}</Button>
						<Button subtle minWidthUnbounded accent onPointerDown={() => setColumns(radicand)}>{t.track.grid.square}</Button>
						<Button subtle minWidthUnbounded accent onPointerDown={() => setColumns(rows)}>{t.track.grid.transpose}</Button>
						<Button subtle minWidthUnbounded accent onPointerDown={() => setColumns(count)}>{t.track.grid.numberOfSelectedTracks}</Button>
					</Disabled>
				</SettingsCard>

				<SettingsCard title={t.track.grid.array} icon="grid_kanban_vertical" selectInfo={t.descriptions.track.grid[array[0]]}>
					<Segmented current={array}>
						{arrayTypes.map(option => (
							<Segmented.Item
								id={option}
								key={option}
								icon={option === "square" ? "grid" : "grid_kanban_vertical"}
							>
								{option === "square" ? t.track.grid.square : t.custom}
							</Segmented.Item>
						))}
					</Segmented>
				</SettingsCard>
				<SettingsCard title={t.track.grid.fit} icon="aspect_ratio" details={t.descriptions.track.grid.fit} selectInfo={t.descriptions.track.grid.fit[fit[0]]}>
					<Segmented current={fit}>
						{fitTypes.map(option => (
							<Segmented.Item
								id={option}
								key={option}
								icon={option === "contain" ? "letterbox" : "aspect_ratio"}
							>
								{t.track.grid.fit[option]}
							</Segmented.Item>
						))}
					</Segmented>
				</SettingsCard>
				<SettingsCard title={t.track.grid.padding} icon="image_border" details={t.descriptions.track.grid.padding}>
					<TextBox.Number value={padding} min={0} max={50} defaultValue={0} suffix={t.units.densityIndependentPixel} />
				</SettingsCard>
				<SettingsCardToggleSwitch on={descending} title={t.descending} icon="descending" details={t.descriptions.track.descending} />

				<Subheader>{t.track.grid.mirrorEdges}</Subheader>
				<SettingsCard title={t.prve.effects.hFlip} icon="flip_h" details={t.descriptions.track.grid.mirrorEdges.hFlip}>
					<Segmented current={mirrorEdgesHFlip}>
						{parityTypes.map(option => <Segmented.Item id={option} key={option} icon={getMirrorEdgesIcon(option, "column")}>{getMirrorEdgesText(option, "hFlip")}</Segmented.Item>)}
					</Segmented>
				</SettingsCard>
				<SettingsCard title={t.prve.effects.vFlip} icon="flip_v" details={t.descriptions.track.grid.mirrorEdges.vFlip}>
					<Segmented current={mirrorEdgesVFlip}>
						{parityTypes.map(option => <Segmented.Item id={option} key={option} icon={getMirrorEdgesIcon(option, "row")}>{getMirrorEdgesText(option, "vFlip")}</Segmented.Item>)}
					</Segmented>
				</SettingsCard>
			</div>
		</>
	);
}
