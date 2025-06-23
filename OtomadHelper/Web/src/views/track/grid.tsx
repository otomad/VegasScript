import exampleThumbnail from "assets/images/ヨハネの氷.png";
import ApprovalsAppIcon from "assets/svg/approvals_app.svg?react";

export /* @internal */ const arrayTypes = ["square", "fixed"] as const;
export /* @internal */ const directionTypes = ["lr-tb", "tb-lr", "rl-tb", "tb-rl"] as const;
export /* @internal */ const fitTypes = ["cover", "contain"] as const;
export /* @internal */ const parityTypes = ["unflipped", "even", "odd", "odd_checker", "even_checker"] as const;
type GridParityType = typeof parityTypes[number];
const isCheckerParities = (parity: GridParityType): parity is "odd_checker" | "even_checker" => parity.endsWith("_checker");
const MAX_COL_ROW = 100;
const GAP = 6;
const RULER_THICKNESS = 16;
const ASTERISK = "∗";

const getGridUnitTypeName = (unit: WebMessageEvents.GridUnitType, count: number) => {
	const tc = t({ context: "full", count });
	return unit === "auto" ? tc.auto : unit === "pixel" ? tc.units.pixel : tc.units.fraction;
};

const PreviewGridContainer = styled.div`
	${styles.mixins.square("100%")};
	${styles.mixins.gridCenter()};
	container: preview-grid-container / size;
	margin-block-start: ${RULER_THICKNESS - GAP}px;
`;

const PreviewGrid = styled.div`
	${styles.effects.flyout};
	--project-width: 1920;
	--project-height: 1080;
	display: grid;
	align-self: center;
	width: min(100cqw, calc(100cqh / var(--project-height) * var(--project-width)));
	height: min(100cqh, calc(100cqw / var(--project-width) * var(--project-height)));
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
		position: relative;
		align-content: flex-end;
		min-height: 0;
		object-fit: var(--fit);
		overflow: hidden;
		background-image: url("${exampleThumbnail}");
		background-repeat: no-repeat;
		background-position: center;
		background-size: var(--fit);

		&.h-flip {
			scale: -1 1;

			&::after {
				right: var(--margin);
				left: unset;
			}
		}

		&.v-flip {
			scale: 1 -1;

			&::after {
				top: var(--margin);
				bottom: unset;
			}
		}

		&.h-flip.v-flip {
			scale: -1 -1;

			&::after {
				top: var(--margin);
				right: var(--margin);
				bottom: unset;
				left: unset;
			}
		}

		&:active {
			animation: ${keyframes`
				from {
					box-shadow: 0 0
				}
			`} duration timing-function delay iteration-count direction fill-mode;
		}

		&::after {
			${styles.mixins.oval()};
			${styles.effects.text.caption};
			--size: 16px;
			--margin: 4px;
			content: attr(data-index);
			position: absolute;
			bottom: var(--margin);
			left: var(--margin);
			display: inline-block;
			padding: 0 3px;
			block-size: var(--size);
			min-inline-size: var(--size);
			font-size: 10px;
			text-align: center;
			background-color: ${c("fill-color-system-solid-neutral-background", 75)};
			scale: inherit;
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
	padding: ${GAP}px;
	overflow: visible;
	transition-behavior: allow-discrete;

	&[hidden] {
		${floatDownHidden};
	}

	@starting-style {
		${floatDownHidden};
	}

	> * {
		gap: ${GAP}px;
	}

	.text-box {
		max-inline-size: 200px;
	}

	.span {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
	}

	.length {
		display: flex;
		gap: 12px;
		align-items: center;

		> :not(.text-box) {
			flex-shrink: 0;
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

const Label = ({ id, htmlFor, ...htmlAttrs }: RequiredWith<FCP<{}, "label">, "id" | "htmlFor">) =>
	<label id={`${id}-${htmlFor}-label`} htmlFor={`${id}-${htmlFor}`} aria-hidden {...htmlAttrs} />;

const Ruler = styled.div.attrs({
	"aria-hidden": true,
})`
	${styles.effects.text.caption};
	position: fixed;
	display: grid;
	color: ${c("fill-color-text-secondary")};
	font-size: 10px;
	text-align: center;
	transition: none;
	position-anchor: --preview-grid;

	> * {
		contain: strict;
		overflow: clip;
		direction: ltr;
	}

	&.columns {
		right: anchor(right);
		bottom: anchor(top);
		left: anchor(left);
		grid-auto-flow: column;
		block-size: ${RULER_THICKNESS}px;

		> :not(:last-child) {
			border-inline-end: 1px solid ${c("stroke-color-divider-stroke-default")};
		}
	}

	&.rows {
		top: anchor(top);
		right: anchor(left);
		bottom: anchor(bottom);
		grid-auto-flow: row;
		inline-size: ${RULER_THICKNESS}px;

		> * {
			writing-mode: sideways-lr;
		}

		> :not(:last-child) {
			border-inline-start: 1px solid ${c("stroke-color-divider-stroke-default")};
		}
	}
`;

const TOOLTIP_OFFSET = 28;

const Multiply = styled.label.attrs({
	children: "×",
	role: "term",
	"aria-label": t.aria.times,
})`
	${styles.mixins.flexCenter()};
	padding-block-end: 3px;
	inline-size: ${xWidth};

	&.shadow {
		visibility: hidden;
	}
`;

export default function Grid() {
	const { columns: [columns, _setColumns], array, direction, fit, mirrorEdgesHFlip, mirrorEdgesVFlip, descending: [descending, setDescending], padding, spans: [spans, setSpans], columnWidths: [columnWidths, setColumnWidths], rowHeights: [rowHeights, setRowHeights] } = selectConfig(c => c.track.grid);
	const setColumns = setStateInterceptor(_setColumns, input => clamp(input, 1, MAX_COL_ROW));
	const rows = columns, setRows = setColumns; // These properties were originally planned to put into the config, but now it is abandoned.
	const count = 25, projectWidth = 1920, projectHeight = 1080;
	const radicand = Math.ceil(Math.sqrt(count));
	const horizontalDirection = direction[0].endsWith("tb"), verticalDirection = direction[0].startsWith("tb"), rtlDirection = direction[0].includes("rl");
	const square = array[0] === "square", fixedColumns = array[0] === "fixed" && horizontalDirection, fixedRows = array[0] === "fixed" && verticalDirection;
	const columnReadonly = square || fixedRows, rowReadonly = square || fixedColumns;
	const order = useMemo(() => descending ? "descending" : "ascending", [descending]);
	const id = useUniqueId("grid-view"), fieldAnchorName = "--" + id + "-field";
	const [fastFillShown, setFastFillShown] = useState(false);
	const columnInputRef = useDomRef<"input">(), rowInputRef = useDomRef<"input">();
	const fixedColumnsOrFixedRows = t.track.grid[horizontalDirection ? "fixedColumns" : "fixedRows"];
	const { maxSameLineLength, lastCrossLineIndex, find: findSpan } = useMemo(() => gridSpanHelper(count, fixedColumns ? columns : rows, square ? [] : spans), [square, count, fixedColumns ? columns : rows, spans]);
	// const autoRows = Math.ceil(count / columns), autoColumns = Math.ceil(count / rows);
	const autoRows = lastCrossLineIndex, autoColumns = lastCrossLineIndex;
	const [flyoutEditor, setFlyoutEditor] = useState<"span" | "width" | "height">(), previousFlyoutEditor = useDeferredValue(flyoutEditor), _flyoutEditor = flyoutEditor || previousFlyoutEditor;
	const [flyoutEditorCell, setFlyoutEditorCell] = useState<[number, number]>();
	const [spanX, spanY, setSpanX, setSpanY] = useMemo(() => {
		const getItem = (draft = spans) => {
			let x = 1, y = 1, itemIndex = -1;
			for (const [index, span] of draft.entries())
				if (span.sameLine === flyoutEditorCell?.[0] && span.crossLine === flyoutEditorCell[1]) {
					[x, y, itemIndex] = [span.sameLineSpan || 1, span.crossLineSpan || 1, index];
					break;
				}
			return { x, y, itemIndex };
		};
		const { x, y } = getItem();
		const setSpan = (value: React.SetStateAction<number>, axis: "column" | "row") => setSpans(produce(draft => {
			if (!flyoutEditorCell) return;
			const { x, y, itemIndex } = getItem(draft);
			if (typeof value === "function") value = value(axis === "column" ? x : y);
			const [newX, newY] = axis === "column" ? [value, y] : [x, value];
			if (~itemIndex)
				[draft[itemIndex].sameLineSpan, draft[itemIndex].crossLineSpan] = [newX, newY];
			else
				draft.push({
					sameLine: flyoutEditorCell[0],
					crossLine: flyoutEditorCell[1],
					sameLineSpan: newX,
					crossLineSpan: newY,
				});
		}));
		return [x, y, (v: React.SetStateAction<number>) => setSpan(v, "column"), (v: React.SetStateAction<number>) => setSpan(v, "row")] as const;
	}, [flyoutEditorCell, spans]);
	const [flyoutEditorColumnRow, setFlyoutEditorColumnRow] = useState<[number, "column" | "row"]>();
	const [columnRowValue, columnRowType, setColumnRow] = useMemo(() => {
		const items = flyoutEditorColumnRow?.[1] === "column" ? columnWidths : rowHeights;
		const getItem = (draft = items) => {
			const itemIndex = draft.findIndex(item => item.index === flyoutEditorColumnRow?.[0]);
			const { value, type } = draft[itemIndex] ?? { value: 1, type: "star" };
			return { currentValue: value, type, itemIndex };
		};
		const { currentValue, type } = getItem();
		const setColumnRow: {
			(value: React.SetStateAction<number>): void;
			(type: WebMessageEvents.GridUnitType): void;
		} = value => {
			if (!flyoutEditorColumnRow) return;
			const setState = flyoutEditorColumnRow[1] === "column" ? setColumnWidths : setRowHeights;
			setState(produce(draft => {
				const { currentValue, type, itemIndex } = getItem(draft); // Values outside are not updated.
				if (typeof value === "function") value = value(currentValue);
				const [newValue, newType] = typeof value === "number" ? [value, type] : [currentValue, value];
				if (~itemIndex)
					[draft[itemIndex].value, draft[itemIndex].type] = [newValue, newType];
				else
					draft.push({
						index: flyoutEditorColumnRow[0],
						value: newValue,
						type: newType,
					});
			}));
		};
		return [currentValue, type, setColumnRow] as const;
	}, [flyoutEditorColumnRow, columnWidths, rowHeights, count, columns, autoRows]);
	const { gridTemplateColumns, gridTemplateRows, rulerColumns, rulerRows } = useGridTemplateCss(square ? [] : columnWidths, square ? [] : rowHeights, square ? radicand : columns, square ? radicand : autoRows, verticalDirection, projectWidth, projectHeight, maxSameLineLength);
	const [showOperationRecordDialog, setShowOperationRecordDialog] = useState(false);
	const [operationRecordSelection, setOperationRecordSelection] = useState<string[]>([]);
	const [operationRecordFilter, setOperationRecordFilter] = useState("all");
	const [operationRecordFilterSpan, operationRecordFilterColumnWidth, operationRecordFilterRowHeight] = useMemo(() => [operationRecordFilter.in("all", "span"), operationRecordFilter.in("all", "columnWidth"), operationRecordFilter.in("all", "rowHeight")], [operationRecordFilter]);
	const [isCurrentOperationRecordFilterItemEmpty, setIsCurrentOperationRecordFilterItemEmpty] = useState(false);
	const isCurrentOperationRecordFilterItemAnySelected = useMemo(() => !!operationRecordSelection.find(item => operationRecordFilterSpan && item.startsWith("column-") || operationRecordFilterRowHeight && item.startsWith("row-") || operationRecordFilterSpan && item.includes(",")), [operationRecordSelection, operationRecordFilterSpan, operationRecordFilterRowHeight, operationRecordFilterSpan]);

	pageStore.useOnSave(() => configStore.track.grid.enabled = true);

	const getMirrorEdgesText = (parity: GridParityType, direction: "hFlip" | "vFlip") =>
		parity === "unflipped" ? t.track.grid.mirrorEdges.unflipped :
		isCheckerParities(parity) ? t.track.grid.mirrorEdges.checkerboard + " — " + t.track.grid.mirrorEdges.checkerboard[parity.replaceEnd("_checker")].toString().replaceAll("-", "‑") :
		t.track.grid.mirrorEdges[direction][parity];
	const getMirrorEdgesIcon = (parity: GridParityType, field: "column" | "row"): DeclaredIcons =>
		parity === "unflipped" ? "prohibited" : isCheckerParities(parity) ? `parity_${parity}` : `parity_${parity}_${field}s`;

	const closeFlyoutEditor = () => setFlyoutEditor(undefined);
	useEventListener(window, "keydown", e => flyoutEditor && e.code === "Escape" && closeFlyoutEditor(), undefined, [flyoutEditor]);
	const resetRecords = () => { setSpans([]); setColumnWidths([]); setRowHeights([]); };

	function deleteSelection() {
		for (const selected of operationRecordSelection) {
			let matched: string | undefined;
			if (operationRecordFilterColumnWidth && (matched = selected.match(/column-(\d+)/)?.[1]))
				setColumnWidths(produce(draft => draft.removeAt(draft.findIndex(({ index }) => index === +matched!))));
			else if (operationRecordFilterRowHeight && (matched = selected.match(/row-(\d+)/)?.[1]))
				setRowHeights(produce(draft => draft.removeAt(draft.findIndex(({ index }) => index === +matched!))));
			else if (operationRecordFilterSpan && selected.includes(",")) {
				const [column, row] = selected.split(",");
				setSpans(produce(draft => draft.removeAt(draft.findIndex(({ sameLine, crossLine }) => sameLine === +column && crossLine === +row))));
			}
		}
		if (operationRecordFilter === "all")
			setOperationRecordSelection([]);
		else {
			if (operationRecordFilterColumnWidth)
				setOperationRecordSelection(draft => draft.filter(item => !item.startsWith("column-")));
			if (operationRecordFilterRowHeight)
				setOperationRecordSelection(draft => draft.filter(item => !item.startsWith("row-")));
			if (operationRecordFilterSpan)
				setOperationRecordSelection(draft => draft.filter(item => !item.includes(",")));
		}
	}

	function cleanUpInvalidOperationItems() {
		const keyPool = new Set<string>();
		setSpans(produce(draft => {
			for (let i = draft.length - 1; i >= 0; i--) {
				const item = draft[i], key = gridItemToKey(item);
				if (keyPool.has(key) || item.sameLineSpan === 1 && item.crossLineSpan === 1) draft.removeAt(i);
				else keyPool.add(key);
			}
		}));
		setColumnWidths(produce(draft => {
			for (let i = draft.length - 1; i >= 0; i--) {
				const item = draft[i], key = gridItemToKey(item, "column");
				if (keyPool.has(key) || item.value === 1 && item.type === "star") draft.removeAt(i);
				else keyPool.add(key);
			}
		}));
		setRowHeights(produce(draft => {
			for (let i = draft.length - 1; i >= 0; i--) {
				const item = draft[i], key = gridItemToKey(item, "row");
				if (keyPool.has(key) || item.value === 1 && item.type === "star") draft.removeAt(i);
				else keyPool.add(key);
			}
		}));
	}

	return (
		<>
			<StyledContainerPreview>
				<CommandBar.Group>
					<CommandBar position="right" autoCollapse>
						<CommandBar.Item icon="approvals_app" onClick={() => { cleanUpInvalidOperationItems(); setShowOperationRecordDialog(true); }} caption={t.track.grid.operationRecord} altCaption={t({ context: "short" }).track.grid.operationRecord} aria-haspopup="dialog" />
						<hr />
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
							"--grid-template-count": Math.min(square ? radicand : fixedColumns ? columns : rows, maxSameLineLength),
							"--padding": padding[0] + "px",
							"--fit": fit[0],
							"--project-width": projectWidth,
							"--project-height": projectHeight,
							gridTemplateColumns,
							gridTemplateRows,
							anchorName: "--preview-grid",
						}}
						className={fixedRows ? "row" : "column"}
						role="figure"
						aria-label={t.preview}
						dir={rtlDirection ? "rtl" : "ltr"}
					>
						{forMap(count, i => {
							// const divisor = square ? radicand : columns;
							// const column = i % divisor, row = i / divisor | 0;
							let [colStart, colEnd, colSpan, rowStart, rowEnd, rowSpan] = findSpan(i);
							if (verticalDirection) [colStart, colEnd, colSpan, rowStart, rowEnd, rowSpan] = [rowStart, rowEnd, rowSpan, colStart, colEnd, colSpan];
							const getSpanCss = (value?: number) => value && value > 1 ? `span ${value}` : undefined;
							const thisCell = [colStart - 1, rowStart - 1].shouldReversed(verticalDirection);
							return (
								<div className="padding-wrapper" key={`${colStart},${rowStart}`} style={{ gridColumn: getSpanCss(colSpan), gridRow: getSpanCss(rowSpan) }}>
									<div
										className={[{
											hFlip:
												mirrorEdgesHFlip[0] === "even" && colStart % 2 === 0 ||
												mirrorEdgesHFlip[0] === "odd" && colStart % 2 === 1 ||
												mirrorEdgesHFlip[0] === "odd_checker" && (colStart + rowStart) % 2 === 1 ||
												mirrorEdgesHFlip[0] === "even_checker" && (colStart + rowStart) % 2 === 0,
											vFlip:
												mirrorEdgesVFlip[0] === "even" && rowStart % 2 === 0 ||
												mirrorEdgesVFlip[0] === "odd" && rowStart % 2 === 1 ||
												mirrorEdgesVFlip[0] === "odd_checker" && (colStart + rowStart) % 2 === 1 ||
												mirrorEdgesVFlip[0] === "even_checker" && (colStart + rowStart) % 2 === 0,
											highlight:
												flyoutEditor === "span" && flyoutEditorCell?.[0] === thisCell[0] && flyoutEditorCell[1] === thisCell[1] ||
												flyoutEditor === "width" && flyoutEditorColumnRow?.[1] === "column" && flyoutEditorColumnRow[0] === colEnd - 1 ||
												flyoutEditor === "height" && flyoutEditorColumnRow?.[1] === "row" && flyoutEditorColumnRow[0] === rowEnd - 1,
										}]}
										role="img"
										aria-label={t.descriptions.track.grid.previewAria({ columnIndex: colStart, rowIndex: rowStart, columnCount: columns, rowCount: autoRows })}
										data-index={descending ? count - i : i + 1}
										data-column-start={colStart}
										data-column-end={colEnd}
										data-row-start={rowStart}
										data-row-end={rowEnd}
										onMouseDown={e => e.button === 2 && makeFocusDiffusionEffect(e)}
										onContextMenu={createContextMenu(([
											...square ? [
												{ label: t.descriptions.track.grid.squareCannotUseTheseFeatures({ fixed: fixedColumnsOrFixedRows }) },
												{ kind: "separator" },
											] as const : [],
											{ label: t.menu.grid.columnWidth, onClick() { setFlyoutEditor("width"); setFlyoutEditorColumnRow([colEnd - 1, "column"]); } },
											{ label: t.menu.grid.rowHeight, onClick() { setFlyoutEditor("height"); setFlyoutEditorColumnRow([rowEnd - 1, "row"]); } },
											{ kind: "separator" },
											{ label: t.menu.grid.span, onClick() { setFlyoutEditor("span"); setFlyoutEditorCell(thisCell as never); } },
										] as const).map(item => ({ ...item, enabled: !square })))}
									/>
								</div>
							);
						})}
					</PreviewGrid>
					<Ruler className="columns" style={{ gridTemplateColumns }} dir={rtlDirection ? "rtl" : "ltr"}>{rulerColumns.map((value, i) => <div key={i}>{value}</div>)}</Ruler>
					<Ruler className="rows" style={{ gridTemplateRows }}>{rulerRows.map((value, i) => <div key={i}>{value}</div>)}</Ruler>
				</PreviewGridContainer>

				<div>
					<Determinant>
						<div>
							<Label id={id} htmlFor="column">{t(square ? radicand : columns).track.grid.column}</Label>
							<div />
							<Label id={id} htmlFor="row">{t(square ? radicand : rows).track.grid.row}</Label>
							{["column", "x", "row"].map(key => {
								if (key === "x") return <Multiply key={key} />;
								const isColumn = key === "column", ref = isColumn ? columnInputRef : rowInputRef, readonly = isColumn ? columnReadonly : rowReadonly;
								return (
									<EventInjector
										key={key}
										onFocusIn={() => { if (!readonly) { setFastFillShown(true); ref.current?.focus(); } }}
										onFocusOut={() => setFastFillShown(false)}
									>
										<TextBox.Number
											id={`${id}-${key}`}
											aria-labelledby={`${id}-${key}-label`}
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
							<Label id={id} htmlFor="padding">{t(padding[0]).track.grid.padding}</Label>
							<Multiply className="shadow" />
							<Tooltip title={t.descriptions.track.grid.padding} placement="top" offset={TOOLTIP_OFFSET} unwrapped={false}>
								<TextBox.Number
									id={`${id}-padding`}
									aria-labelledby={`${id}-padding-label`}
									aria-description={t(padding[0]).track.grid.padding}
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
						<Mask onMouseDown={e => { stopEvent(e); closeFlyoutEditor(); }} />
						<FlyoutEditor>
							{_flyoutEditor === "span" ? (
								<div className="span">
									<Label id={id} htmlFor="colspan">{t.track.grid.columnSpan}</Label>
									<div />
									<Label id={id} htmlFor="rowspan">{t.track.grid.rowSpan}</Label>
									{(["colspan", "x", "rowspan"] as const).map(key => key === "x" ? <Multiply key={key} /> : (
										<TextBox.Number
											key={key}
											id={`${id}-${key}`}
											aria-labelledby={`${id}-${key}-label`}
											value={key === (verticalDirection ? "rowspan" : "colspan") ? [spanX, setSpanX] : [spanY, setSpanY]}
											min={1}
											max={100}
											decimalPlaces={0}
											defaultValue={1}
										/>
									))}
								</div>
							) : _flyoutEditor === "width" || _flyoutEditor === "height" ? (
								<div className="length">
									<Label id={id} htmlFor="length">{t.track.grid[_flyoutEditor === "width" ? "columnWidth" : "rowHeight"]}</Label>
									<TextBox.Number
										id={`${id}-length`}
										aria-labelledby={`${id}-length-label`}
										value={[columnRowValue, setColumnRow]}
										min={0}
										max={_flyoutEditor === "width" ? projectWidth : projectHeight}
										defaultValue={1}
										disabled={columnRowType === "auto"}
									/>
									{(["auto", "pixel", "star"] as const).map(unit => (
										<RadioButton
											key={unit}
											id={unit}
											value={[columnRowType, setColumnRow]}
											disabled={unit === "auto"} // Auto type is not supported now.
										>
											{getGridUnitTypeName(unit, columnRowValue)}
										</RadioButton>
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
								{ id: "transpose", value: fixedColumns ? autoRows : autoColumns, unselected: true },
							]}
						/>
					</div>
				</Flyout>
			</Portal>

			<ContentDialog
				shown={[showOperationRecordDialog, setShowOperationRecordDialog]}
				title={t.track.grid.operationRecord}
				buttons={close => (
					<>
						<Button onClick={resetRecords} disabled={isCurrentOperationRecordFilterItemEmpty}>{operationRecordFilter === "all" ? t.reset : t.resetThisPage}</Button>
						<Button onClick={deleteSelection} disabled={!isCurrentOperationRecordFilterItemAnySelected}>{t.deleteSelection}</Button>
						<Button autoFocus accent onClick={close}>{t.close}</Button>
					</>
				)}
			>
				<Filter current={[operationRecordFilter, setOperationRecordFilter]}>
					{(["all", "span", "columnWidth", "rowHeight"] as const).map(key => <Filter.Item key={key} id={key}>{key === "all" ? t.all : t.track.grid[key]}</Filter.Item>)}
				</Filter>
				<ItemsView
					view="list"
					multiple
					current={[operationRecordSelection, setOperationRecordSelection]}
					emptyState={(
						<EmptyMessage
							icon={<ApprovalsAppIcon />}
							title={t.empty.operationRecord.title}
							details={t.empty.operationRecord.details({ fixed: fixedColumnsOrFixedRows })}
							style={{ marginBlock: "30px 0" }}
						/>
					)}
					selectAll
					onItemEmptyChange={setIsCurrentOperationRecordFilterItemEmpty}
				>
					{[
						...!operationRecordFilterSpan ? [] : spans.map(span => (
							<ItemsView.Item key={gridItemToKey(span)} id={gridItemToKey(span)}>
								<OperationRecordItem>
									{{
										[t(1).track.grid.column]: (verticalDirection ? span.crossLine : span.sameLine) + 1,
										[t(1).track.grid.row]: (verticalDirection ? span.sameLine : span.crossLine) + 1,
										[t.track.grid.columnSpan]: verticalDirection ? span.crossLineSpan : span.sameLineSpan,
										[t.track.grid.rowSpan]: verticalDirection ? span.sameLineSpan : span.crossLineSpan,
									}}
								</OperationRecordItem>
							</ItemsView.Item>
						)),
						...!operationRecordFilterColumnWidth ? [] : columnWidths.map(columnWidth => (
							<ItemsView.Item key={gridItemToKey(columnWidth, "column")} id={gridItemToKey(columnWidth, "column")}>
								<OperationRecordItem>
									{{
										[t(1).track.grid.column]: columnWidth.index,
										[t.width]: columnWidth.value,
										[t.unit]: getGridUnitTypeName(columnWidth.type, columnWidth.value),
									}}
								</OperationRecordItem>
							</ItemsView.Item>
						)),
						...!operationRecordFilterRowHeight ? [] : rowHeights.map(rowHeight => (
							<ItemsView.Item key={gridItemToKey(rowHeight, "row")} id={gridItemToKey(rowHeight, "row")}>
								<OperationRecordItem>
									{{
										[t(1).track.grid.row]: rowHeight.index,
										[t.height]: rowHeight.value,
										[t.unit]: getGridUnitTypeName(rowHeight.type, rowHeight.value),
									}}
								</OperationRecordItem>
							</ItemsView.Item>
						)),
					]}
				</ItemsView>
			</ContentDialog>
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
	const array2d = Array.from({ length: Math.ceil(array.length / thisLineLength) }, (_, i) => array.slice(i * thisLineLength, (i + 1) * thisLineLength));
	// console.table(array2d);
	const maxSameLineLength = Math.max(...array2d.map(i => i.findLastIndex(index => index !== undefined) + 1));
	const lastCrossLineIndex = (array.findLastIndex(index => index !== undefined) / thisLineLength | 0) + 1;
	return {
		maxSameLineLength,
		lastCrossLineIndex,
		find(index: number) {
			if (index >= count) return [];
			const first = array.indexOf(index), last = array.lastIndexOf(index);
			const sameLineStart = first % thisLineLength, sameLineEnd = last % thisLineLength, crossLineStart = first / thisLineLength | 0, crossLineEnd = last / thisLineLength | 0;
			const sameLineSpan = sameLineEnd - sameLineStart + 1, crossLineSpan = crossLineEnd - crossLineStart + 1;
			return [sameLineStart + 1, sameLineEnd + 1, sameLineSpan, crossLineStart + 1, crossLineEnd + 1, crossLineSpan] as const;
		},
	};
}

function useGridTemplateCss(columnWidths: WebMessageEvents.GridColumnWidthRowHeightItem[], rowHeights: WebMessageEvents.GridColumnWidthRowHeightItem[], columns: number, rows: number, vertical: boolean, projectWidth: number, projectHeight: number, maxSameLineLength: number) {
	columns = Math.min(columns, maxSameLineLength);
	if (vertical) [columns, rows] = [rows, columns];
	const getValue = (value: number, type: WebMessageEvents.GridUnitType, specified: "width" | "height") =>
		type === "auto" ? "auto" : type === "star" ? value + "fr" : `calc(${value} / ${specified === "width" ? projectWidth : projectHeight} * 100cq${specified === "width" ? "w" : "h"})`;
	const getRulerValue = (value: number, type: WebMessageEvents.GridUnitType) =>
		type === "auto" ? t.auto : value === 1 && type === "star" ? ASTERISK : value + (type === "star" ? ASTERISK : type === "pixel" ? "px" : "");
	const toCssString = (items: string[]) => items.every(item => item === "1fr") ? undefined : items.join(" ");
	return useMemo(() => {
		const gridTemplateColumns = new Array<string>(columns).fill("1fr"), gridTemplateRows = new Array<string>(rows).fill("1fr");
		const rulerColumns = new Array<string>(columns).fill(ASTERISK), rulerRows = new Array<string>(rows).fill(ASTERISK);
		for (const { index, value, type } of columnWidths)
			if (index in gridTemplateColumns) {
				gridTemplateColumns[index] = getValue(value, type, "width");
				rulerColumns[index] = getRulerValue(value, type);
			}
		for (const { index, value, type } of rowHeights)
			if (index in gridTemplateRows) {
				gridTemplateRows[index] = getValue(value, type, "height");
				rulerRows[index] = getRulerValue(value, type);
			}
		return { gridTemplateColumns: toCssString(gridTemplateColumns), gridTemplateRows: toCssString(gridTemplateRows), rulerColumns, rulerRows };
	}, [columnWidths, rowHeights, columns, rows, vertical, projectWidth, projectHeight]);
}

const StyledOperationRecordItem = styled.div`
	display: grid;
	grid-auto-flow: column;
	grid-template-rows: repeat(2, auto);
	grid-template-columns: repeat(4, 1fr);

	.key {
		${styles.effects.text.caption};
	}

	.value {
		${styles.effects.text.subtitle};
	}

	.items-view-item .text:has(&) {
		inline-size: 100%;
	}

	.items-view-item:has(&) {
		padding-inline: 0;
	}
`;

function OperationRecordItem({ children = {} }: { children?: Record<string, Any> }) {
	return (
		<StyledOperationRecordItem>
			{Object.entries(children).map(([key, value]) => (
				<Fragment key={key}>
					<p className="key">{key}</p>
					<p className="value">{value}</p>
				</Fragment>
			))}
		</StyledOperationRecordItem>
	);
}

function gridItemToKey(item: WebMessageEvents.GridSpanItem): `${number},${number}`;
function gridItemToKey(item: WebMessageEvents.GridColumnWidthRowHeightItem, specified: "column"): `column-${number}`;
function gridItemToKey(item: WebMessageEvents.GridColumnWidthRowHeightItem, specified: "row"): `row-${number}`;
function gridItemToKey(item: WebMessageEvents.GridSpanItem | WebMessageEvents.GridColumnWidthRowHeightItem, specified?: "column" | "row") {
	if ("sameLine" in item) return `${item.sameLine},${item.crossLine}`;
	else if (specified === "column") return `column-${item.index}`;
	else if (specified === "row") return `row-${item.index}`;
}
