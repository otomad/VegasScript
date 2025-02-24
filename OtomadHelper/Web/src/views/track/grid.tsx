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

const xWidth = "1.25ex";
const Determinant = styled.div`
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	gap: 6px;
	margin-block: 4px 16px;

	> * {
		display: grid;
		gap: inherit;
	}

	> :first-child {
		grid-column: 2;
		grid-template-columns: 1fr ${xWidth} 1fr;
	}

	> :last-child {
		grid-column: 3;
		grid-template-columns: ${xWidth} 1fr;
		margin-inline-start: auto;
	}

	label {
		${styles.effects.text.body};
		align-content: center;
	}

	.multiply {
		${styles.mixins.flexCenter()};
		padding-block-end: 3px;
		inline-size: ${xWidth};

		&.shadow {
			visibility: hidden;
		}
	}

	.text-box {
		inline-size: 200px;
		transition: ${fallbackTransitions}, inline-size 0s;
	}

	@media (width < 750px) {
		grid-template-columns: 1fr ${xWidth} 1fr ${xWidth} 1fr;

		> * {
			display: contents;
		}

		> :first-child {
			${forMapFromTo(1, 3, 1, i => css`> :nth-child(${i - 1 + 4}) { grid-area: 2 / ${i}; }`)}
		}

		.text-box {
			inline-size: unset;
		}
	}
`;

const TOOLTIP_OFFSET = 28;
export default function Grid() {
	const { columns: [columns, _setColumns], array, fit, mirrorEdgesHFlip, mirrorEdgesVFlip, descending: [descending, setDescending], padding } = selectConfig(c => c.track.grid);
	const count = 25;
	const rows = Math.ceil(count / columns);
	const radicand = Math.ceil(Math.sqrt(count));
	const square = array[0] === "square";
	const order = useMemo(() => descending ? "descending" : "ascending", [descending]);
	const id = useUniqueId("grid-view"), columnAnchorName = "--" + id + "-column";
	const [fastFillShown, setFastFillShown] = useState(false);
	const columnReadonly = square;
	const columnInputRef = useDomRef<"input">();

	pageStore.useOnSave(() => configStore.track.grid.enabled = true);

	const setColumns = setStateInterceptor(_setColumns, input => clamp(input, 1, 100));
	const getMirrorEdgesText = (parity: GridParityType, direction: "hFlip" | "vFlip") =>
		parity === "unflipped" ? t.track.grid.mirrorEdges.unflipped : t.track.grid.mirrorEdges[direction][parity];
	const getMirrorEdgesIcon = (parity: GridParityType, field: "column" | "row"): DeclaredIcons =>
		parity === "unflipped" ? "prohibited" : `parity_${parity}_${field}s`;

	const fastFillFlyout = (
		<Flyout
			anchorName={columnAnchorName}
			position="top"
			shown={[fastFillShown, setFastFillShown]}
			autoPadding="xy"
			portal={false}
			hideDelay={50}
			offset={TOOLTIP_OFFSET}
		>
			<Flyout.Item icon="edit_lightning" title={t.track.grid.fastFill} style={{ paddingInlineStart: "12px" }} />
			<div className="items">
				<FastFillOptions
					columns={[columns, setColumns]} inputRef={columnInputRef} options={[
						{ id: "min", value: 1 },
						{ id: "max", value: 100 },
						{ id: "square", value: radicand },
						{ id: "transpose", value: rows, unselected: true },
						{ id: "numberOfSelectedTracks", value: count },
					]}
				/>
			</div>
		</Flyout>
	);

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
					<div>
						<label htmlFor={id + "-column"}>{t(square ? radicand : columns).track.grid.column}</label>
						<div />
						<label htmlFor={id + "-row"}>{t(square ? radicand : rows).track.grid.row}</label>
						<EventInjector onFocusIn={() => !columnReadonly && setFastFillShown(true)} onFocusOut={() => setFastFillShown(false)}>
							<TextBox.Number
								id={id + "-column"} value={square ? [radicand] : [columns, setColumns]} min={1} max={100} readOnly={columnReadonly}
								style={{ anchorName: columnAnchorName }} customFlyout={fastFillFlyout} inputRef={columnInputRef}
							/>
						</EventInjector>
						<label className="multiply">×</label>
						<TextBox.Number id={id + "-row"} value={[rows]} min={1} max={100} readOnly />
					</div>
					<div>
						<div />
						<label htmlFor={id + "-padding"}>{t(padding[0]).track.grid.padding}</label>
						<label className="multiply shadow" />
						<Tooltip title={t.descriptions.track.grid.padding} placement="top" offset={TOOLTIP_OFFSET} unwrapped={false}>
							<TextBox.Number
								id={id + "-padding"} value={padding} min={0} max={50} defaultValue={0}
								suffix={t.units.densityIndependentPixel}
							/>
						</Tooltip>
					</div>
				</Determinant>
			</div>
		</>
	);
}

const StyledFastFillOption = styled(Button)`
	margin: 0 !important;
	padding-block: 0 !important;
	box-shadow: none !important;
`;

function FastFillOptions({ columns: [columns, setColumns], options, inputRef }: {
	columns: StatePropertyNonNull<number>;
	options: { id: string; value: number; unselected?: boolean }[];
	inputRef: RefObject<HTMLInputElement | null>;
}) {
	const focus = () => inputRef?.current?.focus();
	return options.map(({ id, value, unselected }) => (
		<StyledFastFillOption
			key={id}
			subtle={unselected || !(columns === value)}
			minWidthUnbounded
			accent
			onPointerDown={() => { setColumns(value); focus(); }}
			onPointerUp={focus}
		>
			{t.track.grid[id]}
		</StyledFastFillOption>
	));
}
