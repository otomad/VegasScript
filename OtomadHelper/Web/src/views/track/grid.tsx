import exampleThumbnail from "assets/images/ヨハネの氷.png";

export /* @internal */ const arrayTypes = ["square", "fixed"] as const;
export /* @internal */ const directionTypes = ["lr-tb", "tb-lr", "rl-tb", "tb-rl"] as const;
export /* @internal */ const fitTypes = ["cover", "contain"] as const;
export /* @internal */ const parityTypes = ["unflipped", "even", "odd", "odd_checker", "even_checker"] as const;
type GridParityType = typeof parityTypes[number];
const isCheckerParities = (parity: GridParityType): parity is "odd_checker" | "even_checker" => parity.endsWith("_checker");

const PreviewGridContainer = styled.div`
	${styles.mixins.square("100%")};
	${styles.mixins.gridCenter()};
	container: preview-grid-container / size;
`;

const PreviewGrid = styled.div`
	display: grid;
	align-self: center;
	width: min(100cqw, calc(100cqh / 9 * 16));
	height: min(100cqh, calc(100cqw / 16 * 9));
	overflow: clip;
	border-radius: 6px;
	outline: 1px solid ${c("stroke-color-surface-stroke-flyout")};
	box-shadow: 0 4px 8px ${c("shadows-flyout")};
	transition: ${fallbackTransitions}, --grid-template-count ${eases.easeOutMax} 250ms;

	&.column {
		grid-auto-flow: row;
		grid-template-columns: repeat(var(--grid-template-count), 1fr);
	}

	&.row {
		grid-auto-flow: column;
		grid-template-rows: repeat(var(--grid-template-count), 1fr);
	}

	[role="img"] {
		${styles.mixins.square("100%")};
		min-height: 0;
		padding: var(--padding, 0);
		object-fit: var(--fit);
		background-image: url("${exampleThumbnail}");
		background-repeat: no-repeat;
		background-position: center;
		background-size: var(--fit);

		&.h-flip {
			scale: -1 1;
		}

		&.v-flip {
			scale: 1 -1;
		}

		&.h-flip.v-flip {
			scale: -1 -1;
		}

		&:active {
			animation: ${keyframes`
				from {
					box-shadow: 0 0
				}
			`} duration timing-function delay iteration-count direction fill-mode;
		}
	}

	&:has([role="img"]:hover) [role="img"]:not(:hover) {
		opacity: 0.75;
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
	const { columns: [columns, _setColumns], rows: [rows, _setRows], array, direction, fit, mirrorEdgesHFlip, mirrorEdgesVFlip, descending: [descending, setDescending], padding } = selectConfig(c => c.track.grid);
	const count = 25;
	const autoRows = Math.ceil(count / columns), autoColumns = Math.ceil(count / rows);
	const radicand = Math.ceil(Math.sqrt(count));
	const horizontalDirection = direction[0].endsWith("tb"), verticalDirection = direction[0].startsWith("tb"), rtlDirection = direction[0].includes("rl");
	const square = array[0] === "square", fixedColumns = array[0] === "fixed" && horizontalDirection, fixedRows = array[0] === "fixed" && verticalDirection;
	const columnReadonly = square || fixedRows, rowReadonly = square || fixedColumns;
	const order = useMemo(() => descending ? "descending" : "ascending", [descending]);
	const id = useUniqueId("grid-view"), fieldAnchorName = "--" + id + "-field";
	const [fastFillShown, setFastFillShown] = useState(false);
	const columnInputRef = useDomRef<"input">(), rowInputRef = useDomRef<"input">();

	pageStore.useOnSave(() => configStore.track.grid.enabled = true);

	const setColumns = setStateInterceptor(_setColumns, input => clamp(input, 1, 100));
	const setRows = setStateInterceptor(_setRows, input => clamp(input, 1, 100));
	const getMirrorEdgesText = (parity: GridParityType, direction: "hFlip" | "vFlip") =>
		parity === "unflipped" ? t.track.grid.mirrorEdges.unflipped :
		isCheckerParities(parity) ? t.track.grid.mirrorEdges.checkerboard + " — " + t.track.grid.mirrorEdges.checkerboard[parity.replaceEnd("_checker")].toString().replaceAll("-", "‑") :
		t.track.grid.mirrorEdges[direction][parity];
	const getMirrorEdgesIcon = (parity: GridParityType, field: "column" | "row"): DeclaredIcons =>
		parity === "unflipped" ? "prohibited" : isCheckerParities(parity) ? `parity_${parity}` : `parity_${parity}_${field}s`;

	return (
		<>
			<div className="container-preview">
				<CommandBar.Group>
					<CommandBar position="right" autoCollapse>
						<CommandBar.Item
							icon={square ? "grid" : "grid_kanban_vertical"}
							caption={t.track.grid.array}
							hovering
							dirBasedIcon={!square && direction[0]}
							onClick={() => array[1](array => arrayTypes.nextItem(array))}
						>
							<ItemsView view="list" current={array}>
								{arrayTypes.map(option => (
									<ItemsView.Item
										id={option}
										key={option}
										icon={option === "square" ? "grid" : "grid_kanban_vertical"}
										dirBasedIcon={direction[0]}
										details={t.descriptions.track.grid[option === "square" ? option : horizontalDirection ? "fixedColumns" : "fixedRows"]}
									>
										{t.track.grid[option === "square" ? option : horizontalDirection ? "fixedColumns" : "fixedRows"]}
									</ItemsView.Item>
								))}
							</ItemsView>
						</CommandBar.Item>
						<CommandBar.Item
							icon="lr_tb"
							caption={t.track.grid.direction}
							hovering
							dirBasedIcon={direction[0]}
							onClick={() => direction[1](direction => directionTypes.nextItem(direction))}
						>
							<ItemsView view="list" current={direction}>
								{directionTypes.map(option => (
									<ItemsView.Item
										id={option}
										key={option}
										icon="lr_tb"
										dirBasedIcon={option}
										details={t.descriptions.track.grid.direction[new VariableName(option).camel]}
									>
										{t.track.grid.direction[new VariableName(option).camel]}
									</ItemsView.Item>
								))}
							</ItemsView>
						</CommandBar.Item>
						<CommandBar.Item icon={fit[0] === "contain" ? "letterbox" : "aspect_ratio"} caption={t.track.grid.fit} details={t.descriptions.track.grid.fit} hovering onClick={() => fit[1](fit => fitTypes.nextItem(fit))}>
							<ItemsView view="list" current={fit}>
								{fitTypes.map(option => (
									<ItemsView.Item
										id={option}
										key={option}
										icon={option === "contain" ? "letterbox" : "aspect_ratio"}
										details={t.descriptions.track.grid.fit[option]}
									>
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
						style={{
							"--grid-template-count": Math.min(square ? radicand : fixedColumns ? columns : rows, count),
							"--padding": padding[0] + "px",
							"--fit": fit[0],
						}}
						className={fixedRows ? "row" : "column"}
						role="figure"
						aria-label={t.preview}
						dir={rtlDirection ? "rtl" : "ltr"}
					>
						{forMap(count, i => {
							const divisor = square ? radicand : columns;
							const column = i % divisor, row = i / divisor | 0;
							return (
								<div
									key={i}
									className={[{
										hFlip:
											mirrorEdgesHFlip[0] === "even" && column % 2 === 1 ||
											mirrorEdgesHFlip[0] === "odd" && column % 2 === 0 ||
											mirrorEdgesHFlip[0] === "odd_checker" && (column + row) % 2 === 1 ||
											mirrorEdgesHFlip[0] === "even_checker" && (column + row) % 2 === 0,
										vFlip:
											mirrorEdgesVFlip[0] === "even" && row % 2 === 1 ||
											mirrorEdgesVFlip[0] === "odd" && row % 2 === 0 ||
											mirrorEdgesVFlip[0] === "odd_checker" && (column + row) % 2 === 1 ||
											mirrorEdgesVFlip[0] === "even_checker" && (column + row) % 2 === 0,
									}]}
									role="img"
									aria-label={t.descriptions.track.grid.previewAria({ columnIndex: column + 1, rowIndex: row + 1, columnCount: columns, rowCount: rows })}
									onMouseDown={e => e.button === 2 && makeFocusDiffusionEffect(e)}
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
						{["column", "x", "row"].map(key => {
							if (key === "x") return <label key={key} className="multiply">×</label>;
							const isColumn = key === "column", ref = isColumn ? columnInputRef : rowInputRef, readonly = isColumn ? columnReadonly : rowReadonly;
							return (
								<EventInjector
									key={key}
									onFocusIn={() => { if (!readonly) { setFastFillShown(true); ref.current?.focus(); } }}
									onFocusOut={() => setFastFillShown(false)}
								>
									<TextBox.Number
										id={id + "-" + key}
										value={
											square ? [radicand] :
											isColumn ?
												columnReadonly ? [autoColumns] : [columns, setColumns] :
												rowReadonly ? [autoRows] : [rows, setRows]
										}
										min={1}
										max={100}
										readOnly={readonly}
										style={readonly ? undefined : { anchorName: fieldAnchorName }}
										inputRef={ref}
									/>
								</EventInjector>
							);
						})}
					</div>
					<div>
						<div />
						<label htmlFor={id + "-padding"}>{t(padding[0]).track.grid.padding}</label>
						<label className="multiply shadow" />
						<Tooltip title={t.descriptions.track.grid.padding} placement="top" offset={TOOLTIP_OFFSET} unwrapped={false}>
							<TextBox.Number
								id={id + "-padding"}
								value={padding}
								min={0}
								max={50}
								defaultValue={0}
								suffix={t.units.densityIndependentPixel}
							/>
						</Tooltip>
					</div>
				</Determinant>
			</div>

			<Portal>
				<Flyout
					anchorName={fieldAnchorName}
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
							value={fixedRows ? [rows, setRows] : [columns, setColumns]}
							getInputRef={() => [columnInputRef, rowInputRef].find(el => el.current?.readOnly === false)}
							options={[
								{ id: "min", value: 1 },
								{ id: "max", value: 100 },
								{ id: "square", value: radicand },
								{ id: "numberOfSelectedTracks", value: count },
								{ id: "transpose", value: rows, unselected: true },
							]}
						/>
					</div>
				</Flyout>
			</Portal>
		</>
	);
}

function FastFillOptions({ value: [currentValue, setCurrentValue], options, getInputRef }: {
	value: StatePropertyNonNull<number>;
	options: { id: string; value: number; unselected?: boolean }[];
	getInputRef(): MaybeRef<HTMLInputElement | undefined | null>;
}) {
	const focus = () => toValue(getInputRef())?.focus();
	return options.map(({ id, value, unselected }) => (
		<ToggleButton
			key={id}
			tabIndex={-1}
			checked={[!(unselected || !(currentValue === value))]}
			minWidthUnbounded
			onPointerDown={() => { setCurrentValue(value); focus(); }}
			onPointerUp={focus}
		>
			{t.track.grid[id]}
		</ToggleButton>
	));
}
