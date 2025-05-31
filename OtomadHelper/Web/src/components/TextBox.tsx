// #region Spinner
const StyledSpinner = styled.div`
	@layer props {
		--shown: false;
	}

	${styles.mixins.flexCenter()};
	position: absolute;
	inset-block-start: 50%;
	inset-inline-end: 16px;
	z-index: 6; // Above ExpanderParent
	contain: size;

	.base {
		padding: 4px;
		background-color: ${c("background-fill-color-acrylic-background-default")};
		border: 1px solid ${c("stroke-color-surface-stroke-flyout")};
		border-radius: 8px;
		box-shadow: 0 8px 16px ${c("shadows-flyout")};
		backdrop-filter: blur(60px);
		cursor: default;

		button {
			${styles.mixins.square("40px")};
			display: flex;
			min-inline-size: unset;

			&:first-child:active .icon {
				translate: 0 -2px;
			}

			&:last-child:active .icon {
				translate: 0 2px;
			}
		}

		@container style(--shown: false) {
			scale: 0.75;
			opacity: 0;
			pointer-events: none;

			button:first-child .icon {
				translate: 0 14px;
			}

			button:last-child .icon {
				translate: 0 -14px;
			}
		}
	}
`;

type SpinValue = 1 | -1;

function Spinner({ disabled, step = 1, onSpin, onRelease }: FCP<{
	/** Disabled? */
	disabled?: boolean;
	/** The value to increase or decrease each time the knob of numeric up down box is clicked. Defaults to 1. */
	step?: NumberLike;
	/** Knob click event. It is 1 when the knob is clicked up and -1 when it is clicked down. */
	onSpin?(spinValue: NumberLike): void;
	/** Mouse release button event. */
	onRelease?: BaseEventHandler;
}>) {
	function spinWithValue(spinValue: SpinValue) {
		const spin = typeof step === "bigint" ? BigInt(spinValue) * step : spinValue * step;
		onSpin?.(spin);
	}

	return (
		<StyledSpinner>
			<div className="base">
				<Button
					subtle
					icon="spinner/chevron_up"
					disabled={disabled}
					repeat
					tabIndex={-1}
					aria-label={t.increase}
					onClick={() => spinWithValue(1)}
					onRelease={onRelease}
				/>
				<Button
					subtle
					icon="spinner/chevron_down"
					disabled={disabled}
					repeat
					tabIndex={-1}
					aria-label={t.decrease}
					onClick={() => spinWithValue(-1)}
					onRelease={onRelease}
				/>
			</div>
		</StyledSpinner>
	);
}
// #endregion

export /* @internal */ const inSettingsCardTrailing = ":where(.settings-card > .base, .expander-item) > .trailing";

export /* @internal */ const inputInSettingsCardStyle = css`
	${inSettingsCardTrailing} > .stack-panel > :where(&),
	${inSettingsCardTrailing} > :where(&) {
		inline-size: 200px;
		max-inline-size: calc(50cqw - 13px);
	}
`;

export /* @internal */ const StyledTextBox = styled.div`
	position: relative;
	background-color: ${c("fill-color-control-default")};
	border-radius: 4px;
	box-shadow: 0 0 0 1px ${c("stroke-color-control-stroke-default")} inset;
	cursor: text;
	forced-color-adjust: none;

	.wrapper {
		display: flex;
		align-items: stretch;
	}

	${inputInSettingsCardStyle}

	.expander-child-wrapper :where(&) {
		inline-size: 200px;
	}

	input {
		${styles.effects.text.body};
		z-index: 1;
		width: 100%;
		padding: 6px 12px 7px;
		transition: ${fallbackTransitions}, padding-inline 0s;

		&:focus {
			box-shadow: none;
		}

		&::placeholder {
			color: ${c("fill-color-text-secondary")};
		}

		&:disabled::selection { // Have fixed the issue where text can still be selected even though the input box is disabled.
			color: inherit;
			background-color: transparent;
		}
	}

	.prefix {
		margin-inline-end: -4px;
		padding-inline-start: 12px;
	}

	.suffix {
		margin-inline-start: -4px;
		padding-inline-end: 12px;
	}

	.positive-sign {
		margin-inline-start: 12px;

		+ input {
			padding-inline-start: 0;
		}
	}

	.spinner-icon {
		position: relative;
		margin-inline-start: -6px;
		padding-inline-end: 6px;
	}

	.prefix,
	.suffix,
	.positive-sign,
	.spinner-icon {
		${styles.mixins.hideIfEmpty()};
		${styles.mixins.gridCenter()};
		margin-block-end: 1px;
		white-space: nowrap;
	}

	&:hover {
		background-color: ${c("fill-color-control-secondary")};
	}

	&:active,
	&:focus-within,
	.timecode-box:focus-within & {
		background-color: ${c("fill-color-control-input-active")};

		.stripes .focus-stripe {
			scale: 1;
		}
	}

	&:has(input:disabled) {
		color: ${c("fill-color-text-disabled")};
		background-color: ${c("fill-color-control-disabled")};
		cursor: not-allowed;

		.stripes * {
			scale: 0;
		}
	}

	${ifColorScheme.contrast} & {
		color: ${cc("ButtonText")};
	}

	[aria-readonly="true"] &,
	&:has(input:read-only) {
		background-color: ${c("fill-color-control-disabled")};

		.stripes * {
			scale: 0;
		}

		.spinner-icon {
			color: ${c("fill-color-text-disabled")};
		}
	}

	&:focus-within {
		.spinner {
			--shown: true;
		}

		.spinner-icon {
			margin-inline-start: 10px;
		}

		:is(.expander, .settings-card):has(&) {
			z-index: 1;
		}
	}

	.stripes {
		position: absolute;
		inset: 0;
		overflow: clip;
		border-radius: inherit;
		pointer-events: none;

		> * {
			position: absolute;
			bottom: 0;
			width: 100%;
			height: 1px;

			&.large-stripe {
				background-color: ${c("fill-color-control-strong-default")};
			}

			&.focus-stripe {
				height: 2px;
				background-color: ${c("accent-color")};
				scale: 0 1;
			}
		}
	}

	.custom-flyout {
		position: absolute !important;
		cursor: default;
	}
`;

export default function TextBox({ value: [value, _setValue], placeholder, disabled, readOnly, id, prefix, suffix, _spinner: spinner, _showPositiveSign: showPositiveSign, inputAttrs, customFlyout, onChange, onChanging, onInput, onKeyDown, ref, inputRef, ...htmlAttrs }: FCP<{
	/** The value of the input box. */
	value: StateProperty<string>;
	/** Content placeholder. */
	placeholder?: string;
	/** Read-only? */
	readOnly?: boolean;
	/** Prefix. */
	prefix?: string;
	/** Suffix. */
	suffix?: string;
	/** @private Numeric up down box */
	_spinner?(inputId: string): ReactNode;
	/** @private Show the positive sign? */
	_showPositiveSign?: boolean;
	/** Set the attributes for the input element. */
	inputAttrs?: FCP<{}, "input">;
	/** Ref to the input element. */
	inputRef?: MiscRef<HTMLInputElement>;
	/** Add your own flyout inside the textbox, must be absolute or fixed position. */
	customFlyout?: ReactNode;
	/** Text change event. Only occurs after pasting text or after the input box is out of focus. */
	onChange?: BaseEventHandler<HTMLInputElement>;
	/** Text changing event. Occurs any time the text changes. */
	onChanging?: BaseEventHandler<HTMLInputElement>;
	/** Text keyboard input event. */
	onInput?(newText: string, el: HTMLInputElement, ...event: Parameters<FormEventHandler<HTMLInputElement>>): boolean | string | void;
	/** Keyboard press event. */
	onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
	"aria-disabled"?: never;
	"aria-readonly"?: never;
}, "div">) {
	const inputId = id || useId();
	const inputEl = useDomRef<"input">();
	const wrapperEl = useDomRef<"div">();
	useImperativeHandleRef(ref, wrapperEl);
	useImperativeHandleRef(inputRef, inputEl);
	disabled = useContext(InteractionStateContext).disabled || disabled;

	const setValue = (value: string | undefined | ((value: string) => string | undefined)) =>
		value == null || _setValue?.(value as string);

	const handleChange = (e: Any) => { onChanging?.(e); onChange?.(e); };

	const handleInput = useCallback<FormEventHandler<HTMLInputElement>>(e => {
		const el = e.currentTarget ?? e.target;
		let newText = el.value;
		const caret = Caret.get(el);
		const handled = onInput?.(newText, el, e);
		if (handled === false) {
			setTimeout(() => caret !== null && Caret.set(el, caret - 1));
			return;
		} else if (typeof handled === "string") {
			newText = handled;
			Caret.set(el, caret);
		}
		setValue(newText); // true or undefined
		onChanging?.(e as never);
	}, [value]);

	const handleKeyDown = useCallback<KeyboardEventHandler<HTMLInputElement>>(e => {
		onKeyDown?.(e);
		if (e.code === "Enter" || e.code === "NumpadEnter") {
			inputEl.current?.blur();
			handleChange(e);
			stopEvent(e);
		}
	}, [onKeyDown]);

	return (
		<StyledTextBox
			ref={wrapperEl}
			disabled={disabled}
			aria-disabled={disabled || undefined}
			onClick={e => e.stopPropagation()}
			{...htmlAttrs}
		>
			<div className="wrapper">
				<label className="prefix" htmlFor={inputId}>{prefix}</label>
				{showPositiveSign && <label className="positive-sign" htmlFor={inputId}>+</label>}
				<input
					ref={inputEl}
					id={inputId}
					type="text"
					value={value}
					placeholder={placeholder}
					disabled={disabled || undefined}
					aria-disabled={disabled || undefined}
					readOnly={readOnly}
					aria-readonly={readOnly}
					autoComplete="off"
					onInput={handleInput}
					onPaste={handleChange}
					onKeyDown={handleKeyDown}
					onMouseDown={onChanging}
					{...inputAttrs}
				/>
				<label className="suffix" htmlFor={inputId}>{suffix}</label>
				{spinner?.(inputId)}
			</div>
			<div className="stripes">
				<div className="large-stripe" />
				<div className="focus-stripe" />
			</div>
			{customFlyout && <div className="custom-flyout">{customFlyout}</div>}
		</StyledTextBox>
	);
}

type NumberLike = number | bigint;
function NumberTextBox<TNumber extends NumberLike>({ value: [value, _setValue], disabled, readOnly, decimalPlaces, keepTrailing0, min, max, spinnerStep, keyBigStepMultiplier, positiveSign, inputRef, ...textBoxProps }: Override<OmitPrivates<PropsOf<typeof TextBox>>, {
	/** The value of the number, which can be number or bigint type. */
	value: StateProperty<TNumber>;
	/** The number of decimal places, leaving blank means no limit. */
	decimalPlaces?: number;
	/** Keep trailing zeros in the fractional part? */
	keepTrailing0?: boolean;
	/** Limit of the minimum value. */
	min?: TNumber;
	/** Limit of the maximum value. */
	max?: TNumber;
	/** The value to increase or decrease each time the knob of numeric up down box is clicked. Defaults to 1. */
	spinnerStep?: TNumber;
	/**
	 * According to the Accessibility feature, when user press PageUp and PageDown key, it will adjust a larger number than the `keyStep`.
	 * Please specify a number which will multiply by the `keyStep`. Defaults to 10.
	 */
	keyBigStepMultiplier?: TNumber;
	/** Show the positive sign if the value is positive? */
	positiveSign?: boolean;
}>) {
	const inputEl = useDomRef<"input">();
	useImperativeHandleRef(inputRef, inputEl);
	const bigIntMode = typeof value === "bigint";
	keyBigStepMultiplier ??= (bigIntMode ? 10n : 10) as TNumber;
	const intMode = bigIntMode || decimalPlaces === 0;
	const [displayValue, setDisplayValue] = useState<string>();

	const setValue = (value: TNumber | undefined | ((value: TNumber) => TNumber | undefined)) => (_setValue as SetStateNarrow<TNumber>)?.(prevValue => {
		if (typeof value === "function") value = value(prevValue);
		if (value == null || typeof value === "number" && !Number.isFinite(value)) return prevValue;
		return clamp(value, min!, max!);
	});

	function normalizeValue(value?: NumberLike) {
		if (isUndefinedNullNaN(value)) return "";
		value = clamp(value, min!, max!);
		let result = normalizeNumber(value);
		if (decimalPlaces !== undefined && typeof value === "number") {
			if (typeof decimalPlaces !== "number" || decimalPlaces < 0 || decimalPlaces > 100)
				throw new Error(`Decimal places argument must be between 0 and 100, got ${decimalPlaces}`);
			result = value.toFixed(decimalPlaces);
		}
		if (!keepTrailing0 && result.includes("."))
			result = result.replace(/\.?0+$/, "");
		return result;
	}

	function parseText(text: string) {
		if (intMode) {
			text = text.match(/-?\d+/)?.[0] ?? "";
			return (bigIntMode ? BigInt(text) : Number(text)) as TNumber;
		} else {
			text = text.replaceAll(/\.+/g, ".").match(/-?\d*\.\d+/)?.[0] ?? text.match(/-?\d+/)?.[0] ?? "";
			return Number(text) as TNumber;
		}
	}

	function handleInput(text: string) {
		if (text === "")
			return;
		else if (text.match(/[^\d.-]/) || text.indexOf("-", 1) >= 0 || text.count(".") >= 2)
			return false;
		const value = text.match(/-?\d*\.?\d*/)?.[0].replace(/(?<=^-?)0+(?=\d)/, "");
		if (!value) // undefined or ""
			return false;
		else if (intMode && text.includes("."))
			return false;
		else
			return value;
	}

	const setValueFromTextBox = (text: string) => {
		setDisplayValue(text);
		setValue(parseText(text));
	};

	const updateDisplayValue = (value?: NumberLike) => setDisplayValue(normalizeValue(value));

	const handleBlurChange: BaseEventHandler<HTMLInputElement> = e => {
		const el = e.currentTarget ?? e.target;
		let value = el.value;
		if (e.nativeEvent instanceof ClipboardEvent && e.nativeEvent.clipboardData) {
			e.preventDefault();
			const { clipboardData } = e.nativeEvent;
			if (![...clipboardData.items].find(item => item.kind === "string")) return;
			value = e.nativeEvent.clipboardData.getData("text");
		} else if (e.type === "blur" && e.nativeEvent instanceof FocusEvent && isInPath(e.nativeEvent.relatedTarget, ".spinner"))
			return;
		updateDisplayValue(parseText(value));
	};

	useEffect(() => {
		const newValue = value, oldValue = displayValue && parseText(displayValue);
		if (newValue !== oldValue) updateDisplayValue(value);
	}, [value, decimalPlaces]);

	const setCaretToPoint = () => {
		if (inputEl.current) {
			const pointIndex = inputEl.current.value.indexOf(".");
			let offset = 0;
			if (spinnerStep) {
				const step = normalizeNumber(spinnerStep);
				if (step.includes(".")) {
					const part = step.match(/(?<=\.)\d*/)?.[0].replace(/0+$/, "");
					if (part) offset = part.length + 1;
				} else {
					const part = step.match(/0+$/)?.[0];
					if (part) offset = -part.length;
				}
			}
			Caret.set(inputEl, pointIndex + offset);
		}
	};

	const handlePressSpin = (spinValue: NumberLike) => {
		setValue(value => {
			if (!(typeof value === "number" || typeof value === "bigint")) return undefined;
			const spin = typeof value === "bigint" ? BigInt(spinValue) : spinValue;
			const newValue = ((value as number) + (spin as number)) as TNumber;
			updateDisplayValue(newValue);
			return newValue;
		});
	};

	const handleReleaseSpin: BaseEventHandler<HTMLButtonElement> = e => {
		if (!(e.currentTarget instanceof HTMLElement)) return;
		if (!e.currentTarget.matches(":focus-visible")) // If the knob is pressed by the space on keyboard, do not auto focus on the input box.
			inputEl.current?.focus(); // If the knob is pressed by the mouse, it will auto focus on the input box.
		setCaretToPoint();
	};

	const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = e => {
		const baseStep = spinnerStep ?? 1;
		let step: NumberLike | undefined, limit: number | undefined;
		if (e.code === "ArrowUp") step = baseStep;
		else if (e.code === "ArrowDown") step = -baseStep;
		else if (e.code === "PageUp") step = baseStep * keyBigStepMultiplier;
		else if (e.code === "PageDown") step = -baseStep * keyBigStepMultiplier;
		else if (e.code === "Home") limit = -1;
		else if (e.code === "End") limit = 1;
		if (step || limit) {
			if (step && !limit)
				handlePressSpin(step);
			else if (limit)
				if (limit < 0 && min !== undefined) setValue(min);
				else if (limit > 0 && max !== undefined) setValue(max);
				else return;
			textBoxProps.onChanging?.(e);
			setTimeout(() => setCaretToPoint());
			stopEvent(e);
		}
	};

	return (
		<TextBox
			{...textBoxProps}
			disabled={disabled}
			readOnly={readOnly}
			value={[displayValue ?? "", setValueFromTextBox]}
			inputRef={inputEl}
			_showPositiveSign={positiveSign && value! > 0}
			onChange={handleBlurChange}
			onInput={handleInput}
			onKeyDown={handleKeyDown}
			_spinner={inputId => (
				<>
					<label className="spinner-icon" htmlFor={inputId}>
						<Icon name="scroll_up_down" />
					</label>
					{!readOnly && <Spinner onSpin={handlePressSpin} onRelease={handleReleaseSpin} disabled={disabled} step={spinnerStep} />}
				</>
			)}
		/>
	);
}

const StyledNumberUnitTextBox = styled.div`
	display: flex;
	align-items: center;

	.combo-box {
		inline-size: 10px;
	}

	.expander-item & :where(.text-box) {
		inline-size: 200px;
	}
`;

function NumberUnitTextBox<TUnit extends string>({ value: [[value, unit], set], units, unitNames, disabled, ...numberTextBoxProps }: Override<PropsOf<typeof NumberTextBox<number>>, {
	/** Numeric value and its unit type. */
	value: StatePropertyNonNull<Unit<TUnit>>;
	/** All unit types. */
	units: readonly TUnit[];
	/** All unit type names, or get the plural unit type names from the value (count). */
	unitNames: readonly Readable[] | ((value: number) => readonly Readable[]);
}>) {
	const setValue = (newValue: React.SetStateAction<number>) => set(([, unit]) => [typeof newValue === "function" ? newValue(value) : newValue, unit]);
	const setUnit = (newUnit: React.SetStateAction<TUnit>) => set(([value]) => [value, typeof newUnit === "function" ? newUnit(unit) : unit]);

	return (
		<StyledNumberUnitTextBox>
			<NumberTextBox value={[value, setValue]} {...numberTextBoxProps} disabled={disabled} />
			<ComboBox current={[unit, setUnit]} ids={units} options={typeof unitNames === "function" ? unitNames(value) : unitNames} disabled={disabled} />
		</StyledNumberUnitTextBox>
	);
}

TextBox.Number = NumberTextBox;
TextBox.NumberUnit = NumberUnitTextBox;
