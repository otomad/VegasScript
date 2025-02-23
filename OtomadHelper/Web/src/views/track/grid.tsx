import exampleThumbnail from "assets/images/ヨハネの氷.png";

export /* @internal */ const arrayTypes = ["square", "custom"] as const;
export /* @internal */ const fitTypes = ["cover", "contain"] as const;
export /* @internal */ const parityTypes = ["unflipped", "even", "odd"] as const;

type GridParityType = typeof parityTypes[number];

const PreviewGridContainer = styled.div`
	${styles.mixins.square("100%")};
	${styles.mixins.gridCenter()};
	container: preview-grid-container / size;
`;

const PreviewGrid = styled.div<{
	$fit: typeof fitTypes[number];
}>`
	display: grid;
	grid-template-columns: repeat(var(--grid-template-count), 1fr);
	align-self: center;
	width: min(100cqw, calc(100cqh / 9 * 16));
	height: min(100cqh, calc(100cqw / 16 * 9));
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
	margin-block: 4px 16px;

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
	const { columns: [columns, _setColumns], array, fit, mirrorEdgesHFlip, mirrorEdgesVFlip, descending: [descending, setDescending], padding } = selectConfig(c => c.track.grid);
	const count = 25;
	const rows = Math.ceil(count / columns);
	const radicand = Math.ceil(Math.sqrt(count));
	const square = array[0] === "square";
	const order = useMemo(() => descending ? "descending" : "ascending", [descending]);

	pageStore.useOnSave(() => configStore.track.grid.enabled = true);

	const setColumns = setStateInterceptor(_setColumns, input => clamp(input, 1, 100));

	const getMirrorEdgesText = (parity: GridParityType, direction: "hFlip" | "vFlip") =>
		parity === "unflipped" ? t.track.grid.mirrorEdges.unflipped : t.track.grid.mirrorEdges[direction][parity];
	const getMirrorEdgesIcon = (parity: GridParityType, field: "column" | "row"): DeclaredIcons =>
		parity === "unflipped" ? "prohibited" : `parity_${parity}_${field}s`;

	return (
		<>
			<div className="container-preview">
				<CommandBar.Group>
					<CommandBar position="right" autoCollapse>
						<CommandBar.Item icon={array[0] === "square" ? "grid" : "grid_kanban_vertical"} caption={t.track.grid.array} hovering onClick={() => array[1](array => array === "square" ? "custom" : "square")}>
							<ItemsView view="list" current={array}>
								{arrayTypes.map(option => (
									<ItemsView.Item id={option} key={option} icon={option === "square" ? "grid" : "grid_kanban_vertical"} details={t.descriptions.track.grid[option]}>
										{option === "square" ? t.track.grid.square : t.custom}
									</ItemsView.Item>
								))}
							</ItemsView>
						</CommandBar.Item>
						<CommandBar.Item icon={fit[0] === "contain" ? "letterbox" : "aspect_ratio"} caption={t.track.grid.fit} details={t.descriptions.track.grid.fit} hovering onClick={() => fit[1](fit => fit === "cover" ? "contain" : "cover")}>
							<ItemsView view="list" current={fit}>
								{fitTypes.map(option => (
									<ItemsView.Item id={option} key={option} icon={option === "contain" ? "letterbox" : "aspect_ratio"} details={t.descriptions.track.grid.fit[option]}>
										{t.track.grid.fit[option]}
									</ItemsView.Item>
								))}
							</ItemsView>
						</CommandBar.Item>
						<CommandBar.Item icon={order} caption={t[order]} details={t.descriptions.track.descending} onClick={() => setDescending(desc => !desc)} />
						<hr />
						<CommandBar.Item icon="flip_h" caption={t.track.grid.mirrorEdges + " - " + t.prve.effects.hFlip} altCaption={t.prve.effects.hFlip} details={t.descriptions.track.grid.mirrorEdges.hFlip} hovering>
							<ItemsView view="list" current={mirrorEdgesHFlip}>
								{parityTypes.map(option => <ItemsView.Item id={option} key={option} icon={getMirrorEdgesIcon(option, "column")}>{getMirrorEdgesText(option, "hFlip")}</ItemsView.Item>)}
							</ItemsView>
						</CommandBar.Item>
						<CommandBar.Item icon="flip_v" caption={t.track.grid.mirrorEdges + " - " + t.prve.effects.vFlip} altCaption={t.prve.effects.vFlip} details={t.descriptions.track.grid.mirrorEdges.vFlip} hovering>
							<ItemsView view="list" current={mirrorEdgesVFlip}>
								{parityTypes.map(option => <ItemsView.Item id={option} key={option} icon={getMirrorEdgesIcon(option, "row")}>{getMirrorEdgesText(option, "vFlip")}</ItemsView.Item>)}
							</ItemsView>
						</CommandBar.Item>
					</CommandBar>
				</CommandBar.Group>

				<PreviewGridContainer>
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
				</PreviewGridContainer>

				<Determinant>
					<p>{t(square ? radicand : columns).track.grid.column}</p>
					<p />
					<p>{t(square ? radicand : rows).track.grid.row}</p>
					<TextBox.Number value={square ? [radicand] : [columns, setColumns]} min={1} max={100} readOnly={square} />
					<p className="multiply">×</p>
					<TextBox.Number value={[rows]} min={1} max={100} readOnly />
				</Determinant>

				{/* <SettingsCard title={t.track.grid.fastFill} icon="edit_lightning" disabled={square} appearance="secondary">
					<Disabled as={StackPanel} $gap={4}>
						<Button subtle minWidthUnbounded accent onPointerDown={() => setColumns(1)}>{t.track.grid.min}</Button>
						<Button subtle minWidthUnbounded accent onPointerDown={() => setColumns(100)}>{t.track.grid.max}</Button>
						<Button subtle minWidthUnbounded accent onPointerDown={() => setColumns(radicand)}>{t.track.grid.square}</Button>
						<Button subtle minWidthUnbounded accent onPointerDown={() => setColumns(rows)}>{t.track.grid.transpose}</Button>
						<Button subtle minWidthUnbounded accent onPointerDown={() => setColumns(count)}>{t.track.grid.numberOfSelectedTracks}</Button>
					</Disabled>
				</SettingsCard>

				<SettingsCard title={t.track.grid.padding} icon="image_border" details={t.descriptions.track.grid.padding}>
					<TextBox.Number value={padding} min={0} max={50} defaultValue={0} suffix={t.units.densityIndependentPixel} />
				</SettingsCard>
				<SettingsCardToggleSwitch on={descending} title={t.descending} icon="descending" details={t.descriptions.track.descending} /> */}
			</div>
		</>
	);
}
