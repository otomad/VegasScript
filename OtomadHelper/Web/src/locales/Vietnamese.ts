import type { LocaleIdentifiers } from "./types";

export default {
	javascript: {
		metadata: {
			__translator__: "Cyahega",
			name: "Tiếng Việt",
			culture: "vi-VN",
		},
		colon: ": ",
		semicolon: "; ",
		enumerationComma: ", ",
		rangeDash: " – ",
		titles: {
			home: "Trang chủ",
			source: "Nguồn",
			score: "Điểm",
			audio: "Âm thanh",
			visual: "Hình ảnh",
			sonar: "Sonar",
			lyrics: "Lời hát",
			shupelunker: "Shupelunker",
			shupelunker_full: "Kỹ thuật Shupelunker",
			ytp: "YTP",
			ytp_full: "YouTube Poop",
			mosh_full: "Datamosh",
			tools: "Công cụ",
			management: "Công cụ quản lý",
			settings: "Cài đặt",
			staff: "Tông phổ",
			staff_full: "Staff Visualizer",
			pixelScaling: "Tỷ lệ pixel",
			parameters: "Thông số",
			grid: "Bố cục lưới",
			box3d: "Bố cục hộp 3D",
			gradient: "Track đa sắc",
			track: "Các track",
			mosh: "Mosh",
			effect: "Hiệu ứng",
			prve: "Hiệu ứng nhịp điệu hình ảnh PV",
		},
		source: {
			trackEvent: "Track event",
			projectMedia: "Đa phương tiện của dự án",
			browseFile: "Duyệt tập tin",
			trim: "Cắt ngắn",
			startTime: {
				_: "Thời gian bắt đầu",
				projectStart: "Bắt đầu dự án",
				cursor: "Con trỏ",
			},
			afterCompletion: {
				_: "Sau khi hoàn thành",
				removeSourceClips: "Loại bỏ track chứa clip gốc",
				selectSourceClips: "Chọn track chứa clip gốc",
				selectGeneratedClips: "Chọn tất cả clip đã tạo",
			},
			preferredTrack: {
				_: "Track ưa thích",
				index: "Chỉ số track ưa thích",
				top: "Trên",
				newTrack: "Track mới",
			},
			trackGroup: {},
			trackName: {},
			secretBox: {
				barOrBeat: {},
			},
		},
		on: "Bật",
		off: "Tắt",
		custom: "Tùy chỉnh",
		enabled: "Đã bật",
		enable: "Kích hoạt",
		learnMore: "Tìm hiểu thêm",
		condition: "Điều kiện",
		underConstruction: "Đang trong quá trình phát triển…",
		systemDefault: "Mặc định hệ thống",
		complete: "Hoàn tất",
		save: "Lưu",
		auto: "Tự động",
		back: "Trở lại",
		navigation: "Điều hướng",
		selectAll: "Chọn tất cả",
		invertSelection: "Đảo lựa chọn",
		reset: "Đặt lại",
		ok: "OK",
		descending: "Giảm dần",
		ascending: "Tăng dần",
		view: "Xem",
		disabled: "Đã vô hiệu hoá",
		infoBar: {
			warning: "Nhắc nhở",
		},
		selectionMode: {
			single: "Đơn lẻ",
			multiple: "Đa chọn",
		},
		subheaders: {
			moreOptions: "Tùy chọn khác",
			advanced: "Nâng cao",
			config: "Thiết Lập",
			parameters: "Thông số",
		},
		units: {},
		confirm: {
			delete: {},
		},
		curve: {
			linear: "Tuyến tính",
			fast: "Nhanh",
			slow: "Chậm",
			smooth: "Mượt",
			sharp: "Sắc nét",
			hold: "Giữ",
		},
		fileFormats: {
			allFiles: "Tất cả các file",
			midi: "File trình tự MIDI",
			ust: "File trình tự văn bản UTAU/OpenUTAU",
			vsq: "File trình tự Vocaloid",
		},
		score: {
			midi: "MIDI",
			tempo: {
				project: "Project tempo",
			},
			constrain: {
				max: "Độ dài tối đa",
				fixed: "Độ dài cố định",
			},
			pan: {
				_: "Xoay (Pan)",
				left: "Phải",
				right: "Trái",
			},
			instrument: "Nhạc cụ",
			musicalTrack: "Các track",
		},
		stream: {
			preview: "Xem trước",
			stretch: {
				_: "Kéo căng",
			},
			loop: "Lặp lại",
			playbackRate: {},
			normalize: {
				_: "Normalize",
			},
			staticVisual: "Hình ảnh tĩnh",
			truncate: {},
			legato: {
				_: "Legato",
				unlimited: "Không giới hạn",
			},
			multitrackForChords: "Đa track cho hợp âm (chord)",
			createGroups: "Tạo group",
			autoPan: "Tự động xoay pan",
			transformMethod: {
				pictureInPicture: "Hình trong Hình (PiP)",
			},
			playingTechniques: {
				glissando: {
					_: "Glisssando",
					swirl: "Xoáy",
					wave: "Sóng",
				},
				appoggiatura: {},
				arpeggio: {},
			},
			tuning: {
				_: "Tuning",
				tuningMethod: {
					_: "Phương pháp tuning",
					noTuning: "Không tuning",
					classic: "Classic",
				},
				stretchAttributes: {},
				alternativeForExceedTheRange: {},
				preserveFormant: "Giữ lại formant",
				basePitch: {
					_: "Cao độ ban đầu",
				},
				prelisten: {
					waveform: {
						sinusoid: "Sinusoid",
						triangle: "Triangle",
						square: "Hình vuông",
						sawtooth: "Sawtooth",
					},
					duration: "Thời lượng",
					adjustAudioToBasePitch: "Chỉnh audio thành cao độ cơ bản",
				},
			},
			mapping: {
				velocity: "Velocity",
				pitch: "Pitch (Cao độ)",
				duration: "Thời lượng",
				pan: "Xoay (Pan)",
			},
			preset: {},
			parameters: {},
		},
		track: {
			grid: {
				square: "Hình vuông",
				fit: {
					_: "Vừa",
				},
				mirrorEdges: {
					_: "Cạnh phản chiếu",
					hFlip: {
						even: "Cột chẵn",
						odd: "Cột lẻ",
					},
					vFlip: {
						even: "Hàng chẵn",
						odd: "Hàng lẻ",
					},
				},
				padding: "Đệm",
				column: "Cột",
				row: "Hàng",
			},
			box3d: {
				deleteTracks: "Xoá các track gốc",
				useLongerSide: "Sử dụng cạnh dài hơn của chiều dài cạnh",
				faces: {
					front: "Trước",
					back: "Trở lại",
					left: "Phải",
					right: "Trái",
					top: "Trên",
					bottom: "Dưới",
				},
			},
			gradient: {
				effects: {
					rainbow: "Màu cầu vồng",
					graduallySaturated: "Dần dần bão hòa",
					graduallyContrasted: "Tương phản dần dần",
					alternatelyChromatic: "Đa sắc khác",
					alternatelyNegative: "Âm bản khác",
				},
				view: {},
			},
			legato: {
				_: "Legato",
			},
			clear: {},
		},
		sonar: {
			separateDrums: "Tách các drum",
			differenceCompositeMode: "Chế độ composite khác",
			shadow: "Đổ bóng",
		},
		lyrics: {
			sampleLyrics: "Gà lẩu cay",
			karaoke: {},
			pitchNotation: {},
		},
		shupelunker: {
			affix: {},
			unallocated: {},
		},
		ytp: {
			effects: {
				chorus: "Chorus",
				delay: "Độ trễ",
				changePitch: "Thay đổi cao độ",
				reverse: "Đảo ngược",
				changeSpeed: "Thay đổi tốc độ",
				vibrato: "Rung",
				changeHue: "Thay đổi màu",
				rotateHue: "Xoay màu",
				monochrome: "Đơn sắc",
				negative: "Âm bản",
				repeatRapidly: "Lặp lại liên tục",
				spherize: "Tạo hình cầu",
				mirror: "Phản chiếu",
				highContrast: "Độ tương phản cao",
				oversaturation: "Quá bão hòa",
			},
			sideEffects: {
				wave: "Sóng",
			},
		},
		mosh: {
			datamosh: "Datamosh",
			datamix: "Datamix",
			layer: "Layer",
			render: "Render",
			scramble: "Scramble",
			automator: "Automator",
			stutter: "Stutter",
			shake: "Rung Lắc",
		},
		tools: {
			clawer: "Máy gắp",
		},
		selectInfo: {},
		prve: {
			initialValue: "Giá trị ban đầu",
			control: {},
			classes: {
				flip: "Lật",
				rotation: "Xoay",
				scale: "Tỷ lệ",
				mirror: "Phản chiếu",
				invert: "Đảo ngược",
				hue: "Màu",
				chromatic: "Đơn sắc",
				time: "Thời gian",
				time2: "Thời gian 2",
				ec: "Mở rộng & Nén",
				swing: "Lung lắc",
				blur: "Làm mờ",
				wipe: "Xoá",
			},
			effects: {
				normal: "Bình thường",
				hFlip: "Lật ngang",
				vFlip: "Lật dọc",
				ccwFlip: "Lật ngược chiều kim đồng hồ",
				cwFlip: "Lật theo chiều kim đồng hồ",
				ccwRotate: "Xoay ngược chiều kim đồng hồ",
				cwRotate: "Xoay theo chiều kim đồng hồ",
				turned: "Quay",
				zoomOutIn: "Phóng to thu nhỏ",
				hMirror: "Phản chiếu ngang",
				vMirror: "Phản chiếu dọc",
				ccwMirror: "Phản chiếu ngược chiều kim đồng hồ",
				cwMirror: "Phản chiếu theo chiều kim đồng hồ",
				negative: "Âm bản",
				luminInvert: "Đảo ngược độ sáng",
				hueInvert: "Đảo ngược màu",
				chromatic: "Đa sắc và đơn sắc",
				pingpong: "Hiệu ứng Ping-pong",
				sharpRewind: "Tua lại sắc nét",
				wobblePeriod: "Dao động chu kỳ",
				vExpansion: "Mở rộng theo chiều dọc",
				vCompression: "Nén theo chiều dọc",
				vBounce: "Nảy dọc",
				slantDown: "Mở rộng nghiêng ra và nén lại",
				pendulum: "Con lắc",
				gaussianBlur: "Mờ kiểu Gaussian",
				radialBlur: "Mờ xuyên tâm",
				wipeRight: "Xoá sang bên phải",
				splitVOut: "Tách dọc",
			},
			amounts: {},
		},
		pixelScaling: {},
		settings: {
			about: {
				documentation: "Tài liệu",
				version: "Phiên bản",
				author: "Tác giả",
				__author__: "Lan Triệt Kì",
				originalAuthor: "Tác giả gốc",
				__originalAuthor__: "Chaosinism",
				translator: "Dịch giả",
			},
			language: {
				_: "Ngôn ngữ",
				en: "Tiếng Anh",
				"zh-CN": "Tiếng Trung - giản thể",
				ja: "Tiếng Nhật",
				vi: "Tiếng Việt",
			},
			appearance: {
				backgroundImage: {
					opacity: "Độ mờ",
				},
				colorScheme: {
					auto: "Tự động",
					contrast: "Độ tương phản cao",
				},
				transparency: {},
			},
			preference: {},
			config: {},
			dev: {},
		},
		descriptions: {
			source: {
				preferredTrack: {
					belowAdjustmentTracks: {},
				},
				trackGroup: {},
				trackName: {},
				secretBox: {
					barOrBeat: {},
				},
				consonant: {},
			},
			score: {},
			stream: {
				stretch: {},
				loop: {},
				playbackRate: {},
				normalize: {},
				truncate: {},
				resampleImitatively: {},
				playingTechniques: {
					glissando: {},
					appoggiatura: {},
					arpeggio: {},
				},
				tuning: {
					tuningMethod: {
						evaluates: {},
					},
					alternativeForExceedTheRange: {},
					basePitch: {},
					prelisten: {},
				},
				effects: {},
				mapping: {},
				preset: {},
			},
			track: {
				grid: {
					fit: {},
					mirrorEdges: {},
				},
				box3d: {},
				legato: {},
			},
			sonar: {},
			lyrics: {
				karaoke: {},
				pitchNotation: {},
			},
			shupelunker: {
				unallocated: {},
			},
			ytp: {},
			mosh: {
				normal: "Datamosh là một kĩ thuật làm biến dạng video để tạo hiệu ứng glitch.",
				glitchy: "])4t4m0sh |_4ˋ m0^.t kj~ thu4^.t |_4ˋm |313^'n ])4.ng vj])30 +)3^? t4.0 hj3^.u u\"ng g|1tch.",
			},
			tools: {
				converters: {},
			},
			staff: {},
			prve: {
				control: {},
			},
			pixelScaling: {},
			settings: {
				appearance: {
					colorScheme: {},
					transparency: {},
				},
				preference: {},
			},
		},
		empty: {
			disabled: {},
			ytpEnabled: {
				partial: {},
				fully: {},
			},
		},
		menu: {
			delete: "&Xoá",
		},
		aria: {},
		preset: "Preset",
	},
	csharp: {
		host: {
			toolTip: {
				importToHere: "Nhập %1",
			},
		},
		contentDialog: {
			button: {
				ok: "&OK",
				cancel: "&Huỷ",
				close: "&Đóng",
			},
			expander: {
				expandDetails: "Mở rộng chi tiết",
				collapseDetails: "Thu nhỏ chi tiết",
			},
			showError: {
				title: "Lỗi",
			},
		},
		wrongOpeningMethod: {
			script: {},
		},
		textBox: {
			menu: {},
		},
		colorPicker: {
			axis: {},
			axisAbbrs: {},
		},
		flyout: {
			confirmDelete: {
				title: "Xoá?",
			},
		},
		keybindings: {
			commands: {},
		},
		descriptions: {
			colorPicker: {},
		},
	},
} as const satisfies LocaleIdentifiers;
