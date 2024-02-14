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
			lyrics: "Lyrics",
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
		underConstruction: "Under construction…",
		allFiles: "All Files",
		systemDefault: "System default",
		subheaders: {
			moreOptions: "More options",
			advanced: "Advanced",
			config: "Configuration",
			parameters: "Parameters",
			effects: "Effects",
		},
		score: {
			midi: "MIDI",
			midiFile: "MIDI Sequence Files",
			st: "Sequence text",
			ustFile: "UTAU/OpenUTAU Sequence Text Files",
			vsqFile: "Vocaloid Sequence Files",
			refOtherTracks: "Refer to other tracks",
			tts: "Text to speech",
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
		stream: {
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
				alternativeForExceedsTheRange: "If exceeds the range",
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
			about: {
				_: "About",
				checkForUpdates: "Check for updates",
			},
			language: {
				_: "Language",
				en: "English",
				"zh-CN": "Simplified Chinese",
				ja: "Japanese",
				vi: "Vietnamese",
			},
			appearance: {
				_: "Appearance",
				colorScheme: {
					_: "Color scheme",
					light: "Light",
					dark: "Dark",
					auto: "Auto",
				},
				uiScale: "UI scale",
			},
			config: {
				hideFeatureTips: "Hide feature tips",
			},
			dev: {
				_: "Dev",
				devMode: "Developer mode",
			},
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
			stream: {
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
			sonar: {
				_: "Sonar is utilizing the shapes of Cookie Cutter to create beat-style visuals for drum kits.",
			},
			shupelunker: {
				_: "Shupelunker Tactics are an untuned otomad tactic. It is used to play the melody by using a clip of the source (usually a vocal) at the same pitch as the melody, that is, the source clip itself is pitched to match the melody.\nIf the pitch of the clip does not match the melody, “Tartar Tactics” will be generated. It is also untuned, and allows you to choose where the clip is cut (usually at a dialogue), with audio stretching and rewinding often used, as well as adding sixteenth to sixty-fourth rest notes. During the production, the source clips will be aligned with the rhythm for singing sense.",
			},
			ytp: {
				_: "YouTube Poop (YTP) is for creating nonsensical videos using various effects known in the YTP genre. YTP supports multisource.\nYTP is a Neo-Dada art form, which is absurdist remixes that ape and mock the lowest technical and aesthetic standards of remix culture to comment on remix culture itself. It consists of video remixes that are edited from a large array of video clips in order to confuse, stun or amuse the viewer. The sources can be mashed all together into a nonsensical Crossover story, or just repeat footage of the characters gesticulating oddly.",
				constraint: "Controls the length for the clip to generate",
				clips: "The value of clips generated",
				effects: "Specify the effects for YTP",
			},
			mosh: {
				normal: "Datamosh is a technique of damaging clips to create glitchy effects.",
				glitchy: "Ða̵̝̻͔͎͋̇͑̆ƭą̬͉̫̐͑̓̄ͅa̸͎͇͗̌͂̈̀ą̸̝̼̦̤̇̐ǎ̛͍́̑a̸̲͙͛̐̄̎̚͜a̢̨̝̟͎̾̔̊ǎ̤̞͈͑a͈̪̣̍₥o̻̪̬̘̲͆͂͠o̸͍̞͔̓̆̊̀o̗͊̇̇̈́̇ǫ͇͗̏̕͜ơ̬͍͚̦̯̓̊͌ò͈̦̫̈́̓o̦̣̲̊̀o̪̪͚̺̘͛̽̏̈́ƨλ ïƨ á ƭèçλñï9úè ôƒ δá₥áϱïñϱ çℓïƥƨ ƭô çřèáƭè ϱℓïƭçλ¥ èƒƒèçƭƨ.",
				additional: "In video art, one technique used is datamoshing. Where two videos are interleaved so intermediate frames are interpolated from two separate sources. And exploits the difference in how the separate video codecs process motion and color information.",
			},
			staff: {
				_: "Staff Visualizer is to use custom patterns as notes to draw visuals similar fashion to piano staff sheets based on the melody of the score.\nThis visual effect style mimics the videos of YouTuber @grantwoolard, who featured the use of musicians' avatars to draw the piano staff sheets of classical music.",
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
