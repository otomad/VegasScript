const StyledSliderWithBox = styled.div`
	display: flex;
	gap: 12px;
	align-items: center;

	.text-box {
		inline-size: 125px;
	}
`;

/**
 * Combine a slider and a numeric text box organically.
 */
export default function SliderWithBox({ value, min = 0, max = 100, defaultValue, decimalPlaces = 3, keyStep = 1, keyLargeStepMultiple = 10, positiveSign, placeholder, prefix, suffix, disabled }: FCP<{
	/** Current value. */
	value: StateProperty<number>;
	/** Slider minimum value. */
	min?: number;
	/** Slider maximum value. */
	max?: number;
	/** Slider default value. Restore defaults when clicking the mouse middle button, right button, or touchscreen long press component. */
	defaultValue?: number;
	/** The number of decimal places, leaving blank means no limit. */
	decimalPlaces?: number;
	/** Specifies the value by which the slider adjusts once when a keyboard arrow key is pressed. Defaults to 1. */
	keyStep?: number;
	/**
	 * According to the Accessibility feature, when user press PageUp and PageDown key, it will adjust a larger number than the `keyStep`.
	 * Please specify a number which will multiply by the `keyStep`. Defaults to 10.
	 */
	keyLargeStepMultiple?: number;
	/** Show the positive sign if the value is positive? */
	positiveSign?: boolean;
	/** Content placeholder. */
	placeholder?: string;
	/** Prefix. */
	prefix?: string;
	/** Suffix. */
	suffix?: string;
	/** Disabled? */
	disabled?: boolean;
	children?: never;
}>) {
	return (
		<StyledSliderWithBox>
			<TextBox.Number
				value={value}
				min={min}
				max={max}
				decimalPlaces={decimalPlaces}
				spinnerStep={keyStep}
				keyLargeStepMultiple={keyLargeStepMultiple}
				positiveSign={positiveSign}
				placeholder={placeholder}
				prefix={prefix}
				suffix={suffix}
				disabled={disabled}
			/>
			<Slider
				value={value}
				min={min}
				max={max}
				defaultValue={defaultValue}
				step={10 ** -decimalPlaces}
				keyStep={keyStep}
				keyLargeStepMultiple={keyLargeStepMultiple}
				disabled={disabled}
				autoClampValue
				aria-hidden
			/>
		</StyledSliderWithBox>
	);
}
