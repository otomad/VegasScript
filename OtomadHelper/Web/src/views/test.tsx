const directions = ["lr-tb", "lr-bt", "rl-tb", "rl-bt", "tb-lr", "bt-lr", "tb-rl", "bt-rl"] as const;

export default function Test() {
	return (
		<>
			<table>
				<style>
					{String(css`
						div,
						p {
							margin: 0;
							text-align: center;
							vertical-align: middle;
						}

						div {
							display: inline-block;
							height: 20px;
						}

						table {
							writing-mode: vertical-lr;
						}

						td {
							writing-mode: horizontal-tb;
						}

						.error {
							color: red;
						}
					`)}
				</style>
				<tbody>
					{directions.map(from => (
						<tr key={from}>
							<td><b>{from}</b></td>
							{directions.map(to => {
								const opcode = getOpcode(from, to), expected = expectedOpcode(from, to);
								const error = expected !== opcode[2];
								return (
									<td key={to}>
										<div style={{ transform: transformFlowDirection(from, to) }}>
											<Icon name="lr_tb" style={{ transform: transformFlowDirection(from) }} />
										</div>
										<p>{to}</p>
										<p>{opcode[0].toString(2).padStart(3, "0")}</p>
										<p>{opcode[1].toString(2).padStart(3, "0")}</p>
										<p className={{ error }}>{opcode[2].toString(2).padStart(3, "0")}</p>
										<p className={{ error }}>{expected.toString(2).padStart(3, "0")}</p>
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
			<table style={{ writingMode: "horizontal-tb" }} hidden>
				<tbody>
					{(["", ...directions] as const).map(from => (
						<tr key={from}>
							{(["", ...directions] as const).map(to => (
								<td key={to}>
									{(() => {
										if (!from || !to) return (from ? getOpcode(from, from)[0] : to ? getOpcode(to, to)[1] : "   ").toString(2).padStart(3, "0");
										const calc = getOpcode(from, to)[2].toString(2).padStart(3, "0");
										const actual = expectedOpcode(from, to).toString(2).padStart(3, "0");
										return <span className={{ error: calc !== actual }}>{actual}</span>;
									})()}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
}

function getOpcode(from: FlowDirection, to?: FlowDirection) {
	if (!to) {
		to = from;
		from = "lr-tb";
	}
	const dirBits = {
		"lr-tb": 0b000, "lr-bt": 0b010, "rl-tb": 0b001, "rl-bt": 0b011,
		// "tb-lr": 0b110, "bt-lr": 0b111, "tb-rl": 0b100, "bt-rl": 0b101,
		"tb-lr": 0b100, "bt-lr": 0b110, "tb-rl": 0b101, "bt-rl": 0b111,
	} as const;
	const fromBit = dirBits[from], toBit = dirBits[to];
	let op = fromBit ^ toBit;
	if (op & 0b100) op ^= (toBit >> 1 ^ toBit) & 0b1 ? 0b1 : 0b10;
	return [fromBit, toBit, op] as const;
}

function expectedOpcode(from: FlowDirection, to?: FlowDirection) {
	if (!to) {
		to = from;
		from = "lr-tb";
	}
	const result = {
		"lr-tb": {
			"lr-tb": "",
			"lr-bt": "scaleY(-1)",
			"rl-tb": "scaleX(-1)",
			"rl-bt": "rotate(180deg)",
			"tb-lr": "rotate(90deg) scaleY(-1)",
			"bt-lr": "rotate(-90deg)",
			"tb-rl": "rotate(90deg)",
			"bt-rl": "rotate(90deg) scaleX(-1)",
		},
		"lr-bt": {
			"lr-tb": "scaleY(-1)",
			"lr-bt": "",
			"rl-tb": "rotate(180deg)",
			"rl-bt": "scaleX(-1)",
			"tb-lr": "rotate(90deg)",
			"bt-lr": "rotate(90deg) scaleX(-1)",
			"tb-rl": "rotate(90deg) scaleY(-1)",
			"bt-rl": "rotate(-90deg)",
		},
		"rl-tb": {
			"lr-tb": "scaleX(-1)",
			"lr-bt": "rotate(180deg)",
			"rl-tb": "",
			"rl-bt": "scaleY(-1)",
			"tb-lr": "rotate(-90deg)",
			"bt-lr": "rotate(90deg) scaleY(-1)",
			"tb-rl": "rotate(90deg) scaleX(-1)",
			"bt-rl": "rotate(90deg)",
		},
		"rl-bt": {
			"lr-tb": "rotate(180deg)",
			"lr-bt": "scaleX(-1)",
			"rl-tb": "scaleY(-1)",
			"rl-bt": "",
			"tb-lr": "rotate(90deg) scaleX(-1)",
			"bt-lr": "rotate(90deg)",
			"tb-rl": "rotate(-90deg)",
			"bt-rl": "rotate(90deg) scaleY(-1)",
		},
		"tb-lr": {
			"lr-tb": "rotate(90deg) scaleY(-1)",
			"lr-bt": "rotate(-90deg)",
			"rl-tb": "rotate(90deg)",
			"rl-bt": "rotate(90deg) scaleX(-1)",
			"tb-lr": "",
			"bt-lr": "scaleY(-1)",
			"tb-rl": "scaleX(-1)",
			"bt-rl": "rotate(180deg)",
		},
		"bt-lr": {
			"lr-tb": "rotate(90deg)",
			"lr-bt": "rotate(90deg) scaleX(-1)",
			"rl-tb": "rotate(90deg) scaleY(-1)",
			"rl-bt": "rotate(-90deg)",
			"tb-lr": "scaleY(-1)",
			"bt-lr": "",
			"tb-rl": "rotate(180deg)",
			"bt-rl": "scaleX(-1)",
		},
		"tb-rl": {
			"lr-tb": "rotate(-90deg)",
			"lr-bt": "rotate(90deg) scaleY(-1)",
			"rl-tb": "rotate(90deg) scaleX(-1)",
			"rl-bt": "rotate(90deg)",
			"tb-lr": "scaleX(-1)",
			"bt-lr": "rotate(180deg)",
			"tb-rl": "",
			"bt-rl": "scaleY(-1)",
		},
		"bt-rl": {
			"lr-tb": "rotate(90deg) scaleX(-1)",
			"lr-bt": "rotate(90deg)",
			"rl-tb": "rotate(-90deg)",
			"rl-bt": "rotate(90deg) scaleY(-1)",
			"tb-lr": "rotate(180deg)",
			"bt-lr": "scaleX(-1)",
			"tb-rl": "scaleY(-1)",
			"bt-rl": "",
		},
	}[from][to];
	return {
		"": 0b000,
		"scaleX(-1)": 0b001,
		"scaleY(-1)": 0b010,
		"rotate(180deg)": 0b011,
		"rotate(90deg)": 0b100,
		"rotate(90deg) scaleX(-1)": 0b101,
		"rotate(90deg) scaleY(-1)": 0b110,
		"rotate(-90deg)": 0b111,
	}[result]!;
}
