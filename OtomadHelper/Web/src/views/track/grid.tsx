import exampleThumbnail from "assets/images/ヨハネの氷.png";

export /* @internal */ const arrayTypes = ["square", "custom"] as const;
export /* @internal */ const fitTypes = ["cover", "contain"] as const;
export /* @internal */ const parityTypes = ["disabled", "odd", "even"] as const;

const PreviewGrid = styled.div<{
	$fit: typeof fitTypes[number];
}>`
	display: grid;
	grid-template-columns: repeat(var(--grid-template-count), 1fr);
	align-self: center;
	width: calc(40cqh / 9 * 16);
	height: 40cqh;
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

	+ .determinant {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 6px 8px;
	}
`;

export default function Grid() {
	const { columns: [columns, setColumns], array, fit, mirrorEdgesHFlip, mirrorEdgesVFlip, descending, padding } = selectConfig(c => c.track.grid);
	const count = 25;
	const rows = Math.ceil(count / columns);
	const radicand = Math.ceil(Math.sqrt(count));
	const square = array[0] === "square";

	pageStore.useOnSave(() => configStore.track.grid.enabled = true);

	const getMirrorEdgesText = (option: typeof parityTypes[number], direction: "hFlip" | "vFlip") =>
		option === "disabled" ? t.disabled : t.track.grid.mirrorEdges[direction][option];

	return (
		<div className="container">
			<PreviewGrid
				$fit={fit[0]}
				style={{
					"--grid-template-count": square ? radicand : columns,
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

			<div className="determinant">
				<p>{t(square ? radicand : columns).track.grid.column}</p>
				<p>{t(square ? radicand : rows).track.grid.row}</p>
				<TextBox.Number value={square ? [radicand] : [columns, setColumns]} min={1} max={100} disabled={square} aria-readonly={square} />
				<TextBox.Number value={[rows]} min={1} max={100} disabled aria-readonly />
			</div>

			<SettingsCard title={t.track.grid.array}>
				<Segmented current={array}>
					{arrayTypes.map(option => <Segmented.Item id={option} key={option}>{option === "square" ? t.track.grid.square : t.custom}</Segmented.Item>)}
				</Segmented>
			</SettingsCard>
			<SettingsCard title={t.track.grid.fit}>
				<Segmented current={fit}>
					{fitTypes.map(option => <Segmented.Item id={option} key={option}>{t.track.grid.fit[option]}</Segmented.Item>)}
				</Segmented>
			</SettingsCard>
			<SettingsCard title={t.track.grid.padding}>
				<TextBox.Number value={padding} min={0} max={50} defaultValue={0} />
			</SettingsCard>
			<SettingsCardToggleSwitch on={descending} title={t.descending} icon="descending" details={t.descriptions.track.descending} />

			<Subheader>{t.track.grid.mirrorEdges}</Subheader>
			<SettingsCard title={t.prve.effects.hFlip}>
				<Segmented current={mirrorEdgesHFlip}>
					{parityTypes.map(option => <Segmented.Item id={option} key={option}>{getMirrorEdgesText(option, "hFlip")}</Segmented.Item>)}
				</Segmented>
			</SettingsCard>
			<SettingsCard title={t.prve.effects.vFlip}>
				<Segmented current={mirrorEdgesVFlip}>
					{parityTypes.map(option => <Segmented.Item id={option} key={option}>{getMirrorEdgesText(option, "vFlip")}</Segmented.Item>)}
				</Segmented>
			</SettingsCard>
		</div>
	);
}
