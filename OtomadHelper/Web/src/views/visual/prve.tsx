import exampleThumbnail from "assets/images/ヨハネの氷.png";
import defaultPrveAmounts from "helpers/defaultPrveAmounts";
import type { LocaleIdentifiers } from "locales/types";

type PrveClassType = Exclude<keyof LocaleIdentifiers["javascript"]["prve"]["classes"], "_"> | (string & {});
type PrveEffectType = Exclude<keyof LocaleIdentifiers["javascript"]["prve"]["effects"], "_"> | (string & {});

const controlModes = ["general", "samePitch", "differentSyllables"] as const;
const getControlModeIcon = (mode: string) => `prve_control_${new VariableName(mode).snake}` as DeclaredIcons;
const prveEffect = (fx: string, initial: number = 0) => ({ fx, initial });
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

	public static findClass(klass: PrveClassType) { return PrveClass.all.find(_class => _class.class === klass); }
	public get effectIds() { return this.effects.map(effect => effect.effect) ?? []; }
	public static findClassEffects(klass: PrveClassType) { return PrveClass.findClass(klass)?.effectIds ?? []; }
	public findEffectFrames(effect: PrveClassType) { return this.effects.find(_effect => _effect.effect === effect)?.frames ?? 1; }
}

/** Prve amounts option. */
const $a = (title: string, icon: DeclaredIcons, state: StateProperty<number>, def: number, min: number, max: number, decimalPlaces: number = 3, suffix?: string, prefix?: string) =>
	({ title, icon, state, def, min, max, decimalPlaces, suffix, prefix });

export default function Prve() {
	const [controlMode, setControlMode] = useState<typeof controlModes[number]>("general");
	const isGeneralCurrent = useMemo(() => controlMode === "general", [controlMode]);
	const { autoCollapsePrveClasses } = useSnapshot(configStore.settings);
	const { control, isMultiple, effects } = useSelectConfig(c => c.visual.prve[controlMode]);
	const { compression, slant, puyo, pendulum, gaussianBlur, radialBlur, rotation } = useSelectConfig(c => c.visual.prve[controlMode].amounts);
	const selectionMode = useSelectionMode(isMultiple);
	const effectLength = effects[0].length;
	const shouldHideSelectionBadge = effectLength <= 0 || effectLength === 1 && (effects[0][0].fx === DEFAULT_EFFECT || !isMultiple[0]);
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
					Array.from(effects, fx => prevEffects.find(effect => effect.fx === fx) ?? prveEffect(fx, 0));
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
	const useInitialStep = (currentEffect: string) => useStateSelector(
		effects,
		effects => effects.find(effect => effect.fx === currentEffect)?.initial ?? 0,
		(initial, prevEffects) => {
			const draft = [...prevEffects];
			const effect = draft.find(effect => effect.fx === currentEffect);
			if (effect !== undefined) effect.initial = initial;
			else draft.push(prveEffect(currentEffect, initial));
			return draft;
		},
	);

	const rotationStep = useStateSelector(rotation, angle => angle === 0 ? 0 : 360 / angle, step => step === 0 ? 0 : Math.round(360 / step));
	const setIsCurrentEffectRotation = (yes: boolean) => selectPrve("rotation")[1]!(yes ? "rotate" : "normal");

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
								currentEffect === "rotate" ?
									rotation[0] === -90 ? "ccwRotate" :
									rotation[0] === 90 ? "cwRotate" :
									rotation[0] === 180 || rotation[0] === -180 ? "turned" :
									null! : currentEffect,
								(rotate: string) => {
									if (rotate.in("ccwRotate", "cwRotate", "turned")) {
										setIsCurrentEffectRotation(true);
										rotation[1](rotate === "ccwRotate" ? -90 : rotate === "cwRotate" ? 90 : 180);
									} else currentEffectState[1]!(rotate);
								},
							]}
							view="grid"
							idField
							nameField={getEffectName}
							imageField={effect => <PreviewPrve key={effect} thumbnail={exampleThumbnail} effect={effect} frames={effect === "turned" ? 2 : 4} />}
							checkInfoCondition={effect => effect === undefined || effect === DEFAULT_EFFECT ? "" : effect === null ? rotation[0] + t.units.degree : getEffectName(effect)}
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
									onChanging={value => setIsCurrentEffectRotation(value !== 0)}
								/>
							</Expander.Item>
							<Expander.Item title={t.prve.amounts.rotationStep} icon="turntable">
								<SliderWithBox
									value={rotationStep}
									min={-360}
									max={360}
									defaultValue={0}
									onChanging={value => setIsCurrentEffectRotation(value !== 0)}
								/>
							</Expander.Item>
							<Expander.Item title={t.prve.initialStep} icon="replay">
								{(() => {
									const invalidValue = rotationStep[0] === undefined || Math.abs(rotationStep[0]) < 2;
									return (
										<SliderWithBox
											value={invalidValue ? [0] : useStateSelector(useInitialStep(currentEffect), v => v + 1, v => v - 1)}
											min={1}
											max={Math.max(1, Math.floor(Math.abs(rotationStep[0] ?? 1)))}
											decimalPlaces={0}
											defaultValue={0}
											disabled={invalidValue || currentEffect === "normal"}
											// Disable smooth display value for the initial step, or there will be jitter when the max value changes.
											onChanging={() => setIsCurrentEffectRotation(true)}
										/>
									);
								})()}
							</Expander.Item>
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
							<InitialStep klass={klass} effect={currentEffect} initialStep={useInitialStep(currentEffect)} />
						</ExpanderRadio>
					);
				})}
			</Expander.Group>
		</div>
	);
}

const StyledInitialStep = styled(Expander.Item)`
	padding-inline: 15px;

	.text {
		flex: 0 0 auto;
		width: unset;
	}

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

function InitialStep({ klass, effect, initialStep }: FCP<{
	/** Current PRVE class. */
	klass: string;
	/** Current PRVE effect in this class. */
	effect: string;
	/** The initial step of the PRVE effect. */
	initialStep: StateProperty<number>;
	children?: undefined;
}>) {
	const frames = PrveClass.findClass(klass)?.findEffectFrames(effect) ?? 1;

	return (
		<StyledInitialStep title={t.prve.initialStep} icon="replay" role="region" className={ifColorScheme.forceMotion} ariaHiddenForText>
			<ItemsView className="initial-step-items" view="grid" current={initialStep} itemWidth={100} aria-label={t.prve.initialStep}>
				{forMap(frames, j => {
					const i = (j + frames - 1) % frames; // Change the order from `0 1 2 3` to `3 0 1 2`.
					return (
						<ItemsView.Item
							image={(
								<PreviewPrve thumbnail={exampleThumbnail} effect={effect} frames={frames} step={j} style={{ "--i": i }} />
							)}
							key={j}
							id={j}
							badge={j + 1}
							className="initial-step-item"
							aria-label={t.descriptions.prve.stepAria({ step: j + 1, frames })}
						/>
					);
				})}
			</ItemsView>
		</StyledInitialStep>
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
