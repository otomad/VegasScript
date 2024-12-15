import defaultPrveAmounts from "helpers/defaultPrveAmounts";
import { deepClone } from "valtio/utils";
import type { beepEngines } from "views/audio";
import type { pitchNotations } from "views/lyrics";
import type { constrainNoteLengthTypes, encodings, multipleSelectTrackItems, tempoUsings, trackAndChannel } from "views/score";
import type { barOrBeatUnitTypes, selectGeneratedClipsType, sourceFromEnums, startTimes, trackNames } from "views/source";
import type { trackLegatoModes } from "views/track";
import type { arrayTypes, fitTypes, parityTypes } from "views/track/grid";
import type { legatos, stretches, transformMethods, unlengthens } from "views/visual";

type StartTime = typeof startTimes[number]["id"];
type TempoUsing = typeof tempoUsings[number]["id"];
type ConstrainNoteLengthType = typeof constrainNoteLengthTypes[number]["id"];
type Encoding = typeof encodings[number];
type Stretch = typeof stretches[number]["id"];
type Legato = typeof legatos[number]["id"];
type Unlengthen = typeof unlengthens[number]["id"];
type TransformMethod = typeof transformMethods[number];
type PitchNotation = typeof pitchNotations[number];
type Timecode = string;
type MultipleSelectTrackItem = typeof multipleSelectTrackItems[number];
type SelectGeneratedClips = typeof selectGeneratedClipsType[number]["id"];
type BeepEngine = typeof beepEngines[number];
type TrackNameType = typeof trackNames[number]["id"];
type BarOrBeatUnit = typeof barOrBeatUnitTypes[number];
type SourceFrom = typeof sourceFromEnums[number];
type TrackOrChannel = typeof trackAndChannel[number];
type GridArrayType = typeof arrayTypes[number];
type GridFitType = typeof fitTypes[number];
type GridParityType = typeof parityTypes[number];
type TrackLegatoMode = typeof trackLegatoModes[number];

const EMPTY_TIMECODE = "00:00:00.000" as Timecode;
const defaultPrve = {
	isMultiple: false,
	effects: [{ fx: "normal", initial: 0 }],
	amounts: defaultPrveAmounts as Record<keyof typeof defaultPrveAmounts, number>,
};

export const configStore = createStore({
	source: {
		sourceFrom: "trackEvent" as SourceFrom,
		trimStart: EMPTY_TIMECODE,
		trimEnd: EMPTY_TIMECODE,
		startTime: "projectStart" as StartTime,
		customStartTime: EMPTY_TIMECODE,
		afterCompletion: {
			removeSourceClips: false,
			selectSourceClips: true,
			selectGeneratedClips: [] as true | SelectGeneratedClips[],
		},
		preferredTrack: 0,
		belowAdjustmentTracks: true,
		trackGroup: true,
		collapseTrackGroup: true,
		trackName: "track" as TrackNameType,
		blindBoxForTrack: false,
		blindBoxForMarker: false,
		blindBoxForBarOrBeat: false,
		blindBoxForBarOrBeatPeriod: [4, "bar"] as Unit<BarOrBeatUnit>,
		blindBoxForBarOrBeatPreparation: [0, "bar"] as Unit<BarOrBeatUnit>,
		consonant: false,
	},
	score: {
		format: "midi",
		trimStart: EMPTY_TIMECODE,
		trimEnd: EMPTY_TIMECODE,
		encoding: "ANSI" as Encoding,
		tempoUsing: "variableScore" as TempoUsing,
		customTempo: 120,
		timeSignature: "4/4",
		constrainNoteLengthType: "none" as ConstrainNoteLengthType,
		constrainNoteLengthValue: EMPTY_TIMECODE,
		trackOrChannel: "track" as TrackOrChannel,
		selectedTrack: 0 as number | number[],
		multipleSelectTrackItems: {} as Record<number, Set<MultipleSelectTrackItem>>,
	},
	audio: {
		enabled: true,
		preferredTrack: 0,
		stretch: "noStretching" as Stretch,
		loop: "auto" as TrueFalseAuto,
		normalize: true,
		unlengthen: "lengthenable" as Unlengthen,
		legato: "portato" as Legato,
		multitrackForChords: false,
		stack: false,
		timeUnremapping: false,
		autoPan: true,
		autoPanCurve: "linear" as CurveType,
		tuningMethod: "elastic",
		stretchAttribute: "efficient",
		alternativeForExceedsTheRange: "plugin",
		resample: false,
		preserveFormant: false,
		basePitch: "C5",
		cent: 0,
		basePitchBased: true,
		prelistenAttributes: {
			engine: "WebAudio" as BeepEngine,
			waveform: "sine" as OscillatorCommonType,
			duration: 500,
			volume: 1,
			adjustAudioToBasePitch: false,
		},
		currentPreset: "fadeOut",
		activeParameterScheme: [
			{
				name: "淡出",
				enabled: false,
				parameters: ["淡入淡出"],
			},
		],
	},
	visual: {
		enabled: true,
		preferredTrack: 0,
		stretch: "noStretching" as Stretch,
		loop: "auto" as TrueFalseAuto,
		staticVisual: false,
		unlengthen: "lengthenable" as Unlengthen,
		legato: "upToOneBeat" as Legato,
		multitrackForChords: false,
		stack: false,
		timeUnremapping: false,
		resampleImitatively: "auto" as TrueFalseAuto,
		transformMethod: ["panCrop", "pictureInPicture", "transformOfx"] as TransformMethod[],
		prve: {
			general: {
				control: true,
				...deepClone(defaultPrve),
			},
			samePitch: {
				control: false,
				...deepClone(defaultPrve),
			},
			differentSyllables: {
				control: false,
				...deepClone(defaultPrve),
			},
		},
		staff: {
			enabled: false,
		},
		pixelScaling: {
			enabled: false,
			scaleFactor: 100,
			autoScaleFactor: true,
			replaceSource: true,
		},
		glissando: false,
		glissandoEffect: "swirl" as "swirl" | "pingpong",
		glissandoAmount: 12,
		appoggiatura: false,
		arpeggio: false,
		arpeggioNegative: true,
		currentPreset: "enter",
		activeParameterScheme: [
			{
				id: "ZW50ZXI=",
				name: "进入",
				enabled: true,
				parameters: ["缩放", "水平位移", "垂直位移"],
			},
			{
				id: "ZmFkZQ==",
				name: "淡出",
				enabled: false,
				parameters: ["淡入淡出"],
			},
		],
	},
	createGroups: true,
	playbackRate: {
		sync: true,
		audioRate: 1,
		visualRate: 1,
		audioBased: true,
		visualBased: true,
	},
	track: {
		grid: {
			enabled: true,
			columns: 5,
			array: "square" as GridArrayType,
			fit: "cover" as GridFitType,
			mirrorEdgesHFlip: "unflipped" as GridParityType,
			mirrorEdgesVFlip: "unflipped" as GridParityType,
			descending: false,
			padding: 0,
		},
		box3d: {
			enabled: true,
			deleteTracks: false,
			useLongerSide: false,
		},
		gradient: {
			enabled: true,
			effect: "rainbow",
			descending: false,
			viewOverlay: false,
			viewSquare: false,
			viewMirrorEdges: false,
			viewSize: 325,
		},
		legato: {
			mode: "stacking" as TrackLegatoMode,
			increaseSpacing: EMPTY_TIMECODE,
			forClips: false,
			includeGroup: false,
			backwards: false,
		},
	},
	sonar: {
		enabled: true,
		separateDrums: false,
		differenceCompositeMode: false,
		shadow: false,
		shadowColor: "#000000",
		graphs: [
			{
				enabled: true,
				drumSound: "Kick",
				color: "#ffffff",
				shape: "square",
			},
			{
				enabled: true,
				drumSound: "Snare",
				color: "#ffffff",
				shape: "diamond",
			},
		],
	},
	lyrics: {
		enabled: false,
		presetTemplate: "Text",
		karaoke: {
			enabled: false,
			futureFill: "#005fb7",
			pastFill: "#0f7b0f",
		},
		pitchNotation: {
			enabled: false,
			type: "scientific" as PitchNotation,
		},
	},
	shupelunker: {
		enabled: false,
		affix: "prefix",
		unallocated: {
			octaves: true,
			lowerNeighbors: true,
			higherNeighbors: true,
			default: true,
		},
		exclusiveTrack: true,
		offset: 0,
	},
	ytp: {
		enabled: false,
		constraintStart: 10,
		constraintEnd: 5000,
		clips: 30,
	},
	settings: {
		backgroundImage: -1,
		backgroundImageOpacity: 0.2,
		backgroundImageTint: 0,
		backgroundImageBlur: 0,
		uiScale: 100,
		get uiScale1() { return this.uiScale / 100; },
		hideUseTips: false,
		autoSwitchSourceFrom: true,
		autoCollapsePrveClasses: true,
	},
	// If named toJSON, it will conflict to the JSON built-in parameter, causing a recursion error.
	toJson() { return JSON.stringify(this); },
});

export const selectConfig = <T extends object>(path: (state: typeof configStore) => T) => useStoreState(path(configStore));
export const selectConfigArray = <T extends object>(path: (state: typeof configStore) => T[]) => useStoreStateArray(path(configStore));
globals.config = configStore;

// If declare these
useListenKeybinding("useTrackEventAsSource", () => configStore.source.sourceFrom = "trackEvent");
useListenKeybinding("useProjectMediaAsSource", () => configStore.source.sourceFrom = "projectMedia");
useListenKeybinding("enableYtp", () => configStore.ytp.enabled = !configStore.ytp.enabled);
