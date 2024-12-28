import { inSettingsCardTrailing } from "./TextBox";

const THUMB_SIZE = 20;
const TRACK_THICKNESS = 4;
const valueCalc = "calc(var(--value) * (100% - var(--thumb-size)))";
const thumbSizeHalf = "calc(var(--thumb-size) / 2)";

const StyledSlider = styled.div`
	--value: 0;
	--buffered: 0;
	position: relative;
	touch-action: none;

	:where(&) {
		width: 100%;
	}

	${inSettingsCardTrailing} & {
		inline-size: 300px;
	}

	> * {
		--thumb-size: ${THUMB_SIZE}px;
		--track-thickness: ${TRACK_THICKNESS}px;
	}

	.track {
		height: calc(var(--thumb-size) + var(--track-thickness));
		padding-block: ${thumbSizeHalf};

		&::after {
			content: "";
			display: block;
			background-color: ${c("fill-color-control-strong-default")};
		}
	}

	.track::after,
	.passed {
		${styles.mixins.oval()};
		height: var(--track-thickness);
	}

	.passed {
		position: absolute;
		top: 0;
		width: ${valueCalc};
		margin-block: ${thumbSizeHalf};
		background-color: ${c("accent-color")};
		pointer-events: none;
		transition: background-color ${eases.easeOutMax} 250ms;
	}

	.thumb {
		${styles.mixins.square("var(--thumb-size)")};
		${styles.mixins.circle()};
		${styles.mixins.flexCenter()};
		position: absolute;
		inset-block-start: calc(var(--track-thickness) / 2);
		inset-inline-start: ${valueCalc};
		background-color: ${c("fill-color-control-solid-default")};
		box-shadow:
			0 0 0 1px ${c("stroke-color-control-stroke-default")},
			0 1px 0 ${c("stroke-color-control-stroke-default")};
		transition: ${fallbackTransitions}, ${styles.effects.focusRingTransitions}, inset-inline-start 0s !important;

		&::after {
			content: "";
			${styles.mixins.square("100%")};
			${styles.mixins.circle()};
			display: block;
			background-color: ${c("accent-color")};
			scale: ${12 / 20};
			transition: ${fallbackTransitions}, scale ${eases.easeOutBackSmooth} 250ms !important;
		}

		&:hover::after {
			scale: ${14 / 20};
		}
	}

	.track:active ~ .thumb::after,
	.thumb:active::after,
	.thumb.pressed::after {
		scale: ${10 / 20} !important;
	}

	&[disabled] {
		.track::after {
			background-color: ${c("fill-color-control-strong-disabled")};
		}

		.passed,
		.thumb::after {
			background-color: ${c("fill-color-accent-disabled")};
		}
	}

	${styles.mixins.forwardFocusRing(".thumb")};
`;

const StyledSliderWrapper = styled.div`
	display: flex;
	gap: 8px;
	align-items: center;

	.display-value {
		${styles.effects.text.body};
		color: ${c("fill-color-text-secondary")};
		font-variant-numeric: tabular-nums;
	}
`;

export default function Slider({ value: [value, setValue], min = 0, max = 100, autoClampValue, defaultValue, step, keyStep = 1, keyLargeStepMultiple = 10, displayValueStep, smoothDisplayValue = true, disabled = false, displayValue: _displayValue = false, staticSmoothInterval: staticInterval, onChanging, onChanged, onDisplayValueChanged }: FCP<{
	/** Current value. */
	value: StateProperty<number>;
	/** Slider minimum value. */
	min?: number;
	/** Slider maximum value. */
	max?: number;
	/** If `min` and `max` changed dynamically, automatically clamp the value that would not exceed the range? */
	autoClampValue?: boolean;
	/** Slider default value. Restore defaults when clicking the mouse middle button, right button, or touchscreen long press component. */
	defaultValue?: number;
	/** Slider effective increment value. */
	step?: number;
	/** Specifies the value by which the slider adjusts once when a keyboard arrow key is pressed. Defaults to 1. */
	keyStep?: number;
	/**
	 * According to the Accessibility feature, when user press PageUp and PageDown key, it will adjust a larger number than the `keyStep`.
	 * Please specify a number which will multiply by the `keyStep`. Defaults to 10.
	 */
	keyLargeStepMultiple?: number;
	/** The display value decimal places will accept it, or use `step` if it is undefined. */
	displayValueStep?: number;
	/** Make the display value smoothly? Defaults to true. */
	smoothDisplayValue?: boolean;
	/** Disabled */
	disabled?: boolean;
	/** Show the text indicates the value? Or get the display text from the value. */
	displayValue?: boolean | ((value: number) => Readable) | Readable;
	/**
	 * Use a static smooth value speed interval instead of automatically detect by screen refresh rate,
	 * useful when performing high-performance calculations.\
	 * If set to 0, the smooth value will be disabled.
	 */
	staticSmoothInterval?: number;
	/** The slider is dragging event. */
	onChanging?(value: number): void;
	/** The slider is lifted after being dragged event. */
	onChanged?(value: number): void;
	/** Occurs when you want to get the display value. */
	onDisplayValueChanged?(value: Readable | undefined): void;
}>) {
	const errorInfo = `The value range should be between [${min} ~ ${max}], with the current value being ${value}.`;
	if (value === undefined || Number.isNaN(value))
		throw new ReferenceError("value undefined");
	if (min > max)
		throw new RangeError(`Is the minimum value of Slider greater than the maximum value? The minimum value is ${min}, and the maximum value is ${max}`);
	if (value < min)
		if (autoClampValue) setValue?.(min);
		else throw new RangeError("The value of Slider is lesser than the minimum value. " + errorInfo);
	if (value > max)
		if (autoClampValue) setValue?.(max);
		else throw new RangeError("The value of Slider is greater than the maximum value. " + errorInfo);

	const restrict = (n: number | undefined, nanValue: number) => Number.isFinite(n) ? clamp(map(n!, min, max, 0, 1), 0, 1) : nanValue;
	const sharpValue = useMemo(() => restrict(value, 0), [value, min, max]);
	const smoothValue = staticInterval === 0 ? sharpValue : useSmoothValue(sharpValue, 0.5, { staticInterval });
	// Modify this parameter to adjust the smooth movement value of the slider.
	const [pressed, setPressed] = useState(false);

	function resetToDefault(e: MouseEvent) {
		e.preventDefault();
		if (defaultValue !== undefined && Number.isFinite(defaultValue)) {
			setValue?.(defaultValue);
			onChanging?.(defaultValue);
			onChanged?.(defaultValue);
		}
	}

	function clampValue(value: number) {
		value = clamp(value, min, max);
		if (step !== undefined)
			value = Math.round((value - min) / step) * step + min;
		return value;
	}

	function onThumbDown(e: PointerEvent, triggerByTrack: boolean = false) {
		if (e.button) { resetToDefault(e); return; }
		setPressed(true);
		const thumb = (e.currentTarget as HTMLDivElement).parentElement!.querySelector(".thumb") as HTMLDivElement;
		const thumbSize = thumb.offsetWidth;
		const track = thumb.parentElement!.querySelector(".track")!;
		const { left, width } = track.getBoundingClientRect();
		const x = triggerByTrack ? thumbSize / 2 : e.clientX - left - thumb.offsetLeft * configStore.settings.uiScale1;
		const pointerMove = lodash.debounce((e: PointerEvent) => {
			const position = clamp(e.clientX - left - x, 0, width - thumbSize);
			let value = clampValue(map(position, 0, width - thumbSize, min, max));
			if (isRtl()) value = max - value + min;
			setValue?.(value);
			onChanging?.(value);
		});
		const pointerUp = () => {
			thumb.removeEventListener("pointermove", pointerMove);
			thumb.removeEventListener("pointerup", pointerUp);
			thumb.releasePointerCapture(e.pointerId);
			onChanged?.(value!);
			nextAnimationTick().then(() => {
				setPressed(false);
			});
		};
		thumb.setPointerCapture(e.pointerId);
		thumb.addEventListener("pointermove", pointerMove);
		thumb.addEventListener("pointerup", pointerUp);
	}

	const onTrackDown: PointerEventHandler = e => {
		if (e.button) { resetToDefault(e); return; }
		const track = e.currentTarget as HTMLDivElement;
		const thumb = track.parentElement!.querySelector(".thumb") as HTMLDivElement;
		const thumbSizeHalf = thumb.offsetWidth / 2;
		const { width } = track.getBoundingClientRect();
		let value = clampValue(map(e.nativeEvent.offsetX, thumbSizeHalf, width - thumbSizeHalf, min, max));
		if (isRtl()) value = max - value + min;
		setValue?.(value);
		onChanging?.(value);
		onThumbDown(e, true); // Then call the dragging slider event.
	};

	const onKeyDown = useCallback<KeyboardEventHandler<HTMLDivElement>>(e => {
		const increase = e.code.in("ArrowUp", "ArrowRight", "PageUp", "End");
		const decrease = e.code.in("ArrowDown", "ArrowLeft", "PageDown", "Home");
		const largeStep = e.code.in("PageUp", "PageDown");
		if (!decrease && !increase) return;
		stopEvent(e);
		const newValue = e.code === "Home" ? min : e.code === "End" ? max :
			clampValue(value + (decrease ? -1 : 1) * keyStep * (largeStep ? keyLargeStepMultiple : 1));
		setValue?.(newValue);
	}, [value]);

	const displayValue = (() => {
		const smoothValue2 = map(smoothDisplayValue ? smoothValue : sharpValue, 0, 1, min, max);
		const step2 = displayValueStep ?? step;
		const steppedSmoothValue = step2 ? smoothValue2.toFixed(step2.countDecimals()) : smoothValue2;
		if (_displayValue === false || _displayValue === undefined) return undefined;
		else if (_displayValue === true) return steppedSmoothValue;
		else if (typeof _displayValue === "function") return _displayValue(+steppedSmoothValue);
		// It is possible to expose more types of values (such as the original value with long decimals, unclamped value, etc.), but it is unnecessary at the moment.
		else return _displayValue;
	})();

	useEffect(() => void onDisplayValueChanged?.(displayValue), [displayValue]);

	return (
		<StyledSliderWrapper>
			{hasValue(displayValue) && !onDisplayValueChanged && <span className="display-value" aria-hidden>{displayValue}</span>}
			<StyledSlider
				tabIndex={0}
				style={{
					"--value": smoothValue,
				}}
				disabled={disabled}
				aria-disabled={disabled}
				onKeyDown={onKeyDown}
				onAuxClick={resetToDefault}
				onContextMenu={stopEvent}
				role="slider"
				aria-valuemin={min}
				aria-valuemax={max}
				aria-valuenow={value}
				aria-valuetext={hasValue(displayValue) ? String(displayValue) : undefined}
			>
				<div className="track" onPointerDown={onTrackDown} />
				<div className="passed" />
				<div className={["thumb", { pressed }]} onPointerDown={onThumbDown} />
			</StyledSlider>
		</StyledSliderWrapper>
	);
}

/**
 * Ignore `undefined`, `null`, `NaN`, and empty string.
 */
function hasValue(test: Readable | undefined | null): test is Readable {
	return !!test || test === 0 || test === 0n;
}
