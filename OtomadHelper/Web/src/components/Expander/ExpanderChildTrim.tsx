const StyledExpanderChildTrim = styled(Expander.ChildWrapper)`
	justify-content: space-between;

	&,
	.timecodes {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		align-items: center;
	}

	.timecodes.has-child-wrapped .range-dash {
		writing-mode: vertical-rl;
	}
`;

const RangeDash = () => <div className="range-dash">{t.rangeDash}</div>;

function ExpanderChildTrimTimecode({ start, end }: FCP<{
	children?: never;
	/** Start time time code. */
	start: StateProperty<string>;
	/** End time time code. */
	end: StateProperty<string>;
}, "div">) {
	function reset() {
		start[1]?.("0");
		end[1]?.("0");
	}

	return (
		<StyledExpanderChildTrim>
			<VerticalIfFlexWrap className="timecodes">
				<TimecodeBox timecode={start} />
				<RangeDash />
				<TimecodeBox timecode={end} />
			</VerticalIfFlexWrap>
			<Button icon="arrow_reset" accent="critical" subtle extruded onClick={reset}>{t.reset}</Button>
		</StyledExpanderChildTrim>
	);
}

function ExpanderChildTrimValue({ start, end, unit = t.units.millisecond, decimalPlaces, min, max, spinnerStep }: FCP<{
	children?: never;
	/** Start time value. */
	start: StateProperty<number>;
	/** End time value. */
	end: StateProperty<number>;
	/** Value unit. */
	unit?: string;
	/** The number of decimal places, leaving blank means no limit. */
	decimalPlaces?: number;
	/** Limit of the minimum value. */
	min?: number;
	/** Limit of the maximum value. */
	max?: number;
	/** The value to increase or decrease each time the knob of numeric up down box is clicked. Defaults to 1. */
	spinnerStep?: number;
}, "div">) {
	return (
		<StyledExpanderChildTrim>
			<VerticalIfFlexWrap className="timecodes">
				<TextBox.Number
					value={start}
					suffix={unit}
					decimalPlaces={decimalPlaces}
					min={min}
					max={minWithUndefined(max, end[0])}
					spinnerStep={spinnerStep}
				/>
				<RangeDash />
				<TextBox.Number
					value={end}
					suffix={unit}
					decimalPlaces={decimalPlaces}
					min={maxWithUndefined(min, start[0])}
					max={max}
					spinnerStep={spinnerStep}
				/>
			</VerticalIfFlexWrap>
		</StyledExpanderChildTrim>
	);
}

/**
 * Calculates the minimum value from an array of numbers, excluding any undefined values.
 * @param values - An array of numbers and/or undefined values.
 * @returns The minimum number from the input array, excluding undefined values.
 */
function minWithUndefined(...values: (number | undefined)[]) {
	return Math.min(...values.toTrimmed());
}
/**
 * Calculates the maximum value from an array of numbers, excluding any undefined values.
 * @param values - An array of numbers and/or undefined values.
 * @returns The maximum number from the input array, excluding undefined values.
 */
function maxWithUndefined(...values: (number | undefined)[]) {
	return Math.max(...values.toTrimmed());
}

const ExpanderChildTrim = {
	Timecode: ExpanderChildTrimTimecode,
	Value: ExpanderChildTrimValue,
};

export default ExpanderChildTrim;
