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
export default function SliderWithBox({ value, min = 0, max = 100, defaultValue, decimalPlaces = 3, keyStep = 1, keyBigStepMultiplier = 10, positiveSign, placeholder, prefix, suffix, disabled, smoothlyDisplayValue, staticSmoothInterval, onChanging, onChange }: FCP<{
	/** Current value. */
	value: StateProperty<number>;
	/** Slider minimum value. @default 0 */
	min?: number;
	/** Slider maximum value. @default 100 */
	max?: number;
	/** Slider default value. Restore defaults when clicking the mouse middle button, right button, or touchscreen long press component. */
	defaultValue?: number;
	/** The number of decimal places, leaving blank means no limit. */
	decimalPlaces?: number;
	/** Specifies the value by which the slider adjusts once when a keyboard arrow key is pressed. @default 1 */
	keyStep?: number;
	/**
	 * According to the Accessibility feature, when user press PageUp and PageDown key, it will adjust a larger number than the `keyStep`.
	 * Please specify a number which will multiply by the `keyStep`.
	 * @default 10
	 */
	keyBigStepMultiplier?: number;
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
	/** Slider - Make the display value change smoothly? @default true */
	smoothlyDisplayValue?: boolean;
	/** Slider - Use a static smooth value speed interval instead of automatically detect by screen refresh rate. */
	staticSmoothInterval?: number;
	children?: never;
	/** Occurs when the slider is being dragged. */
	onChanging?(value: number): void;
	/** Occurs when the slider is lifted after being dragged. */
	onChange?(value: number): void;
}>) {
	return (
		<StyledSliderWithBox>
			<TextBox.Number
				value={value}
				min={min}
				max={max}
				decimalPlaces={decimalPlaces}
				spinnerStep={keyStep}
				keyBigStepMultiplier={keyBigStepMultiplier}
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
				keyBigStepMultiplier={keyBigStepMultiplier}
				disabled={disabled}
				autoClampValue
				smoothlyDisplayValue={smoothlyDisplayValue}
				staticSmoothInterval={staticSmoothInterval}
				aria-hidden
				onChange={onChange}
				onChanging={onChanging}
			/>
		</StyledSliderWithBox>
	);
}
