import exampleThumbnail from "assets/images/ヨハネの氷.png";

export /* @internal */ const arrayTypes = ["square", "fixed"] as const;
export /* @internal */ const directionTypes = ["lr-tb", "tb-lr", "rl-tb", "tb-rl"] as const;
export /* @internal */ const fitTypes = ["cover", "contain"] as const;
export /* @internal */ const parityTypes = ["unflipped", "even", "odd", "odd_checker", "even_checker"] as const;
type GridParityType = typeof parityTypes[number];
const isCheckerParities = (parity: GridParityType): parity is "odd_checker" | "even_checker" => parity.endsWith("_checker");
const MAX_COL_ROW = 100;
const GAP = 6;

const PreviewGridContainer = styled.div`
	${styles.mixins.square("100%")};
	${styles.mixins.gridCenter()};
	container: preview-grid-container / size;
`;

const PreviewGrid = styled.div`
	${styles.effects.flyout};
	display: grid;
	align-self: center;
	width: min(100cqw, calc(100cqh / 9 * 16));
	height: min(100cqh, calc(100cqw / 16 * 9));
	backdrop-filter: none;
	transition: ${fallbackTransitions}, --grid-template-count ${eases.easeOutMax} 250ms;

	&.column {
		grid-auto-flow: row;
		grid-template-columns: repeat(var(--grid-template-count), 1fr);
	}

	&.row {
		grid-auto-flow: column;
		grid-template-rows: repeat(var(--grid-template-count), 1fr);
	}

	.padding-wrapper {
		padding: var(--padding, 0);
	}

	[role="img"] {
		${styles.mixins.square("100%")};
		min-height: 0;
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

	&:has([role="img"].highlight) [role="img"]:not(.highlight) {
		opacity: 0.5;
	}
`;

const xWidth = "1.25ex";
const Determinant = styled.div`
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	gap: ${GAP}px;
	align-self: center;
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

	:has(> &) {
		position: relative;
	}
`;

const floatDownHidden = css`
	translate: 0 24px;
	opacity: 0;
	pointer-events: none;
`;

const Mask = styled.div`
	position: fixed;
	inset: 0;
`;

const FlyoutEditor = styled.div`
	${styles.effects.flyout};
	${styles.mixins.gridCenter()};
	position: absolute;
	inset: 0;
	inset-block-end: 8px;
	z-index: 1;
	transition-behavior: allow-discrete;

	&[hidden] {
		${floatDownHidden};
	}

	@starting-style {
		${floatDownHidden};
	}

	.span {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: ${GAP}px;

		.text-box {
			max-inline-size: 200px;
		}
	}
`;

const StyledContainerPreview = styled.div`
	&:has(${FlyoutEditor}:not([hidden])) {
		${Determinant} {
			${floatDownHidden};
		}

		.command-bar-group {
			${floatDownHidden};
			translate: 0 -16px;
		}
	}
`;

const TOOLTIP_OFFSET = 28;
export default function Grid() {
	const { columns: [columns, _setColumns], array, direction, fit, mirrorEdgesHFlip, mirrorEdgesVFlip, descending: [descending, setDescending], padding, spans: [spans, setSpans] } = selectConfig(c => c.track.grid);
	const setColumns = setStateInterceptor(_setColumns, input => clamp(input, 1, MAX_COL_ROW));
	const rows = columns, setRows = setColumns; // These properties were originally planned to put into the config, but now it is abandoned.
	const count = 25;
	const radicand = Math.ceil(Math.sqrt(count));
	const horizontalDirection = direction[0].endsWith("tb"), verticalDirection = direction[0].startsWith("tb"), rtlDirection = direction[0].includes("rl");
	const square = array[0] === "square", fixedColumns = array[0] === "fixed" && horizontalDirection, fixedRows = array[0] === "fixed" && verticalDirection;
	const columnReadonly = square || fixedRows, rowReadonly = square || fixedColumns;
	const order = useMemo(() => descending ? "descending" : "ascending", [descending]);
	const id = useUniqueId("grid-view"), fieldAnchorName = "--" + id + "-field";
	const [fastFillShown, setFastFillShown] = useState(false);
	const columnInputRef = useDomRef<"input">(), rowInputRef = useDomRef<"input">();
	const [lastCrossLineIndex, findSpan] = useMemo(() => gridSpanHelper(count, fixedColumns ? columns : rows, square ? [] : spans), [square, count, fixedColumns ? columns : rows, spans]);
	// const autoRows = Math.ceil(count / columns), autoColumns = Math.ceil(count / rows);
	const autoRows = lastCrossLineIndex, autoColumns = lastCrossLineIndex;
	const [flyoutEditor, setFlyoutEditor] = useState<"span" | "width" | "height">(), previousFlyoutEditor = useDeferredValue(flyoutEditor), _flyoutEditor = flyoutEditor || previousFlyoutEditor;
	const [flyoutEditorCell, setFlyoutEditorCell] = useState<[number, number]>();
	const [spanX, spanY, setSpanX, setSpanY] = useMemo(() => {
		let x = 1, y = 1, itemIndex = -1;
		for (const [index, span] of spans.entries())
			if (span.sameLine === flyoutEditorCell?.[0] && span.crossLine === flyoutEditorCell[1]) {
				[x, y, itemIndex] = [span.sameLineSpan || 1, span.crossLineSpan || 1, index];
				break;
			}
		const setSpan = (value: React.SetStateAction<number>, axis: "column" | "row") => setSpans(produce(draft => {
			if (!flyoutEditorCell) return;
			if (typeof value === "function") value = value(axis === "column" ? x : y);
			const [newX, newY] = axis === "column" ? [value, y] : [x, value];
			if (~itemIndex) {
				draft[itemIndex].sameLineSpan = newX;
				draft[itemIndex].crossLineSpan = newY;
			} else
				draft.push({
					sameLine: flyoutEditorCell[0],
					crossLine: flyoutEditorCell[1],
					sameLineSpan: newX,
					crossLineSpan: newY,
				});
		}));
		return [x, y, (v: React.SetStateAction<number>) => setSpan(v, "column"), (v: React.SetStateAction<number>) => setSpan(v, "row")] as const;
	}, [flyoutEditorCell, spans]);

	pageStore.useOnSave(() => configStore.track.grid.enabled = true);

	const getMirrorEdgesText = (parity: GridParityType, direction: "hFlip" | "vFlip") =>
		parity === "unflipped" ? t.track.grid.mirrorEdges.unflipped :
		isCheckerParities(parity) ? t.track.grid.mirrorEdges.checkerboard + " — " + t.track.grid.mirrorEdges.checkerboard[parity.replaceEnd("_checker")].toString().replaceAll("-", "‑") :
		t.track.grid.mirrorEdges[direction][parity];
	const getMirrorEdgesIcon = (parity: GridParityType, field: "column" | "row"): DeclaredIcons =>
		parity === "unflipped" ? "prohibited" : isCheckerParities(parity) ? `parity_${parity}` : `parity_${parity}_${field}s`;

	return (
		<>
			<StyledContainerPreview>
				<CommandBar.Group>
					<CommandBar position="right" autoCollapse>
						<button type="button" onClick={() => setSpans([])}>reset</button>
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
							let [colStart, colEnd, colSpan, rowStart, rowEnd, rowSpan] = findSpan(i);
							if (verticalDirection) [colStart, colEnd, colSpan, rowStart, rowEnd, rowSpan] = [rowStart, rowEnd, rowSpan, colStart, colEnd, colSpan];
							const getSpanCss = (value?: number) => value && value > 1 ? `span ${value}` : undefined;
							const thisCell = [colStart - 1, rowStart - 1].shouldReversed(verticalDirection);
							return (
								<div className="padding-wrapper" key={i} style={{ gridColumn: getSpanCss(colSpan), gridRow: getSpanCss(rowSpan) }}>
									<div
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
											highlight: flyoutEditor === "span" && flyoutEditorCell?.[0] === thisCell[0] && flyoutEditorCell[1] === thisCell[1],
										}]}
										role="img"
										aria-label={t.descriptions.track.grid.previewAria({ columnIndex: colStart, rowIndex: rowStart, columnCount: columns, rowCount: autoRows })}
										data-column-start={colStart}
										data-column-end={colEnd}
										data-row-start={rowStart}
										data-row-end={rowEnd}
										onMouseDown={e => e.button === 2 && makeFocusDiffusionEffect(e)}
										onContextMenu={createContextMenu(([
											...square ? [
												{ label: t.descriptions.track.grid.squareCannotUseTheseFeatures({ fixed: t.track.grid[horizontalDirection ? "fixedColumns" : "fixedRows"] }) },
												{ kind: "separator" },
											] as const : [],
											{ label: t.menu.grid.columnWidth, onClick() { setFlyoutEditor("width"); } },
											{ label: t.menu.grid.rowHeight, onClick() { setFlyoutEditor("height"); } },
											{ kind: "separator" },
											{ label: t.menu.grid.span, onClick() { setFlyoutEditor("span"); setFlyoutEditorCell(thisCell as never); } },
										] as const).map(item => ({ ...item, enabled: !square })))}
									/>
								</div>
							);
						})}
					</PreviewGrid>
				</PreviewGridContainer>

				<div>
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
											max={MAX_COL_ROW}
											decimalPlaces={0}
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

					<Attrs hidden={!flyoutEditor}>
						<Mask onMouseDown={e => { stopEvent(e); setFlyoutEditor(undefined); }} />
						<FlyoutEditor>
							{_flyoutEditor === "span" ? (
								<div className="span">
									<label htmlFor={id + "-colspan"}>{t.track.grid.columnSpan}</label>
									<label htmlFor={id + "-rowspan"}>{t.track.grid.rowSpan}</label>
									{(["colspan", "rowspan"] as const).map(key => (
										<TextBox.Number
											key={key}
											id={id + "-" + key}
											value={key === (verticalDirection ? "rowspan" : "colspan") ? [spanX, setSpanX] : [spanY, setSpanY]}
											min={1}
											max={100}
											decimalPlaces={0}
											defaultValue={1}
										/>
									))}
								</div>
							) : undefined}
						</FlyoutEditor>
					</Attrs>
				</div>
			</StyledContainerPreview>

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
								{ id: "max", value: MAX_COL_ROW },
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

function gridSpanHelper(count: number, thisLineLength: number, spans: WebMessageEvents.GridSpanItem[]) {
	const array: number[] = [];
	const settings = new Map<string, [sameLineSpan: number, crossLineSpan: number]>();
	for (const { sameLine, crossLine, sameLineSpan, crossLineSpan } of spans)
		settings.set(`${sameLine},${crossLine}`, [sameLineSpan || 1, crossLineSpan || 1]);
	let x = 0, y = 0;
	const getIndex = (_x = x, _y = y) => _y * thisLineLength + _x;
	for (let i = 0; i < count; i++) {
		const index = getIndex();
		array[index] = i;
		const span = settings.get(`${x},${y}`);
		if (span)
			for (let _y = y; _y < y + span[1]; _y++)
				for (let _x = x; _x < Math.min(x + span[0], thisLineLength); _x++) {
					const newIndex = getIndex(_x, _y);
					if (array[newIndex] !== undefined && newIndex !== index) break;
					array[newIndex] = i;
				}
		while (array[getIndex()] !== undefined)
			if (++x >= thisLineLength) {
				x = 0;
				y++;
			}
	}
	// const array2d = new Array(Math.ceil(array.length / thisLineLength)).fill(undefined).map((_, i) => array.slice(i * thisLineLength, i * thisLineLength + thisLineLength));
	// console.table(array2d);
	const lastCrossLineIndex = (array.findLastIndex(Boolean) / thisLineLength | 0) + 1;
	return [
		lastCrossLineIndex,
		function find(index: number) {
			if (index >= count) return [];
			const first = array.indexOf(index), last = array.lastIndexOf(index);
			const sameLineStart = first % thisLineLength, sameLineEnd = last % thisLineLength, crossLineStart = first / thisLineLength | 0, crossLineEnd = last / thisLineLength | 0;
			const sameLineSpan = sameLineEnd - sameLineStart + 1, crossLineSpan = crossLineEnd - crossLineStart + 1;
			return [sameLineStart + 1, sameLineEnd + 1, sameLineSpan, crossLineStart + 1, crossLineEnd + 1, crossLineSpan] as const;
		},
	] as const;
}
