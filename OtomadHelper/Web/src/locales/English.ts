const English = {
	translation: {
		titles: {
			home: "Home",
			source: "Source",
			score: "Score",
			audio: "Audio",
			visual: "Visual",
			track: "Track",
			track_other: "Tracks",
			sonar: "Sonar",
			notation: "Notation",
			notation_full: "Pitch Notation",
			shupelunker: "Shupelunker",
			shupelunker_full: "Shupelunker Tactics",
			ytp: "YTP",
			ytp_full: "YouTube Poop",
			mosh: "Mosh",
			mosh_other: "Moshes",
			mosh_full: "Datamoshes",
			tools: "Tools",
			settings: "Settings",
			prve: "PV Rhythm Visual Effect",
			staff: "Staff Visualizer",
		},
		source: {
			trackEvent: "Track event",
			projectMedia: "Project media",
			browseFile: "Browse file",
			trim: "Trim",
			startTime: {
				_: "Start time",
				projectStart: "Project start",
				cursor: "Cursor",
			},
			belowTopAdjustmentTracks: "Below top adjustment tracks",
			removeSourceEventsAfterCompletion: "Remove source events after completion",
			selectAllEventsGenerated: "Select all events generated",
			randomOffsetForTracks: "Use random offsets for different tracks",
		},
		on: "On",
		off: "Off",
		custom: "Custom",
		enabled: "Enabled",
		enable: "Enable",
		learnMore: "Learn more",
		condition: "Condition",
		subheader: {
			moreOptions: "More options",
			advanced: "Advanced",
			config: "Config",
			parameters: "Parameters",
			effects: "Effects",
		},
		score: {
			midi: "MIDI",
			midiFile: "MIDI Sequence File",
			ust: "UST",
			ustFile: "UTAU Sequence Text File",
			refOtherTracks: "Refer to other tracks",
			pureNotes: "Pure notes",
			encoding: "Encoding",
			bpm: {
				_: "BPM",
				dynamicMidi: "Dynamic MIDI tempo",
				midi: "MIDI tempo",
				project: "Project tempo",
			},
			timeSignature: "Time signature",
			constraint: {
				_: "Constraint note length",
				none: "Unconstrainted",
				max: "Max length",
				fixed: "Fixed length",
			},
		},
		audioVisual: {
			preview: "Preview",
			stretch: {
				_: "Stretch",
				noStretching: "No stretching",
				flexingAndExtending: "Flexing & extending",
				extendingOnly: "Extending only",
				flexingOnly: "Flexing only",
			},
			loop: "Loop",
			normalize: "Normalize",
			staticVisual: "Static",
			noLengthening: "No lengthening",
			legato: {
				_: "Legato",
				portato: "Portato",
				upToOneBeat: "Up to 1 beat",
				upToOneBar: "Up to 1 bar",
				unlimited: "Unlimited",
			},
			multitrackForChords: "Chords",
			createGroups: "Group",
			glissando: "Glissando",
			autoPan: "Pan",
			mappingVelocity: "Velocity",
			transformOfx: "TransformOFX",
			tuning: {
				_: "Tunning",
				tuningMethod: "Tuning method",
				stretchAttributes: "Stretch attributes",
				alternativeForOutOfRange: "If out of range",
				resample: "Resample",
				preserveFormant: "Preserve formant",
				basePitch: "Base pitch",
				prelisten: {
					_: "Prelisten",
					engine: "Engine",
					waveform: {
						_: "Waveform",
						sinusoid: "Sinusoid",
						triangle: "Triangle",
						square: "Square",
						sawtooth: "Sawtooth",
					},
					duration: "Duration",
					adjustAudioToBasePitch: "Adjust audio to base pitch",
				},
			},
			newTrack: "New track",
		},
		ytp: {
			constraint: "Constraint length",
			clips: "Clips",
			effects: "YTP Effects",
		},
		prve: {
			classes: {
				flip: "Flip Class",
				rotation: "Rotation Class",
				scale: "Scale Class",
				mirror: "Mirror Class",
				invert: "Invert Class",
				hue: "Hue Class",
				chromatic: "Monochrome Class",
				time: "Time Class",
				time2: "Time Class 2",
				ec: "Expansion & Compression Class",
				swing: "Swing Class",
				blur: "Blur Class",
				wipe: "Wipe Class",
			},
		},
		settings: {
			language: {
				_: "Language",
				en: "English",
				"zh-CN": "Simplified Chinese",
				ja: "Japanese",
			},
			colorScheme: {
				_: "Color scheme",
				light: "Light",
				dark: "Dark",
				auto: "Auto",
			},
			uiScale: "UI scale",
			devMode: "Developer mode",
		},
		descriptions: {
			condition: "Specify when the following configuration will be applied",
			source: {
				trim: "Adjust start or end time of the specified source",
				startTime: "Specify when to start generating from the project",
			},
			score: {
				trim: "Intercept the generation time range of the score",
				bpm: "Specify the beats per minute",
				constraint: "Controls the note output length from the score",
				encoding: "Specify the text encoding for reading the file",
			},
			audioVisual: {
				stretch: "When on, the clip will be stretched instead of changing its duration",
				loop: "When the clip is lengthened to the end of the source media, playback will start over",
				normalize: "Normalize the audio, useful if the audio is quiet",
				staticVisual: "Freeze the frame at the start of the clip",
				noLengthening: {
					visual: "Freeze the frame at the end of the clip if the note is longer than it",
					audio: "Do not lengthen the clip if the note is longer than it",
				},
				legato: "Fill the gaps between notes",
				multitrackForChords: "Generates multiple tracks for chords",
				createGroups: "Create groups for video and audio clips represented by one note",
				glissando: "Creates a swirl effect if the note pitch bends or slides",
				autoPan: "Pans the audio using envelope automation",
				mappingVelocity: "Map the attack velocity of notes to the specified item",
				transformOfx: "Miscz is a pixel hard edge plugin, enable to add keyframe properties to TransformOFX of this plugin",
				tuning: {
					stretchAttributes: "More config about the select tunning method",
					resample: "Lock stretch and pitch, adjust the stretch to change the pitch",
					preserveFormant: "Keep the voice tone while tunning",
					basePitch: "Specify what is the base pitch of the audio event",
				},
				effects: {
					prve: "Make your visuals more rhythmic",
					staff: "Use custom patterns as notes to draw visuals similar fashion to piano staff sheets",
				},
			},
			ytp: {
				_: "YouTube Poop (YTP) is for creating nonsensical videos using various effects known in the YTP genre.\nYTP is a Neo-Dada art form, is absurdist remixes that ape and mock the lowest technical and aesthetic standards of remix culture to comment on remix culture itself. It consists of video remixes that are edited from a large array of video clips in order to confuse, stun or amuse the viewer. The sources can be mashed all together into a nonsensical Crossover story, or just repeat footage of the characters gesticulating oddly.\nYTP supports multisource.",
				constraint: "Controls the length for the clip to generate",
				clips: "The value of clips generated",
				effects: "Specify the effects for YTP",
			},
		},
		empty: {
			disabled: {
				heading: "{{name, capitalize}} disabled",
				caption: "Enable to generate the {{name, lowercase}}",
			},
			ytpEnabled: {
				heading: "YTP enabled, all other related parameters are unavailable",
				caption: "Disable YTP feature to use and adjust other parameters",
				disableYtp: "Disable YTP",
				gotoYtp: "Go to YTP",
			},
		},
	},
} as const;

export default English;
