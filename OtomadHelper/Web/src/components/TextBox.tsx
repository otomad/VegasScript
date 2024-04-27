const StyledSpinner = styled.div`
	@layer props {
		--shown: false;
	}

	${styles.mixins.flexCenter()};
	position: absolute;
	inset-block-start: 50%;
	inset-inline-end: 16px;
	z-index: 2;
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
			min-width: unset;

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

const wrapKeyCode = (code: string, action: (e: Any) => void) => (e: KeyboardEvent) => e.code === code && action(e);

function Spinner({ disabled, step = 1, onSpin, onRelease }: FCP<{
	/** Disabled */
	disabled?: boolean;
	/** The value to increase or decrease each time the knob of numeric up down box is clicked. Defaults to 1. */
	step?: NumberLike;
	/** Knob click event. It is 1 when the knob is clicked up and -1 when it is clicked down. */
	onSpin?: (spinValue: NumberLike) => void;
	/** Mouse release button event. */
	onRelease?: BaseEventHandler;
}>) {
	const repeatTimeout = useRef<Timeout>();
	const clearRepeatInterval = () => clearInterval(repeatTimeout.current);

	const handleRelease = useCallback<MouseEventHandler & KeyboardEventHandler>(e => {
		clearRepeatInterval();
		onRelease?.(e);
	}, [onRelease]);

	const handlePress = useCallback((spinValue: SpinValue) => {
		const spin = typeof step === "bigint" ? BigInt(spinValue) * step : spinValue * step;
		onSpin?.(spin);
		clearRepeatInterval();
		const startTime = Date.now();
		repeatTimeout.current = setInterval(() => {
			if (Date.now() - startTime > 350)
				onSpin?.(spin);
		}, 50);
	}, [onSpin]);

	useEventListener(document, "mouseup", handleRelease as never);

	return (
		<StyledSpinner>
			<div className="base">
				<Button
					subtle
					icon="spinner/chevron_up"
					disabled={disabled}
					onMouseDown={() => handlePress(1)}
					onMouseUp={handleRelease}
					onKeyDown={wrapKeyCode("Space", () => handlePress(1))}
					onKeyUp={wrapKeyCode("Space", handleRelease)}
				/>
				<Button
					subtle
					icon="spinner/chevron_down"
					disabled={disabled}
					onMouseDown={() => handlePress(-1)}
					onMouseUp={handleRelease}
					onKeyDown={wrapKeyCode("Space", () => handlePress(-1))}
					onKeyUp={wrapKeyCode("Space", handleRelease)}
				/>
			</div>
		</StyledSpinner>
	);
}

const StyledTextBox = styled.div`
	position: relative;
	background-color: ${c("fill-color-control-default")};
	border-radius: 4px;
	box-shadow: 0 0 0 1px ${c("stroke-color-control-stroke-default")} inset;
	cursor: text;

	.wrapper {
		display: flex;
		align-items: stretch;
	}

	input {
		z-index: 1;
		width: 100%;
		padding: 6px 12px 7px;

		&:focus {
			box-shadow: none;
		}

		&::placeholder {
			color: ${c("fill-color-text-secondary")};
		}

		&::selection {
			color: ${c("fill-color-text-on-accent-selected-text")};
			background-color: ${c("accent-color")};
		}

		&[disabled]::selection { // Fixed the issue where text can still be selected even though the input box is disabled.
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

	.spinner-icon {
		position: relative;
		margin-inline-start: -6px;
		padding-inline-end: 6px;
	}

	.prefix,
	.suffix,
	.spinner-icon {
		${styles.mixins.hideIfEmpty()};
		${styles.mixins.gridCenter()};
		margin-block-end: 1px;
	}

	&:hover {
		background-color: ${c("fill-color-control-secondary")};
	}

	&:active,
	&:focus-within {
		background-color: ${c("fill-color-control-input-active")};

		.stripes .focus-stripe {
			scale: 1;
		}
	}

	&:has(input[disabled]) {
		background-color: ${c("fill-color-control-disabled")};
		cursor: not-allowed;

		.wrapper {
			opacity: ${c("disabled-text-opacity")};
		}

		.stripes .focus-stripe {
			scale: 0;
		}
	}

	&:focus-within {
		.spinner {
			--shown: true;
		}

		.spinner-icon {
			margin-inline-start: 10px;
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
`;

const TextBox = forwardRef(function TextBox({ value: [value, _setValue], placeholder, disabled, prefix, suffix, _spinner: spinner, onChange, onInput, onKeyDown, ...htmlAttrs }: FCP<{
	/** The value of the input box. */
	value: StateProperty<string>;
	/** Content placeholder. */
	placeholder?: string;
	/** Prefix. */
	prefix?: string;
	/** Suffix. */
	suffix?: string;
	/** @private Numeric up down box */
	_spinner?: (inputId: string) => ReactNode;
	/** Text change event. Only fired after pasting text or after the input box is out of focus. */
	onChange?: BaseEventHandler<HTMLInputElement>;
	/** Text keyboard input event. */
	onInput?: (newText: string, el: HTMLInputElement, ...event: Parameters<FormEventHandler<HTMLInputElement>>) => boolean | string | void;
	/** Keyboard press event. */
	onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
}, "div">, ref: ForwardedRef<"input">) {
	const inputId = useId();
	const inputEl = useDomRef<"input">();
	useImperativeHandle(ref, () => inputEl.current!);

	const setValue = (value: string | undefined | ((value: string) => string | undefined)) =>
		value == null || _setValue?.(value as string);

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
	}, [value, setValue]);

	const handleKeyDown = useCallback<KeyboardEventHandler<HTMLInputElement>>(e => {
		onKeyDown?.(e);
		if (e.key === "Enter") { // Don't use `e.code` or NumpadEnter won't work
			inputEl.current?.blur();
			stopEvent(e);
		}
	}, []);

	return (
		<StyledTextBox {...htmlAttrs}>
			<div className="wrapper">
				<label className="prefix" htmlFor={inputId}>{prefix}</label>
				<input
					ref={inputEl}
					id={inputId}
					type="text"
					value={value}
					placeholder={placeholder}
					disabled={disabled}
					autoComplete="off"
					onInput={handleInput}
					onPaste={onChange}
					onBlur={onChange}
					onKeyDown={handleKeyDown}
				/>
				<label className="suffix" htmlFor={inputId}>{suffix}</label>
				{spinner?.(inputId)}
			</div>
			<div className="stripes">
				<div className="large-stripe" />
				<div className="focus-stripe" />
			</div>
		</StyledTextBox>
	);
});

type NumberLike = number | bigint;
function NumberTextBox<TNumber extends NumberLike>({ value: [value, _setValue], disabled, decimalPlaces, keepTrailing0, min, max, spinnerStep, ...textBoxProps }: Override<PropsOf<typeof TextBox>, {
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
}>) {
	const inputEl = useDomRef<"input">();
	const bigIntMode = typeof value === "bigint";
	const [displayValue, setDisplayValue] = useState("");

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
		if (bigIntMode) {
			text = text.match(/-?\d+/)?.[0] ?? "";
			return BigInt(text) as TNumber;
		} else {
			text = text.replaceAll(/\.+/g, ".").match(/-?\d*\.\d+/)?.[0] ?? text.match(/-?\d+/)?.[0] ?? "";
			return Number(text) as TNumber;
		}
	}

	function handleInput(text: string) {
		if (text === "")
			return;
		else if (text.match(/[^\d.-]/) || text.indexOf("-", 1) >= 0 || text.countChar(".") >= 2)
			return false;
		const value = text.match(/-?\d*\.?\d*/)?.[0].replace(/(?<=^-?)0+(?=\d)/, "");
		if (!value) // undefined or ""
			return false;
		else
			return value;
	}

	const setValueFromTextBox = (text: string) => {
		setDisplayValue(text);
		setValue(parseText(text));
	};

	const updateDisplayValue = (value?: NumberLike) => setDisplayValue(normalizeValue(value));

	const handleBlurChange = useCallback<BaseEventHandler<HTMLInputElement>>(e => {
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
	}, []);

	useEffect(() => {
		const newValue = value, oldValue = parseText(displayValue);
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

	const handlePressSpin = useCallback((spinValue: NumberLike) => {
		setValue(value => {
			if (!(typeof value === "number" || typeof value === "bigint")) return undefined;
			const spin = typeof value === "bigint" ? BigInt(spinValue) : spinValue;
			const newValue = ((value as number) + (spin as number)) as TNumber;
			updateDisplayValue(newValue);
			return newValue;
		});
	}, [value]);

	const handleReleaseSpin = useCallback<BaseEventHandler<HTMLButtonElement>>(e => {
		if (!(e.currentTarget instanceof HTMLElement)) return;
		if (!e.currentTarget.matches(":focus-visible")) // If the knob is pressed by the space on keyboard, do not auto focus on the input box.
			inputEl.current?.focus(); // If the knob is pressed by the mouse, it will auto focus on the input box.
		setCaretToPoint();
	}, [spinnerStep]);

	const handleKeyDown = useCallback<KeyboardEventHandler<HTMLInputElement>>(e => {
		const baseStep = spinnerStep ?? 1;
		let step;
		if (e.code === "ArrowUp") step = baseStep;
		else if (e.code === "ArrowDown") step = -baseStep;
		if (step) {
			handlePressSpin(step);
			setTimeout(() => setCaretToPoint());
			stopEvent(e);
		}
	}, [spinnerStep, handlePressSpin]);

	return (
		<TextBox
			{...textBoxProps}
			disabled={disabled}
			value={[displayValue, setValueFromTextBox]}
			ref={inputEl}
			onChange={handleBlurChange}
			onInput={handleInput}
			onKeyDown={handleKeyDown}
			_spinner={inputId => (
				<>
					<label className="spinner-icon" htmlFor={inputId}>
						<Icon name="scroll_up_down" />
					</label>
					<Spinner onSpin={handlePressSpin} onRelease={handleReleaseSpin} disabled={disabled} step={spinnerStep} />
				</>
			)}
		/>
	);
}

export default functionModule(TextBox, {
	Number: NumberTextBox,
});
