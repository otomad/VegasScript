const directions = ["lr-tb", "lr-bt", "rl-tb", "rl-bt", "tb-lr", "bt-lr", "tb-rl", "bt-rl"] as const;

export default function Test() {
	return (
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
				`)}
			</style>
			<tbody>
				{directions.map(from => (
					<tr key={from}>
						<td><b>{from}</b></td>
						{directions.map(to => (
							<td key={to}>
								<div style={{ transform: transformFlowDirection(from, to) }}>
									<Icon name="lr_tb" style={{ transform: transformFlowDirection(from) }} />
								</div>
								<p>{to}</p>
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}
