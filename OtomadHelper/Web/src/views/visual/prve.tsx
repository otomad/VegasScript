import exampleThumbnail from "assets/images/ヨハネの氷.avif";
import defaultPrveAmounts from "helpers/defaultPrveAmounts";
import type { LocaleIdentifiers } from "locales/types";

type PrveClassType = Exclude<keyof LocaleIdentifiers["javascript"]["prve"]["classes"], "_">;
type PrveEffectType = Exclude<keyof LocaleIdentifiers["javascript"]["prve"]["effects"], "_"> | (string & {});
type CustomEffectRotationMode = "normal" | "rotate" | "rotateCustomSequence";

const controlModes = ["general", "samePitch", "differentSyllables"] as const;
const getControlModeIcon = (mode: string) => `prve_control_${new VariableName(mode).snake}` as DeclaredIcons;
const prveEffect = (fx: string, initial: number[] = []) => ({ fx, initial });
const DEFAULT_EFFECT = "normal";
const STEP_CHANGE_HUE = "stepChangeHue";
const getWhirlInfo = () => withObject(t.prve.effects, fx => `${fx.whirl} = ${fx.pingpong} + ${fx.hFlip}`);

/** With frames step. */
const $s = (frames: number, ...effectIds: PrveEffectType[]) => effectIds.map(effect => ({ effect, frames }));
type PrveClassEffect = {
	effect: PrveEffectType;
	frames: number;
};
class PrveClass {
	public static readonly all = [
		new PrveClass("flip", "flip_h", [...$s(2, "hFlip", "vFlip"), ...$s(4, "ccwFlip", "cwFlip")]),
		new PrveClass("rotation", "rotate", $s(1, "rotate")),
		new PrveClass("scale", "resize_image", $s(1, "zoomOutIn")),
		new PrveClass("mirror", "image_reflection", [...$s(2, "hMirror", "vMirror"), ...$s(4, "ccwMirror", "cwMirror")]),
		new PrveClass("invert", "invert_color", [...$s(2, "negative", "luminInvert", "negativeFade", "negativeLuma"), ...$s(4, "rotInvertHue", "rotInvertLumin", "altInvertHue", "altInvertLumin")]),
		new PrveClass("hue", "hue", [...$s(2, "hueInvert"), ...forMapFromTo(3, 8, 1, frames => ({ effect: STEP_CHANGE_HUE + frames, frames }))]),
		new PrveClass("chromatic", "grayscale", $s(2, "chromatic", "chromaticFade")),
		new PrveClass("time", "timer", $s(2, "pingpong", "whirl")),
		new PrveClass("time2", "timer_2", $s(1, "sharpRewind", "wobblePeriod")),
		new PrveClass("ec", "arrow_autofit_height_in", [...$s(1, "vExpansion", "vExpansionBounce", "vCompression", "vCompressionBounce", "vBounce"), ...$s(2, "slantDown", "slantUp", "puyo")]),
		new PrveClass("swing", "arrow_rotate", $s(2, "pendulum")),
		new PrveClass("blur", "blur", $s(1, "gaussianBlur", "radialBlur")),
		new PrveClass("wipe", "double_tap_swipe", [...$s(2, "wipeRight"), ...$s(1, "wipeRight1", "splitVOut")]),
	];

	public readonly class: PrveClassType;
	private constructor(
		klass: PrveClassType,
		public readonly icon: DeclaredIcons,
		public readonly effects: PrveClassEffect[],
	) {
		this.class = klass;
		this.findEffectFrames = this.findEffectFrames.bind(this);
	}

	public static findClass(klass: PrveClassType | (string & {})) { return PrveClass.all.find(prveClass => prveClass.class === klass); }
	public get effectIds() { return this.effects.map(effect => effect.effect) ?? []; }
	public static findClassEffects(klass: PrveClassType) { return PrveClass.findClass(klass)?.effectIds ?? []; }
	public findEffectFrames(effect: PrveClassType | (string & {})) { return this.effects.find(_effect => _effect.effect === effect)?.frames ?? 1; }
}

/** Prve amounts option. */
const $a = (title: string, icon: DeclaredIcons, state: StateProperty<number>, def: number, min: number, max: number, decimalPlaces: number = 3, suffix?: string, prefix?: string) =>
	({ title, icon, state, def, min, max, decimalPlaces, suffix, prefix });

export default function Prve() {
	const [controlMode, setControlMode] = useState<typeof controlModes[number]>("general");
	const isGeneralCurrent = useMemo(() => controlMode === "general", [controlMode]);
	const { autoCollapsePrveClasses } = useSnapshot(configStore.settings);
	const { control, isMultiple, effects } = useSelectConfig(c => c.visual.prve[controlMode]);
	const { compression, slant, puyo, pendulum, gaussianBlur, radialBlur, rotation, initialAngle, rotateCustomSequence } = useSelectConfig(c => c.visual.prve[controlMode].amounts);
	const selectionMode = useSelectionMode(isMultiple);
	const effectLength = effects[0].length;
	const shouldHideSelectionBadge = effectLength <= 0 || effectLength === 1 && (effects[0][0].fx === DEFAULT_EFFECT || !isMultiple[0]);
	const rotationStep = useStateSelector(rotation, angle => angle === 0 ? 0 : 360 / angle, step => step === 0 ? 0 : Math.round(360 / step));
	const setCurrentEffectRotation = (mode: CustomEffectRotationMode) => {
		selectPrve("rotation")[1]!(mode === "normal" ? "normal" : "rotate");
		rotateCustomSequence[1](mode === "rotateCustomSequence");
	};
	const selectPrve = (klass: PrveClassType): StateProperty<PrveEffectType> => {
		const classEffects = PrveClass.findClassEffects(klass);
		const flipEffects = PrveClass.findClassEffects("flip");
		return useStateSelector(
			effects,
			effects => {
				if (classEffects === undefined) return undefined;
				const fx = effects.map(effect => effect.fx).intersection(classEffects)[0];
				return fx ?? DEFAULT_EFFECT;
			},
			(effect, prevEffects) => {
				if (effect === undefined) return prevEffects;
				const addInitialStepToEffects = (effects: Iterable<string>) =>
					Array.from(effects, fx => prevEffects.find(effect => effect.fx === fx) ?? prveEffect(fx));
				const isWhirl = effect === "whirl";
				const selectEffects = isWhirl ? ["hFlip", "pingpong"] : effect === DEFAULT_EFFECT && isMultiple[0] ? [] : [effect];
				if (!isMultiple[0]) return addInitialStepToEffects(selectEffects);
				const effects = new Set(prevEffects.map(effect => effect.fx));
				effects.delete(DEFAULT_EFFECT);
				effects.deletes(...classEffects);
				if (isWhirl) effects.deletes(...flipEffects);
				effects.adds(...selectEffects);
				if (effects.size === 0) effects.add(DEFAULT_EFFECT);
				return addInitialStepToEffects(effects);
			},
		);
	};
	const useInitialStep = (klass: string, currentEffect: string) => useStateSelector(
		effects,
		effects => {
			if (currentEffect === DEFAULT_EFFECT) return [0];
			const exist = effects.find(effect => effect.fx === currentEffect)?.initial;
			const standard = (() => {
				if (klass === "rotation") return getAngleSequence(rotation[0], initialAngle[0]);
				const frames = PrveClass.findClass(klass)?.findEffectFrames(currentEffect) ?? 1;
				return getStepSequence(frames, 0);
			})();
			return klass === "rotation" && !rotateCustomSequence[0] ? standard :
				exist?.length ? exist : standard;
		},
		(initial, prevEffects) => {
			const draft = [...prevEffects];
			// if (klass === "rotation") currentEffect = "rotateCustomSequence";
			const effect = draft.find(effect => effect.fx === currentEffect);
			if (effect !== undefined) effect.initial = initial;
			else draft.push(prveEffect(currentEffect, initial));
			return draft.length <= 1 ? draft : draft.filter(({ fx }) => fx !== DEFAULT_EFFECT);
		},
	);

	return (
		<div className="container">
			<StackPanel $align="space-between" $endAlignWhenWrap>
				<Segmented current={[controlMode, setControlMode]}>
					{controlModes.map(mode =>
						<Segmented.Item id={mode} key={mode} icon={getControlModeIcon(mode)}>{t.prve.control[mode]}</Segmented.Item>)}
				</Segmented>
				<Segmented current={selectionMode}>
					<Segmented.Item id="single" icon="single_select">{t.selectionMode.single}</Segmented.Item>
					<Segmented.Item id="multiple" icon="multiselect">{t.selectionMode.multiple}</Segmented.Item>
				</Segmented>
			</StackPanel>
			<SettingsCardToggleSwitch
				on={isGeneralCurrent ? [true] : control}
				disabled={isGeneralCurrent}
				icon={getControlModeIcon(controlMode)}
				title={t({ context: "full" }).prve.control[controlMode]}
				details={t.descriptions.prve.control[controlMode]}
			/>
			<Subheader>
				{t.prve.classes}
				<Badge style={{ marginInlineStart: "12px" }} hidden={shouldHideSelectionBadge}>{effectLength}</Badge>
			</Subheader>

			<Expander.Group autoCollapse={autoCollapsePrveClasses}>
				{PrveClass.all.map(({ class: klass, icon, effectIds, findEffectFrames }) => {
					const currentEffectState = selectPrve(klass), currentEffect = currentEffectState[0]!;
					if (klass === "rotation") return (
						<ExpanderRadio
							key={klass}
							title={t.prve.classes[klass]}
							disabled={!control[0]}
							icon={icon}
							items={[DEFAULT_EFFECT, "ccwRotate", "cwRotate", "turned"]}
							value={[
								currentEffect === "rotate" && !rotateCustomSequence[0] ?
									rotation[0] === -90 ? "ccwRotate" :
									rotation[0] === 90 ? "cwRotate" :
									Math.abs(rotation[0]) === 180 ? "turned" :
									null! : currentEffect,
								(rotate: string) => {
									if (rotate.in("ccwRotate", "cwRotate", "turned")) {
										setCurrentEffectRotation("rotate");
										rotation[1](rotate === "ccwRotate" ? -90 : rotate === "cwRotate" ? 90 : 180);
									} else currentEffectState[1]!(rotate);
								},
							]}
							view="grid"
							idField
							nameField={getEffectName}
							imageField={effect => <PreviewPrve key={effect} thumbnail={exampleThumbnail} effect={effect} frames={effect === "turned" ? 2 : 4} />}
							checkInfoCondition={effect =>
								effect === undefined || effect === DEFAULT_EFFECT ? "" :
								effect === null ? `${t.prve.effects.rotateCustomAngle}${t.colon}${rotation[0]}${t.units.degree}` :
								rotateCustomSequence[0] ? t.prve.effects.rotateCustomSequence : getEffectName(effect)}
							alwaysShowCheckInfo
						>
							<Expander.Item title={t.prve.amounts.rotationAngle} icon="angle">
								<SliderWithBox
									value={rotation}
									min={-360}
									max={360}
									decimalPlaces={0}
									defaultValue={0}
									suffix={t.units.degree}
									onChanging={value => setCurrentEffectRotation(value !== 0 ? "rotate" : "normal")}
								/>
							</Expander.Item>
							<Expander.Item title={t.prve.amounts.rotationStep} icon="turntable">
								<SliderWithBox
									value={rotationStep}
									min={-360}
									max={360}
									defaultValue={0}
									onChanging={value => setCurrentEffectRotation(value !== 0 ? "rotate" : "normal")}
								/>
							</Expander.Item>
							<Expander.Item title={t({ context: "angle" }).prve.initialStep} icon="replay">
								{(() => {
									const invalidValue = rotationStep[0] === undefined || Math.abs(rotationStep[0]) < 2;
									return (
										<SliderWithBox
											value={invalidValue ? [0] : initialAngle}
											min={-360}
											max={360}
											decimalPlaces={0}
											defaultValue={0}
											disabled={invalidValue}
											onChanging={() => setCurrentEffectRotation("rotate")}
										/>
									);
								})()}
							</Expander.Item>
							<InitialStep
								klass={klass}
								effect={currentEffect}
								initialStep={useInitialStep(klass, currentEffect)}
								onCurrentEffectRotationModeChange={setCurrentEffectRotation}
							/>
						</ExpanderRadio>
					);
					else return (
						<ExpanderRadio
							key={klass}
							title={t.prve.classes[klass]}
							disabled={!control[0]}
							icon={icon}
							items={[DEFAULT_EFFECT, ...effectIds]}
							value={currentEffectState}
							view="grid"
							idField
							nameField={getEffectName}
							imageField={effect => <PreviewPrve key={effect} thumbnail={exampleThumbnail} effect={effect} frames={findEffectFrames(effect)} />}
							checkInfoCondition={effect => !effect || effect === DEFAULT_EFFECT ? "" : getEffectName(effect)}
							alwaysShowCheckInfo
						>
							{klass === "time" && <InfoBar status="info" title={getWhirlInfo()} />}
							{klass.in("ec", "swing", "blur") && (() => {
								const tAmounts = t.prve.amounts;
								const option =
									/* eslint-disable @stylistic/indent */
									klass === "swing" ? $a(tAmounts.pendulum, "angle", pendulum, defaultPrveAmounts.pendulum, -360, 360, 0, t.units.degree) :
									klass === "blur" ?
										currentEffect === "gaussianBlur" ? $a(t.settings.appearance.backgroundImage.blur, "blur", gaussianBlur, defaultPrveAmounts.gaussianBlur, 0, 1) :
										currentEffect === "radialBlur" ? $a(t.settings.appearance.backgroundImage.blur, "blur", radialBlur, defaultPrveAmounts.radialBlur, 0, 1) : undefined :
									klass === "ec" ?
										currentEffect === "puyo" ? $a(tAmounts.puyo, "puyo", puyo, defaultPrveAmounts.puyo, 0.5, 1) :
										currentEffect.in("slantDown", "slantUp") ? $a(tAmounts.puyo, "slant", slant, defaultPrveAmounts.slant, 0.5, 1) :
										currentEffect.in("vExpansion", "vExpansionBounce", "vCompression", "vCompressionBounce", "vBounce") ? $a(tAmounts.compression, "compression", compression, defaultPrveAmounts.compression, 0.5, 1) : undefined :
									undefined;
									/* eslint-enable @stylistic/indent */
								if (!option) return;
								return (
									<Expander.Item title={option.title} icon={option.icon}>
										<SliderWithBox
											value={option.state}
											min={option.min}
											max={option.max}
											decimalPlaces={option.decimalPlaces}
											defaultValue={option.def}
											prefix={option.prefix}
											suffix={option.suffix}
										/>
									</Expander.Item>
								);
							})()}
							<InitialStep klass={klass} effect={currentEffect} initialStep={useInitialStep(klass, currentEffect)} />
						</ExpanderRadio>
					);
				})}
			</Expander.Group>
		</div>
	);
}

const StyledInitialStep = styled(Expander.Item)`
	.trailing,
	.initial-step-items {
		flex: 1 1 0%;
		justify-content: flex-start;
		width: 100%;
	}

	.image-wrapper {
		height: 100px;

		* {
			transition: none !important;
		}
	}
`;

const STEP_SEQUENCE_ITEM_SIZE = 65;
const STEP_SEQUENCE_BADGE_PADDING = 4 / 1.5;
const StepSequence = styled.div`
	z-index: 2;
	display: flex;
	gap: 4px;
	block-size: ${STEP_SEQUENCE_ITEM_SIZE + 7 * 2}px;
	padding: 7px;
	contain: strict;
	overflow-inline: auto;

	.step-sequence-item {
		position: relative;
		width: ${STEP_SEQUENCE_ITEM_SIZE}px;
		aspect-ratio: 1 / 1;
		overflow: clip;
		border-radius: 3px;
		box-shadow: 0 0 0 1px ${c("stroke-color-surface-stroke-default")} inset;

		img {
			transition: none !important;
		}

		.badge {
			position: absolute;
			inset-block-end: ${STEP_SEQUENCE_BADGE_PADDING}px;
			inset-inline-start: ${STEP_SEQUENCE_BADGE_PADDING}px;
			max-inline-size: calc(100% - ${STEP_SEQUENCE_BADGE_PADDING * 2}px);
			zoom: 1.5;

			.text {
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
	}

	.trailing:has(> &) {
		flex-direction: column;
		gap: 4px;
		align-items: stretch;
		padding-inline-end: 0 !important;

		.text-box {
			/* position: absolute; */
			inline-size: calc(100% - 7px * 2);
			max-inline-size: unset;
			margin-inline: 7px;
		}
	}
`;

const StyledCustomStepsIcon = styled.div`
	${styles.mixins.gridCenter()};
	${styles.mixins.square("100%")};

	.icon {
		font-size: 48px;
	}
`;
const CustomStepsIcon = () => <StyledCustomStepsIcon><Icon name="colored/edit" /></StyledCustomStepsIcon>;

const customInitialStepClasses = ["rotation"] as const;
function getStepSequence(frames: number, initialStep: number) { return forMap(frames, i => floorMod(i, frames) + 1, initialStep); }
function getAngleSequence(angle: number, initialAngle: number) { return angle === 0 ? [initialAngle] : forMap(Math.floor(360 / Math.abs(angle)), i => initialAngle + angle * i); }
function InitialStep({ klass, effect, initialStep: [initialStep, setInitialStep] = NEVER_MIND, onCurrentEffectRotationModeChange }: FCP<{
	/** Current PRVE class. */
	klass: string;
	/** Current PRVE effect in this class. */
	effect: string;
	/** The initial step of the PRVE effect. */
	initialStep?: StateProperty<number[]>;
	children?: undefined;
	/** Occurs when current effect rotation mode changed. (Rotation PRVE class effects only.) */
	onCurrentEffectRotationModeChange?(mode: CustomEffectRotationMode): void;
}>) {
	initialStep ??= [];
	const isCustomInitialStepClass = customInitialStepClasses.includes(klass);
	const prveClass = PrveClass.findClass(klass);
	const frames = prveClass?.findEffectFrames(effect) ?? 1;
	const stepSequenceInputEl = useDomRef<"input">();
	const isDefault = effect === DEFAULT_EFFECT;
	const tc = t({ context: isCustomInitialStepClass ? "angle" : undefined });

	const [customStepSequence, setCustomStepSequence] = useState(initialStep.join(","));
	const isEditingStepSequence = useCallback(() => document.activeElement === stepSequenceInputEl.current, [stepSequenceInputEl]);
	useAsyncEffect(async () => {
		await delay(0);
		if (document.activeElement !== stepSequenceInputEl.current)
			setCustomStepSequence(initialStep.join(","));
	}, [initialStep, isEditingStepSequence]);

	return (
		<Expander.AequilateTextItems>
			{!isCustomInitialStepClass && (
				<StyledInitialStep title={tc.prve.initialStep} icon="replay" role="region" className={ifColorScheme.forceMotion} ariaHiddenForText>
					<ItemsView<number[]> className="initial-step-items" view="grid" current={[initialStep, setInitialStep]} itemWidth={100} aria-label={t.prve.initialStep}>
						{forMap(frames, j => {
							const i = (j + frames - 1) % frames; // Change the order from `0 1 2 3` to `3 0 1 2`.
							const value = isDefault ? [0] : getStepSequence(frames, j);
							return (
								<ItemsView.Item
									image={(
										<PreviewPrve thumbnail={exampleThumbnail} effect={effect} frames={frames} step={j + 1} style={{ "--i": i }} />
									)}
									key={value.join()}
									data-value={value}
									data-index={j}
									id={value}
									badge={isDefault ? 0 : j + 1}
									className="initial-step-item"
									aria-label={t.descriptions.prve.stepAria({ step: j + 1, frames })}
								/>
							);
						})}
						{!isDefault && (
							<ItemsView.Item
								image={<CustomStepsIcon />}
								id={ItemsView.other}
								className="initial-step-item"
								withBorder
								tooltip={t.descriptions.prve.customStepSequence}
								aria-label={t.custom}
								onClick={() => {
									const savedCustom = configStore.visual.prveCustomStepSequences[effect];
									if (savedCustom) setInitialStep?.(savedCustom);
									delay(0).then(() => stepSequenceInputEl.current?.selectAndFocus());
								}}
							/>
						)}
					</ItemsView>
				</StyledInitialStep>
			)}
			{(initialStep.length > 0 || isCustomInitialStepClass) && (
				<Expander.Item title={tc.prve.stepSequence} icon="flow">
					<StepSequence>
						{initialStep.map((frame, i) => (
							<div key={i} className="step-sequence-item" data-frame={frame}>
								<PreviewPrve
									thumbnail={exampleThumbnail}
									effect={effect}
									frames={frames}
									step={frame}
									style={{ "--i": floorMod(frame - 2, frames) }}
									isDegree={isCustomInitialStepClass}
								/>
								<Badge status="neutual" transitionOnAppear={false}>{frame}{isCustomInitialStepClass ? t.units.degree : ""}</Badge>
							</div>
						))}
					</StepSequence>
					<StepSequenceInput
						ref={stepSequenceInputEl}
						value={[customStepSequence, setCustomStepSequence]}
						disabled={isDefault}
						effect={effect}
						onValidChange={setInitialStep}
						onInputChange={() => onCurrentEffectRotationModeChange?.("rotateCustomSequence")}
					/>
				</Expander.Item>
			)}
		</Expander.AequilateTextItems>
	);
}

const stepSequencePattern = /^-?\d+(,-?\d+)*$/;
function StepSequenceInput({ value: [value, setValue], disabled, effect, ref, onValidChange, onInputChange }: {
	value: StatePropertyNonNull<string>;
	disabled?: boolean;
	effect: string;
	ref?: DomRef<"input">;
	onValidChange?: SetState<number[]>;
	onInputChange?(): void;
}) {
	function parseValue(text: string) {
		if (!text.match(stepSequencePattern)) return null;
		return text.split(",").map(Number);
	}

	useEffect(() => {
		const result = parseValue(value);
		result && onValidChange?.(result);
	}, [value]);

	const onChanging: FormEventHandler<HTMLInputElement> = e => {
		const result = parseValue(e.currentTarget.value);
		if (result) {
			onInputChange?.();
			configStore.visual.prveCustomStepSequences[effect] = result;
		}
	};

	return (
		<TextBox
			inputRef={ref}
			value={[value, setValue]}
			className="monospace"
			pattern={stepSequencePattern}
			required
			disabled={disabled}
			onChanging={onChanging}
			mouseDownTriggerOnChanging={false}
		/>
	);
}

export function getStepChangeHueStep(effectId: string) {
	if (effectId?.startsWith(STEP_CHANGE_HUE))
		return +effectId.match(/\d+$/)![0];
	return null;
}

function getEffectName(effectId: string) {
	const { effects } = t.prve;
	const stepChangeHueStep = getStepChangeHueStep(effectId);
	if (stepChangeHueStep !== null)
		return effects[STEP_CHANGE_HUE]({ count: stepChangeHueStep });
	return effects[effectId];
}

export function usePrveInfo() {
	const effects = useSnapshot(configStore.visual.prve.general).effects.map(effect => effect.fx);
	const { samePitch, differentSyllables } = useSnapshot(configStore.visual.prve);
	const enableOtherSeparateControls = samePitch.control || differentSyllables.control;
	if (effects.includes("hFlip") && effects.includes("pingpong")) {
		const index = Math.min(effects.indexOf("hFlip"), effects.indexOf("pingpong"));
		effects[index] = "whirl";
		effects.removeAllItem("hFlip", "pingpong");
	}
	const effectId = effects[0] ?? DEFAULT_EFFECT;
	const effect = getEffectName(effectId);
	const prveCount = effects.length;
	const prveCheckInfo = prveCount > 1 || enableOtherSeparateControls ?
		t.etc({ examples: effect }) :
		effect;
	const isForceStretch = useIsForceStretch();
	return { prveCount, prveCheckInfo, isForceStretch };
}

function useIsForceStretch() {
	const timeEffects = PrveClass.findClassEffects("time");
	const prve = useSnapshot(configStore.visual.prve);
	const effects = Object.values(prve).flatMap(control => control.effects);
	return effects.map(effect => effect.fx).intersection(timeEffects).length > 0;
}
