import type { LocaleIdentifiers } from "./types";

export default {
	javascript: {
		metadata: {
			__translator__: "",
			name: "日本語",
			culture: "ja-JP",
		},
		colon: "：",
		semicolon: "；",
		enumerationComma: "・",
		rangeDash: "〜",
		titles: {
			home: "ホーム",
			source: "素材",
			score: "譜面",
			audio: "音声",
			visual: "映像",
			sonar: "ソナー",
			lyrics: "歌詞",
			shupelunker: "シュペランカー",
			shupelunker_full: "シュペランカー戦法",
			ytp: "YTP",
			ytp_full: "YouTube Poop",
			mosh_full: "データモッシュ",
			tools: "ツール",
			management: "管理",
			settings: "設定",
			staff: "スタッフ",
			staff_full: "スタッフビジュアライザー",
			pixelScaling: "ピクセルスケーリング",
			parameters: "パラメータ",
			grid: "グリッドレイアウト",
			box3d: "3D ボックスレイアウト",
			gradient: "グラデーショントラック",
			track: "トラック",
			mosh: "モッシュ",
			effect: "効果",
			prve: "映像リズム視覚効果",
		},
		source: {
			trackEvent: "予定を追跡",
			projectMedia: "メディアをプロジェクト",
			browseFile: "ファイルを参照",
			trim: "切り落とし",
			startTime: {
				_: "開始日時",
				projectStart: "プロジェクトの開始",
				cursor: "カーソル",
			},
			afterCompletion: {
				_: "完了後",
				removeSourceClips: "ソーストラッククリップを削除",
				selectSourceClips: "ソーストラッククリップを選択",
				selectGeneratedClips: "生成されたすべてのクリップを選択",
			},
			preferredTrack: {
				_: "優先トラック",
				index: "トラックの優先インデックス",
				top: "最上部",
				ordinal: "{{count, ordinal}}のトラックの下",
				belowAdjustmentTracks: "1つ以上の調整トラックがこのトラックの下にある場合は、次のトラックを選択してください。",
				newTrack: "新しいトラック",
				quicklySelect: "現在のトラックをすばやく選択",
			},
			trackGroup: {
				_: "トラックのグループ化",
				collapse: "トラックグループをデフォルトで閉じる",
			},
			trackName: {
				_: "トラックの名前",
				track: "楽譜名",
				trackIndex: "スコアトラックインデックス",
				instrument: "楽器楽器名",
				channel: "スコアのチャンネル番号",
				clip: "ソースクリップ名",
				media: "ソースメディア名",
				score: "スコアファイル名",
				unnamed: "名前なし",
			},
			secretBox: {
				_: "素材盲の箱",
				track: "各トラックまたはチャンネルに対して",
				marker: "マーカーごとに1回ずつ切り替える",
				barOrBeat: {
					_: "1小節あたり1回またはビートを切り替える",
					period: "期間",
					preparation: "準備",
				},
			},
			consonant: "子音時間",
		},
		on: "オン",
		off: "オフ",
		custom: "カスタム",
		enabled: "有効",
		enable: "有効にする",
		learnMore: "もっと詳しく",
		condition: "条件",
		underConstruction: "工事中⋯⋯",
		systemDefault: "システムのデフォルト",
		complete: "完了",
		dragToImport: "ドラッグ＆ドロップで {{item, lowercase}} としてインポート",
		save: "保存",
		auto: "自動",
		back: "戻る",
		navigation: "ナビ",
		selectAll: "すべて選択",
		invertSelection: "選択を反転",
		variableBeginWith: "{{first, lowercase}} からの変数",
		reset: "リセット",
		new: "新規作成",
		etc: "{{examples}}など",
		offset: "オフセット",
		unselected: "選択を解除",
		topPriority: "最初に {{item}}",
		browse: "検索",
		ok: "OK",
		descending: "降順",
		ascending: "昇順",
		view: "表示",
		size: "サイズ",
		disabled: "無効",
		apply: "適用",
		unset: "未設定",
		infoBar: {
			warning: "警告",
		},
		selectionMode: {
			single: "Single",
			multiple: "Multiple",
		},
		subheaders: {
			moreOptions: "その他のオプション",
			advanced: "高度な設定",
			config: "設定",
			parameters: "パラメータ",
			seeAlso: "関連項目",
		},
		units: {
			piece: "",
			millisecond: "ms",
			percent: "%",
			pixel: "px",
			beatPerMinute: "BPM",
			semitone: "st",
			degree: "°",
			densityIndependentPixel: "dp",
			times: "×",
			bar: "バー",
			beat: "ビーツ",
			cent: "セント",
		},
		confirm: {
			delete: {
				backgroundImage: "この背景画像を削除してもよろしいですか？",
			},
		},
		curve: {
			_: "補間曲線",
			linear: "Linear",
			fast: "速い",
			slow: "遅い",
			smooth: "スムース",
			sharp: "シャープ。",
			hold: "保留",
		},
		fileFormats: {
			allFiles: "すべてのファイル",
			txt: "文書ドキュメント",
			midi: "MIDI シーケンスファイル",
			singthesis: "サポートされているすべてのシングルテーゼ(テキスト合成/音声合成ソフトウェアプロジェクト) ファイル",
			ust: "UTAU/OpenUTAU シーケンステキスト ファイル",
			vsq: "Vocaloid シーケンスファイル",
		},
		score: {
			midi: "MIDI",
			singthesis: "Singthesis",
			refOtherTracks: "他の曲を参照",
			tts: "テキストから発話する",
			pureNotes: "純粋なノート",
			encoding: "エンコード",
			tempo: {
				_: "Tempo",
				variableScore: "可変スコアのテンポ（テンポ）",
				constantScore: "一定のスコアのテンポ。",
				project: "プロジェクトのテンポ（テンポ）",
			},
			timeSignature: "拍子記号",
			constrain: {
				_: "音符の長さを拘束する",
				none: "拘束なし",
				max: "最大長さ",
				fixed: "固定長さ",
			},
			trackOrChannel: "トラック / チャンネル",
			noteCount: "ノート数",
			beginNote: "ノートの開始",
			pan: {
				_: "パン",
				left: "左",
				right: "右",
				center: "中央揃え",
			},
			instrument: "機器",
			drumKit: "ドラムキット",
			musicalTrack: "トラック",
			channel: "チャンネル",
		},
		stream: {
			preview: "プレビュー",
			stretch: {
				_: "ストレッチ",
				noStretching: "ストレッチなし",
				flexingAndExtending: "屈曲と拡張",
				extendingOnly: "拡張のみ",
				flexingOnly: "曲げのみ",
			},
			loop: "ループ",
			playbackRate: {
				_: "再生率",
				based: "現在のレートに基づいて調整",
				sync: "オーディオと視覚的な構成を同期",
			},
			normalize: {
				_: "正規化",
				once: "一度だけ",
				always: "常に表示",
			},
			staticVisual: "静的ビジュアル",
			truncate: {
				_: "Truncate",
				lengthenable: "Lengthenable",
				freezeEndFrames: "終了フレームを固定",
				trimEndFrames: "終了フレームをトリムする",
				splitThenFreeze: "分割して凍結する",
				freezeToGray: "グレーに固定",
				freezeToPreset: "プリセットに固定",
			},
			legato: {
				_: "Legato",
				portato: "Portato",
				upToOneBeat: "1ビートまで",
				upToOneBar: "1小節まで",
				unlimited: "無制限です",
			},
			multitrackForChords: "コードのマルチラック",
			createGroups: "グループを作成",
			autoPan: "オート パン",
			stack: "スタック",
			persistentTimeflow: "永続的なタイムフロー",
			resampleImitatively: "模倣して再サンプルする",
			transformMethod: {
				_: "変換方法",
				panCrop: "パン/トリミング",
				pictureInPicture: "Picture in Picture",
				transformOfx: "TransformOFX",
			},
			playingTechniques: {
				_: "プレーの技術",
				applyCustomPreset: "カスタムプリセットを適用する",
				glissando: {
					_: "Glissando",
					swirl: "渦巻き",
					wave: "ウェーブ",
					tv: "テレビ",
					pingpong: "ピンポン",
					swirlAmount: "渦巻きの量",
				},
				appoggiatura: {
					_: "Appoggiatura",
				},
				arpeggio: {
					_: "Arpeggio",
				},
			},
			tuning: {
				_: "チューニング",
				tuningMethod: {
					_: "チューニング方法",
					noTuning: "チューニングなし",
					pitchShift: "ピッチシフト",
					elastic: "Élastique",
					classic: "クラシック",
					scaleless: "スケールレス",
					acid: "ACID",
				},
				stretchAttributes: {
					_: "ストレッチ属性",
				},
				alternativeForExceedTheRange: {
					_: "範囲を超えた場合",
					multiple: "オーディオエフェクトプラグインの複数使用",
					plugin: "ピッチシフトオーディオエフェクトプラグインに切り替える",
					octave: "高いオクターブ/低いオクターブ",
					octaveExp: "高オクターブ/低オクターブ（実験的）",
					wrap: "上/下に折り返す",
					silent: "サイレントモード",
				},
				resample: "リサンプ",
				preserveFormant: "フォルマントを保存する",
				basePitch: {
					_: "ベースピッチ:",
					cent: "セント",
					based: "現在のピッチシフトに基づいて調整",
					auto: "自動チューニング",
				},
				prelisten: {
					_: "プレ再生",
					basePitch: "プレリッスンのピッチ:",
					audio: "Prelisten audio",
					stop: "プリリスニングを停止する",
					engine: "エンジン",
					waveform: {
						_: "波形",
						sinusoid: "Sinusoid",
						triangle: "Triangle",
						square: "矩形波",
						sawtooth: "ノコギリ波",
					},
					duration: "期間",
					volumeForBasePitch: "プリリスニングベースピッチ時の音量",
					adjustAudioToBasePitch: "音声をベースピッチに調整",
				},
			},
			mapping: {
				_: "マッピング",
				velocity: "Velocity",
				pitch: "Pitch",
				duration: "期間",
				pan: "パン",
				progress: "進捗状況",
			},
			preset: {
				add: "カスタムプリセットに追加",
			},
			parameters: {
				copyFromAnotherParameterScheme: "別のパラメータスキームからここにコピー",
				copyAttributesFromSelectedClip: "選択したクリップから属性をコピー",
			},
		},
		track: {
			layout: "レイアウト",
			grid: {
				array: "行列",
				square: "正方形（正方形）",
				min: "最小",
				max: "最大値",
				transpose: "入れ替え",
				numberOfSelectedTracks: "選択したトラックの数",
				fastFill: "Fast fill",
				fit: {
					_: "合わせる",
					cover: "カバー",
					contain: "含まれている",
				},
				mirrorEdges: {
					_: "鏡像エッジ",
					unflipped: "反転しない",
					hFlip: {
						even: "偶数",
						odd: "奇数列",
					},
					vFlip: {
						even: "偶数",
						odd: "奇数行",
					},
				},
				padding: "Padding",
				column: "列",
				row: "行",
			},
			box3d: {
				deleteTracks: "元のトラックを削除する",
				useLongerSide: "エッジの長さの長い側を使用",
				faces: {
					front: "フロント",
					back: "戻る",
					left: "左",
					right: "右",
					top: "上",
					bottom: "下揃え",
				},
			},
			gradient: {
				effects: {
					rainbow: "虹の色",
					graduallySaturated: "徐々に飽和する",
					graduallyContrasted: "徐々に比較",
					threshold: "しきい値バリエーション",
					alternatelyChromatic: "代わりにクロマティック",
					alternatelyNegative: "代替の負の値",
				},
				view: {
					overlay: "Overlay",
				},
			},
			applyToSelectedTracks: "選択したトラックに適用",
			deactivate: "無効にする",
			deactivateAll: "すべて無効にする",
			legato: {
				_: "Legato",
				stacking: "スタッククリップ\n現在の曲の場合",
				stackingAllTracks: "スタッククリップ\nすべての曲に適用",
				stackingSelected: "スタッキングクリップ\n選択したクリップ",
				stackingAllAfter: "クリップ\nをすべての後にスタックする",
				limitStretch: "ストレッチ制限内のクリップ\n",
				stretch: "ストレッチ制限を超えたときにクリップ\n長さを伸ばします",
				lengthen: "エキスパンションクランプ\nクリップの長さの変更",
				increaseSpacing: "\n現在のトラックの間隔を上げる",
				increaseSpacingAllTracks: "\n間隔を広げます。すべてのトラックについて。",
				forClips: "選択したクリップのみ",
				includeGroup: "グループ内のクリップを含める",
				backwards: "戻る",
			},
			clear: {
				_: "クリア",
				motion: "トラックの動きを消去",
				effect: "トラックエフェクトをクリア",
			},
		},
		sonar: {
			separateDrums: "ドラムを別々にする",
			differenceCompositeMode: "差分コンポジットモード",
			shadow: "影",
			graphs: "グラフ",
		},
		lyrics: {
			useStaticText: "静的テキストから直接字幕を挿入する",
			sampleLyrics: "鶏のスパイシー鍋",
			presetTemplate: "プリセットテンプレート",
			enableMode: "{{mode, lowercase}} モードを有効にする",
			karaoke: {
				_: "カラオケ",
				futureFill: "歌詞の塗りつぶし色",
				pastFill: "歌詞の塗りつぶし色",
			},
			pitchNotation: {
				_: "ピッチ表記法",
				system: "楽器表記システム",
				scientific: "科学的ピッチ表記法",
				helmholtz: "ヘルムホルツ式ピッチ表記法",
				solfege: "ソルフェージュ",
				numbered: "数字譜",
				gongche: "工尺譜",
				gongshang: "宮商譜",
				lyulyu: "律呂譜",
				midiNumber: "MIDIピッチ番号",
				frequency: "頻度",
			},
		},
		shupelunker: {
			affix: {
				_: "ピッチ接着位置を一致させる",
				prefix: "プレフィックス",
				suffix: "Suffix",
			},
			unallocated: {
				_: "未割り当て",
				octaves: "Octaves",
				fillUp: "満タンにする",
				fillDown: "Fill down",
				default: "既定の完全な範囲",
			},
			exclusiveTrack: "専用トラック",
			keyMappingZones: "キーマッピングゾーン",
		},
		ytp: {
			constrain: "拘束の長さ",
			clips: "クリップ",
			effects: {
				_: "YTPエフェクト",
				chorus: "コーラス",
				delay: "遅延",
				changePitch: "ピッチを変更",
				reverse: "逆再生",
				changeSpeed: "変更速度",
				vibrato: "ビブラート",
				changeHue: "色相を変更",
				rotateHue: "色相を回転",
				monochrome: "モノクローム",
				negative: "負の値",
				repeatRapidly: "すばやく繰り返す",
				randomTuning: "ランダムチューニング",
				upsize: "Upsize",
				spherize: "球体化",
				mirror: "ミラー",
				highContrast: "ハイコントラスト（ハイコントラスト）",
				oversaturation: "過彩度",
				emphasizeThrice: "強調するためのトレ",
				twist: "ツイスト",
				pixelate: "ピクセル",
				spectrum: "スペクトラム",
				thermal: "サーマルビジョン",
				emboss: "エンボス",
				bump: "ダンプ",
				edge: "エッジを検索",
			},
			sideEffects: {
				wave: "ウェーブ",
				pitchDown: "ピッチダウン",
				pitchUp: "ピッチアップ",
				pitchUpOrPitchDown: "ピッチアップまたはピッチダウン",
				hFlipWithRhythm: "リズム付き水平フリップ",
				loud: "大音量で",
				sporadicUpsizeFocusMotion: "散発的なアップサイズフォーカスモーション",
			},
		},
		mosh: {
			datamosh: "データモッシュ",
			datamix: "データミックス",
			layer: "レイヤー",
			render: "レンダー",
			scramble: "スクランブル",
			automator: "オートメーター",
			stutter: "スタッター",
			shake: "シェイク",
			specifyClipsFolder: "データモッシュ クリップフォルダーを指定します",
			install: "データモッシュ拡張パックをダウンロード",
		},
		tools: {
			flow: "フロー",
			selectorAndReplacer: "選択と置換器",
			normalizer: "ノーマライザー",
			subtitles: "字幕",
			effector: "エフェクト",
			fader: "Fader",
			exportScore: "点数をエクスポート",
			converters: "コンバータ",
			clawer: "Clawer",
		},
		selectInfo: {
			trackEventOnlyOne: "あなたはトラックイベントを1つだけ選択する必要があります。それ以上、それ以下ではありません。",
			videoEventOnlyOne: "あなたは1つと1つのビデオトラックのイベントを選択する必要があります。それ以上、そしてそれ以上ではありません。",
			audioEventOnlyOne: "オーディオトラックのイベントを1つとして選択する必要があります。それ以上ではありません。",
			source: "{{count}}のメディアソースが選択されました",
			track: "{{count}}トラックが選択されました",
			videoTrack: "{{count}}ビデオトラックが選択されました",
			audioTrack: "{{count}}オーディオトラックが選択されました",
			trackEvent: "{{count}}トラックイベントが選択されました",
			videoEvent: "{{count}}ビデオトラックイベントが選択されました",
			audioEvent: "{{count}}オーディオトラックイベントが選択されました",
		},
		prve: {
			initialValue: "初期値",
			control: {
				general: "全般",
				general_full: "一般的なコントロール",
				samePitch: "同じピッチです",
				samePitch_full: "同じピッチコントロール",
				differentSyllables: "異なる音節",
				differentSyllables_full: "異なる音節制御",
			},
			classes: {
				_: "クラス",
				flip: "フリップクラス",
				rotation: "回転クラス",
				scale: "スケールクラス",
				mirror: "ミラークラス",
				invert: "クラスを反転",
				hue: "色相クラス",
				chromatic: "モノクロクラス",
				time: "タイムクラス",
				time2: "時間クラス2",
				ec: "拡張と圧縮クラス",
				swing: "スウィングクラス",
				blur: "ぼかしクラス",
				wipe: "クラスの消去",
			},
			effects: {
				normal: "標準",
				hFlip: "水平方向の反転",
				vFlip: "垂直反転",
				ccwFlip: "反時計回りに反転",
				cwFlip: "Clockwise Flip",
				rotate: "回転",
				ccwRotate: "反時計回りの回転",
				cwRotate: "時計回りの回転",
				turned: "ターンしました",
				zoomOutIn: "ズームイン",
				hMirror: "水平ミラー",
				vMirror: "垂直ミラー",
				ccwMirror: "反時計回りミラー",
				cwMirror: "時計回りのミラー",
				negative: "負の値",
				luminInvert: "照度を反転",
				negativeFade: "負のクロスフェード",
				negativeLuma: "Negative Luma Fade",
				rotInvertHue: "反転を回転して色相を優先する",
				rotInvertLumin: "反転を回転し、輝度を優先する",
				altInvertHue: "交互反転、色相を優先する",
				altInvertLumin: "交互に反転し、照度を優先する",
				hueInvert: "Hue Invert",
				chromatic: "クロマティックとモノクローム",
				chromaticFade: "クロマティックとモノクロクロスフェード",
				pingpong: "Ping-Pong Effect",
				whirl: "愛の魔法、スピン、円の中で回転する",
				sharpRewind: "シャープ巻き戻し",
				wobblePeriod: "ぐらつきの期間",
				vExpansion: "垂直拡張",
				vExpansionBounce: "バウンス付き垂直拡張",
				vCompression: "垂直圧縮",
				vCompressionBounce: "バウンス付き垂直圧縮",
				vBounce: "垂直バウンス",
				slantDown: "Slant Down",
				slantUp: "傾斜上",
				puyo: "Puyo Puyo",
				pendulum: "振り子を再生",
				gaussianBlur: "ガウスぼかし（ぼかし）",
				radialBlur: "放射状ぼかし（ぼかし）",
				wipeRight: "右端で消去",
				wipeRight1: "右側の1ステップワイプ",
				splitVOut: "垂直方向に分割",
				stepChangeHue: "{{count}} 歩数の色の違い",
			},
			amounts: {
				compression: "縮小スケール",
				puyo: "変形率",
				pendulum: "スイング角度",
				rotationAngle: "回転角度",
				rotationStep: "月経周期ごとのステップ",
			},
		},
		pixelScaling: {
			scaleFactor: "拡大率",
			replaceSourceMedia: "ソースメディアを置き換え",
		},
		settings: {
			about: {
				checkForUpdates: "アップデートを確認",
				repositoryLink: "リポジトリ",
				documentation: "ドキュメント",
				translation: "翻訳に貢献",
				feedback: "フィードバック",
				changeLog: "更新履歴",
				license: "ライセンス",
				version: "バージョン",
				author: "作成者",
				__author__: "蘭澈 祈",
				originalAuthor: "オリジナルの著者",
				__originalAuthor__: "Chaosinism",
				translator: "翻訳",
				translators: "翻訳",
			},
			language: {
				_: "言語",
				en: "英語",
				"zh-CN": "簡体字中国語",
				ja: "日本語",
				vi: "ベトナム語",
			},
			appearance: {
				_: "外観",
				backgroundImage: {
					_: "背景画像",
					opacity: "透明度",
					tint: "色合い",
					blur: "ぼやけ",
				},
				colorScheme: {
					_: "配色設定",
					light: "ライト",
					dark: "ダーク",
					auto: "自動",
					black: "ブラック",
					contrast: "ハイコントラスト",
				},
				transparency: {
					_: "ダイアログ素材",
					acrylic: "アクリル",
					mica: "マイカ",
					micaAlt: "マイカ アルト",
					solid: "純色",
				},
				uiScale: "UIスケール",
			},
			preference: {
				_: "設定",
				autoSwitchSourceFrom: "ソースの自動切り替え",
				autoCollapsePrveClasses: "$t(titles.prve) クラスを自動的に折りたたみます。",
			},
			config: {
				hideUsageTips: "使用ヒントを非表示",
			},
			dev: {
				_: "開発",
				devMode: "開発者モード",
				rtl: "レイアウト方向右から左へ",
			},
		},
		descriptions: {
			unsupportedBrowser: "申し訳ありませんが、レガシー {{browser}} ブラウザはサポートされていません。アップデートしてください！",
			condition: "この設定をいつ適用するかを指定します",
			curve: "キーフレームタイプの補間曲線を指定します。",
			source: {
				trim: "指定したソースのインポイントまたはアウトポイントタイムを調整します。",
				startTime: "プロジェクトから生成を開始するタイミングを指定します",
				preferredTrack: {
					_: "生成する既存のトラックを指定できます(マルチトラックを除く)",
					fillingInstructions: "0の場合は、すべてのトラックの上に生成されます。\n正であれば、n番目のレールの下に生成されます。\n負の場合は、最後からn番目のレールの下で生成されます。\nオーディオまたはビデオで優先曲を指定すると、このオプションは上書きされます。",
					belowAdjustmentTracks: {
						versionRequest: "注意: この機能はVEGAS Pro 19以上が必要です。現在のバージョンは {{version}}です。",
					},
				},
				trackGroup: {
					_: "スコアトラックごとのグループトラック",
				},
				trackName: {
					_: "生成されたトラックまたはトラック グループの名前を指定します",
				},
				secretBox: {
					_: "ソースのポイントをランダム化します。\nこれは、ランダムに選択されたソースクリップが異なるベースピッチを持つ可能性があります。 娯楽用の面白い動画の作成にのみ役立ちますし、高度な動画の作成にはほとんど使用されません。",
					track: "トラックまたはチャンネルがスコアに依存するかどうか",
					marker: "スコアにマーカーがある場合、ソースのインポイントは一度変更されます。 複数のマーカーに同じ名前が空でない場合、ソースのポイントで同じ名前が使用されます。",
					barOrBeat: {
						_: "スコアに従って、ソースのポイントを一定期間で手動で変更します。",
						period: "変更する期間を指定",
						preparation: "最初の実行までの遅延",
					},
					ytpEnabled: "YTP機能が有効になっており、既にランダム化に対応しているため、ここで設定する必要はありません。",
				},
				consonant: {
					_: "子音が伸びたり遅れたりするのを防ぐために。 音源やビデオソースの子音部分と母音部分を分離することができます 音源の子音部分に 特別な最適化を適用することができます\n少なくとも2つのオーディオクリップまたはビデオクリップを選択している場合。 最初のクリップは子音部分で2つ目のクリップは母音部分と見なされています",
					ytpEnabled: "YTP機能は有効であり、この機能は現在利用できません。",
					secretBoxEnabled: "ブラインドボックス機能が有効になっており、この機能は現在利用できません。",
					manualEnabled: "format@@0 モードでは、この機能は自動的に有効になります。",
				},
			},
			score: {
				trim: "スコアの生成時間範囲をインターセプトします",
				encoding: "ファイルの読み込み時に使用するテキストエンコーディングを指定します",
				tempo: "分あたりの拍数を指定します",
				constrain: "スコアからのノートの出力長さを制御します",
				trackOrChannel: "MIDI トラックまたは MIDI チャンネルを使用するかどうかを選択します",
				ytpEnabled: "YTP機能が有効になっているため、スコアに依存しないので、ここでのすべての設定は効果がありません。",
			},
			stream: {
				stretch: {
					_: "クリップの長さを変更する代わりに、クリップを伸ばします。",
					noStretching: "ストレッチは許可されていません。期間を変更するだけです",
					flexingAndExtending: "ノートがクリップよりも長いかどうかを拡大します。",
					extendingOnly: "音符のみがクリップよりも長い場合はストレッチします。それ以外の場合は、長さを短くします",
					flexingOnly: "音符のみがクリップより短い場合はストレッチします。それ以外の場合は、長さが長くなります",
				},
				loop: {
					_: "クリップがソースメディアの最後まで長くなると再生が開始されます",
					unset: "クリップの元のループ設定を変更なしまたは既定値に保持します。",
				},
				playbackRate: {
					_: "クリップの再生速度を変更します",
					based: "現在のレートを直接置き換えるのではなく、新しいレートを計算するためにクリップの現在のレートを掛けます。",
					sync: "{{stream, lowercase}} 再生速度設定をここに表示されているものに変更する",
					outSync: "ここから {{stream, lowercase}} の再生速度設定を非同期化を無効にする",
				},
				normalize: {
					_: "オーディオを標準化し、静かなオーディオに便利です",
					once: "最初の時間だけを正規化し、後続のすべてのクリップで最初の正規化の後にゲインを使用します。 これは高速であり、すべての同じクリップで一貫性のあるゲインを保証します。 しかし、長さを変更すると、他のクリップがゲインに不適切な場合があります。（推奨）",
					always: "クリップの長さがより適切なゲインを得られるように、毎回ノーマライズします。 しかし、それは遅く、すべての同じクリップに一貫性のないゲインをもたらす可能性があります。",
				},
				staticVisual: "クリップのインポイントでフレームをフリーズさせます",
				truncate: {
					_: "一部のノートが長すぎる場合、トリミング時間を超えてパートを誤って再生しないようにクリップのアウトポイントでフリーズしようとします。",
					lengthenable: "ノートがクリップよりも長い場合の長さを設定します",
					freezeEndFrames: "ノートがクリップより長い場合、フレームをクリップのアウトポイントからフリーズします。",
					trimEndFrames: "ノートがクリップよりも長い場合は、クリップのアウトポイントの後にフレームをトリムします",
					splitThenFreeze: "ノートがクリップより長い場合、クリップのアウトポイントから分割され、後者のポイントがフリーズします",
					freezeToGray: "ノートがクリップより長い場合は、クリップのアウトポイントから分割されます。 後者をポイントで凍らせ、次に黒と白のエフェクトを適用する",
					freezeToPreset: "ノートがクリップより長い場合は、クリップのアウトポイントから分割されます。 次に、後者のポイントを凍結し、次にカスタムプリセットを適用します。",
				},
				legato: "ノート間のギャップを埋めます",
				truncateAndLegatoConflictInAudio: "トランケートとレガートがオーディオで競合しています。同時に有効にすることはできません！",
				multitrackForChords: "コード用に複数のトラックを作成",
				createGroups: "ビデオクリップとオーディオクリップのグループを1つのノートで表します。",
				autoPan: "エンベロープオートメーションを使用してオーディオをパンする",
				stack: "楽譜に応じて結果を別々のトラックに配置するのではなく、1つのトラックで可能な限り緊密にクリップをスタックします。",
				persistentTimeflow: "ノートオンが発生したとき、クリップはポイントインポイント時間をリセットしません。 効果をソースに適用するだけでも役に立ちます",
				resampleImitatively: {
					_: "Visualのリサンプリング動作を模倣し、ピッチが大きくなるとストレッチが曲がるようになります。",
					auto: "これは、ビジュアルがオーディオと同期していることを確認するために、Audioでリサンプリングが有効になっているかどうかによって異なります。",
				},
				transformMethod: "変換キーフレームを適用するためのターゲットプロパティの優先順位を指定します",
				playingTechniques: {
					glissando: {
						_: "ピッチベンド、スライド、またはglissandiを再生するときにエフェクトを生成します。",
						swirlAmount: "旋回ツイスト振幅の大きさを指定します",
					},
					appoggiatura: {
						_: "appoggiaturasを再生するときに効果を生成します。\n連続して1〜2個の音符がある場合、それらはappoggiaturasとみなされます。",
					},
					arpeggio: {
						_: "\n連続して3つ以上の音符または短い音符がある場合、彼らはアルペジオとみなされます。",
						negative: "通常、アルペジオを表すために負の値を使用します",
					},
				},
				tuning: {
					tuningMethod: {
						_: "異なるチューニングアルゴリズムを使用します",
						noTuning: "ピッチエフェクトなし",
						pitchShift: "ピッチシフトオーディオエフェクトプラグインを使用します。 これは、Classic メソッドと同じアルゴリズムを持つDirectXプラグインであり、より広い範囲のピッチをサポートできます。 拡張機能は、使用前にプリセットをロードする必要があります。",
						elastic: "エラスティックピッチ変更法を使用します。Élastique メソッドは、z平面からの技術を使用します。 エバロピメント、および強化されたリアルタイムタイムストレッチおよびピッチシフト機能を提供します。+/− キーを直接押すデフォルトの方法です。",
						classic: "クラシックピッチ変更メソッドを使用します。 Vegas Pro 8 以下のバージョンの古いテクノロジーを使用しており、ソースに応じてより多くのクロスフェードタイプを選択できます。",
						scaleless: "ストレッチとピッチをロックし、ストレッチを変更して、実際のノートピッチに関係なく対応するピッチを取得します。",
						unset: "チューニングなしであっても、クリップのオリジナルのチューニング方法をそのまままたはデフォルト値に保持します。",
						acid: "ACIDized loops を使用している場合は、ACID Pro で設定されたチューニング方法を優先します。",
						evaluates: {
							fast: "高速で生成する",
							changeRate: "再生速度の変更に有効です",
							exceedTheRange: "作業範囲を超えることができます。",
						},
					},
					stretchAttributes: "選択したチューニング方法の詳細な構成",
					alternativeForExceedTheRange: {
						_: "別の方法で範囲外のメモを処理",
						plugin: "ピッチシフトオーディオエフェクトプラグインを繰り返し使用して任意のピッチに到達します。",
						octave: "オクターブ音量を {{formulaFor24}}の範囲まで上げたり下げたりすることによって、少なくとも不協和音の間隔を避けてください。",
						octaveExp: "VEGASは実際には、さまざまな {{formulaFor39}} を内部でサポートしています。VEGASがクラッシュする可能性があるため、注意して使用してください。",
						wrap: "{{formulaFor24}} の範囲内の最も高いキーまたは最も低いキーに戻ります。",
						silent: "これらのメモをミュート",
					},
					resample: "同期でピッチを変更するようにストレッチを調整し、ピッチが大きくなるとストレッチが曲がるようになり、クラシックなテープレコーダースタイルを提示します",
					preserveFormant: "チューニング中は音声音の特性を維持します",
					basePitch: {
						_: "オーディオクリップのベースピッチを指定します",
						cent: "ピッチを微調整",
						based: "オーディオプロパティまたはエフェクトプラグインでピッチを変更した場合、それらをリセットするのではなく、それらの値に基づいて調整を続行します。",
					},
					prelisten: {
						_: "クリップとベースピッチを比較し、簡単に調整できます",
						adjustAudioToBasePitch: "クリップのオーディオを逆の方法ではなくベースピッチに合わせて、古いスタイルのリミックスに便利です。",
					},
				},
				effects: {
					prve: "ビジュアルのリズムを上げます。",
					staff: "カスタムパターンをメモとして使用し、ピアノ譜面と同様のビジュアルを描きます。",
					pixelScaling: "最も近い近傍のハードエッジ増幅と補間アルゴリズムを使用してスケーリングします",
				},
				mapping: {
					_: "指定されたアイテムにノートのプロパティをマップ",
				},
				preset: {
					_: "便宜のためにあらかじめ定義されたパラメータスキームを使用または保存します",
				},
			},
			track: {
				_: "YTPMVの創作において、レイアウトと構図設計は視覚論理の核心部分である。その主な目標は、動的な構図を通じて多源と音楽のリズムを深く融合させることで、混乱や衝撃をもたらすだけでなく、視覚効果の可読性を維持することです。YTPMVのために良い視覚レイアウトを作る方法を知っておくと、想像以上に面白くなります。\n視覚の中核として、メロディーサンプルに対応するソースは、存在感を高めるために、拡大、カバー、または高コントラストの色を与える必要があります。次に、動的階層管理を使用して、主要要素と副次的要素を区別します。例えば、背景ソースは、主導的にならないように透明度を下げることができます。非線形配置を試み、従来のメッシュレイアウトを打破し、ランダムスタック、変位オーバーラップ、またはその他の技術を使用して「情報オーバーロード」の視覚張力を模倣することができます。いくつかの要素を繰り返すことで隠れた順序を確立し、局所的な突然変異を加えることで驚きを作り出す。たとえば、アバタを視覚アンカーとして繰り返しますが、表示されるたびに異なる効果が重畳されます。\nYTPMVのレイアウトと構図設計は本質的に「制御されたカオス」であり、比較と整列などの基本設計原則を通じてコンテンツ内部構造を付与する。この設計には技術が必要であるだけでなく、創作においても文化美学の直観的把握に依存し、最終的には「秩序無秩序」という独特の体験を実現した。",
				grid: {
					square: "トラック数に応じて、2×2、3×3などの標準グリッドレイアウトを作成します。",
					custom: "グリッドレイアウトの列と行をカスタマイズします。行は列に自動的に適応し、その逆も同様です。",
					fit: {
						_: "トラックボックス内にフィットしながら、アスペクト比を維持するようにクリップのサイズを変更します",
						cover: "レールボックス全体を埋めるために両側をトリミングすると隙間がなくなりますが、視野から両側が消えます\n（別名ビデオフレームの「画面移動とスキャン」およびWindows背景設定の「塗りつぶし」）",
						contain: "周囲に空白領域を追加してクリップ全体をトラックボックスに入れると、すべての内容が表示されますが、アスペクト比が大きく異なるとギャップが目立ちすぎます\n（ビデオフレームの「ポスト」または「ポストボックス」、Windowsの背景設定の「適合」とも呼ばれる）",
					},
					mirrorEdges: {
						hFlip: "パリティパターンの列を反転させてトラックをミラーする",
						vFlip: "パリティパターンの行を反転させてトラックをミラーする",
					},
					padding: "トラック ボックスの内側の余白を他のボックスとあまり混雑しないように調整します。",
				},
				box3d: {
					deleteTracks: "技術的な制限により、選択したトラックは直接移動できません。 現在、新しいトラックを作成し、クリップを自動的に移行できますが、トラックの動き、エフェクト、その他は変更できません。 後で自分で移行する必要があります。元のトラックを削除するかどうかを決めることができます。新しく追加されたトラックは影響を受けません。",
					useLongerSide: "ソースが長方形の場合、キューブのエッジ長さとして、短辺の代わりに長い辺を使用します。 立方体をより自然なものにするのです",
				},
				gradient: "レイアウトにグラデーションカラー効果を与えます。",
				legato: {
					_: "トラッククリップ間のギャップを埋めます",
					increaseSpacing: "クリップごとの間隔を分割",
					forClips: "トラック全体ではなく、選択したクリップにレガートを適用します。",
					includeGroup: "グループ化クリップにも適用されます",
					backwards: "レガートを後方に適用する",
				},
				deactivate: "このレイアウトの状態をリセットして無効にします",
				view: "結果に影響を与えずにプレビューのみを変更します",
				descending: "トラックが適用される順序を反転します。",
			},
			sonar: {
				_: "Sonar (Motion Graphics generation feature) は、「Cookie Cutter」エフェクトを使用して、音楽のリズムに基づいてモグラフを自動的に生成するツールです。 さまざまな打楽器のトリガー信号は、スコア(特にチャンネル10のデータ)を介してプリセットのグラフィック要素にリンクされます。 ドラムキットがある場所)。 これらのグラフィックはリズムによって変化し、リズム駆動の「視覚的なビート」エフェクトを作成します。 例えば、キックは拡大した正方形を生成し、スネアは回転するダイヤモンドを駆動します。 クラッシュは拡散円を引き起こし、「音の視覚化」の没入型体験を形成します。\nモーショングラフィックス(Mograph)は、グラフィックの動きを通して情報や感情を伝えるためのグラフィックデザインとアニメーションを組み合わせたアートフォームです。 テキストやその他の要素です Omadの作成では、モグラフは多くの場合、従来のソース編集に置き換えて使用されます。 抽象的なグラフィックは純粋に視覚的なリズム表現に使われます たとえば、音楽のクライマックスの間に、ビジュアルは密な幾何学的形状で満たされることがあります。 ゆっくりと体を変形させることによって呼吸の感覚が作られている間 そのような作品は、しばしば*グラフィックス*または*シェイプ*と題し、「視覚で音楽を演奏する」というコアコンセプトを強調しています。",
				enabled: "スコアのアクティブトラックにドラムキットが含まれている場合、ソナー効果を有効にする",
				separateDrums: "各ドラムをそれぞれのトラックに置きます",
				differenceCompositeMode: "差分ブレンドで作成された曲を作成します。影絵の様式を表示します",
				shadow: "グラフに影を追加します",
			},
			lyrics: {
				_: "楽譜に歌詞データ（歌声合成ソフトウェア プロジェクト ファイルなど）が含まれている場合は、自動的に動的な字幕を生成して、オーディオとビジュアルの同期による没入感を実現できます。この機能には、次のサブモードが含まれます。\nカラオケ モードでは、単語ごとに同期された動的な字幕を生成できます。歌詞は色付きの進行状況バーとして表示されます。現在歌われている単語はリアルタイムで強調表示されます（たとえば、白から蛍光色に変わります）。歌われていない部分は、各音節の長さだけ基本色を維持します。\nピッチ表記モードでは、楽譜に歌詞が含まれていない場合、音高をリアルタイムで演奏に合わせてジャンプする字幕に変換できます。このモードは、複数の表記システムをサポートしています。",
				presetTemplate: "歌詞のテンプレートとして使用するタイトルとテキストメディアジェネレーターを選択してください",
				karaoke: {
					_: "カラオケスタイルの字幕を使用します。色指標は現在のフレーズの進行状況を反映します",
					futureFill: "歌われていない歌詞の文字色を指定します。",
					pastFill: "歌われている歌詞の文字色を指定します。",
				},
				pitchNotation: {
					_: "現在のノートのピッチをテキストとして視覚化します",
					system: "楽譜を表現するための別のシステムからお好みのものを選択してください",
				},
			},
			shupelunker: {
				_: "Shupelunker Tacticsは、伝統的なチューニングロジックを覆すYTPMV/Omad作成技術の一種です。 コアは、オーディオソースのベースピッチを直接使用して、正確な編集を通じて音楽のメロディーと調和を達成することです。 作成時 ターゲットスケールに完全に一致するソースからピースを選択し、LaunchPadと同様のパフォーマンス効果を形成するためにメロディック順に配置する必要があります。 全体のプロセスはピッチがないので、音源のベースピッチは音楽のメロディーと非常に一致している必要があります。 より幅広いソースライブラリが必要になります 断片的な編集と高速な切り替えにより、ソースのベースピッチの実際のテクスチャを保持するだけではないことが特徴である。 歌唱のように疾走する感覚も生み出すコンパクトなリズムと豊かな音階の変化を伴う曲に特に適しています\n対照的に、ソースクリップのピッチがメロディと一致しない場合、「タルタルタクティクス」が生成されます。 また、ピッチなしであり、ポートトのクリップの関節化など、極端なリズムコントロールによって同期を実現します。 クリップを伸ばしたり反転させたり、元の曲に合わせてソースのリズムを強制的に調整します。 ドラム'n'ベースのブレイクビートロジックに触発され、高周波断片化された編集を通じて視覚的なインパクトのような機械的な衝動を生み出します。 制作の内容は「無意味な呪文」ですが、リズムの正確な配置によって独特のリズム感を生み出すことができます。",
				affix: "クリップのベースピッチを名前を付けることで検出する必要があります。 ピッチ情報をクリップ名のプレフィックスまたはサフィックスにするかを指定してください",
				unallocated: {
					_: "ソースがすべてのキーをカバーしていない場合、空き領域を埋める方法を指定します",
					octaves: "最も近い高オクターブまたは下のオクターブクリップで埋め込まれます。これは最も優先度が高く、歌われたソルフェ<unk> ges を持つソースに便利です。",
					fillUp: "欠けているより高いキーを下の隣人で埋めます。 ただし、最も低いキーは最も近い上位の隣人から入力されます。これは「塗りつぶし」よりも優先度が高いです",
					fillDown: "欠けている下のキーをより高い隣人で塗りつぶしますが、最も高いキーは最も近い下の隣人から塗りつぶされます",
					default: "すべての残りの空きをカバーするために、任意のアフィックスのない最初のクリップを使用します。これは最も優先度が低いです",
				},
				exclusiveTrack: "ソースの各クリップが同じ位置にあることを確認します。 でもクリップが多すぎると",
				offset: "キーに対応するクリップを全体としてオフセットします",
			},
			ytp: {
				_: "YouTube Poop(YTP)は、構築、コラージュ、荒唐無稽主義を中心としたビデオを作成するためにさまざまな効果を使用しています。YTPはマルチソースをサポートしています。\nYTPはデジタル時代の新ダダ主義芸術の実践である。編集、繰り返し、変速、反転などの技術を通じて、素材を論理的ではない「ビデオミックス」に再組み合わせ、低品質、低技術の美的スタイルを意図的に模倣し、主流のビデオ文化の厳粛性と規範性をからかっている。例えば、キャラクタの動作がループ再生されたり、破砕された意味を持つ線が重畳されたり、突然のサウンド効果が挿入されたりして、でたらめでユーモアのある視聴効果を作り出したりします。\nYTPは伝統的な叙事論理に反抗し、視聴者の「意味」に対する固有の知覚に挑戦した。デジタル編集技術を通じて主流メディアのコンテンツを構築し、文化的記号を無意味な「電子ゴミ」に変換する。彼らの作品は往々にして「混沌は美学である」という原則に従い、荒唐無稽な断片の無停止循環や歪んだキャラクター対話のように、独特のポストモダンアート言語を形成している。YTPの創作の敷居は低いが、その芸術的価値はメディアの本質を反省することにある。デジタルメディアの技術的欠陥による脆弱性を際立たせる。YTPはネットミームであるが、実際には継続的なデジタル芸術実験であり、娯楽と批判の境界を再定義している。",
				constrain: "生成するクリップの長さを制御します",
				clips: "生成するクリップの数を設定します",
				effects: "YTP の効果を指定します。",
			},
			mosh: {
				normal: "データモッシュは素材に損傷を与えてグリッチ効果を作成する技術です。",
				glitchy: "繝ﾃﾞ繧ｰﾀ縺ﾓ薙ｯ橸｢ｼ縲ｭ･ﾚよ素木オﾚﾆ才員傷を与ぇτ勹″⺉⺍于交力果をイ乍成すゑ才支ㄔ朮テτ″す。",
				additional: "Datamosh は、視覚的な歪み、色の歪み、ピクセルの誤配置、およびその他の視覚効果を作成します。同様に、電子デバイスが突然失敗したときにぼやけた画面の状態。 従来のフィルタやエフェクトとは異なり、Datamosh はビデオの基本的なコーディング構造を直接変更します。 意図的にビデオのフレームシーケンスを破壊したり、異なるクリップからのデータストリームを混在させたりなどです 再生中にビジュアルを非論理的な動的スプライスとして表示させることで、信号干渉に似た「デジタル引き裂け感覚」を形成します。 例えば、キャラクターのアクションは突然重複する残骸に分割されます。\nDatamosh の動作原理には技術的な詳細が含まれていますが、その審美的な核心は非常に直感的であり、「エラー」を様式化された視覚言語に変換します。 アナログテレビからの信号が悪いときに表示されるノイズスクリーンのように。 Datamoshのエラー効果は、もはや修復されるべき問題ではなく、積極的に追求されるデジタル美的シンボルです。 この技術は、サイバーパンク、レトロな技術を表示する必要があるシーンを作成するのに特に適しています。 抽象的なナレーションを観客に見せることで壊れたデータの破綻から 代替的な芸術的緊張を感じさせることができます",
				datamosh: "ビデオをDatamoshes, 好ましくは、タイムライン上で動くビジュアルの多いです",
				datamix: "あるクリップの動きを別のクリップのビジュアルに適用します。",
				layer: "ビデオクリップを繰り返しコピーすることで多層化します",
				render: "非常に複雑なビデオ編集を含むタイムラインの一部をプリレンダリングし、1つのビデオクリップに置き換えます。",
				scramble: "クリップを破片の山に入れてシャッフルします",
				automator: "ビデオクリップに追加したエフェクトごとに、ランダムなキーフレームを各フレームに自動的に追加します",
				stutter: "クリップを転送し、ランダムに反転させることでクリップを切り離します",
				shake: "パン/切り取りを使用してクリップを振ったり揺らしたりできます",
				notInstalled: "Datamosh Extension Pack はインストールされておらず、ダウンロードされるまで、完全な機能は利用できません。",
			},
			tools: {
				_: "これらのQoL機能により、YTPMVsを作成したり、セットアップしたりするのに少し苦痛を与えることができます。 以前のパラメータに調整する必要はありません。",
				flow: "ベジーの曲線を使用して素晴らしいアニメーションを作成します",
				selectorAndReplacer: "指定された条件に一致するすべてのクリップを検索して選択し、指定された新しいクリップに置き換えることができます。",
				normalizer: "選択したすべてのオーディオクリップの音量を標準化します。",
				subtitles: "タイトルとテキストのプリセットをプリセットし、ここに複数行のテキストを追加します。",
				effector: "選択したクリップにエフェクトを適用します",
				fader: "指定したルールを使用して、選択したクリップのゲイン（音量/不透明度）を調整します。",
				exportScore: "選択したトラック内のクリップをスコアシーケンスファイルにエクスポートします",
				converters: {
					tuningMethod: "選択したオーディオクリップのチューニングアルゴリズムを変更します",
					transformMethod: "選択したビデオクリップに適用される変換されたキーフレームのターゲットプロパティを変更します",
					clawer: "音楽のビートや拍子を変更して、面白い新しいリズムを作ります。",
				},
			},
			staff: {
				_: "Staff Visualizer は音楽シンボルを創造的なビジュアルグラフィックスに変換する視覚効果です。コアでは、従来のノートをカスタムパターンに置き換えます(例えば。 アバター幾何学図形など 音楽のメロディーに基づいてスタッフのピッチに向けます 芸術性と機能性の両方でダイナミックな視覚を形成しています この視覚効果のスタイルは、デジタルアートと音楽の組み合わせ、YouTuber Grant Woolardの作品にインスパイアされています。 彼のビデオは、ミュージシャンのアバターをノートに変換し、スタッフにダイナミックにアレンジし、クラシック音楽を演奏するのが特徴です。 それはスコアのピッチロジックを保持するだけでなく、個別の視覚的な物語を提供します。\nこの効果は、芸術的な創造とパフォーマンスのビジュアルデザインに使用できます。 アーティストのパフォーマンスをダイナミックなスタッフアートプロジェクションに変換したり、デジタルアルバムカバーのインタラクティブな音楽アニメーションを作成したりするなど。 その革新は、従来の楽譜の静的限界を破ることにあります。 音楽構造を視覚言語で再解釈し、抽象的なメロディーを知覚可能な「ビジュアルメロディー」に変換する。",
			},
			prve: {
				control: {
					general: "YTPMVまたはSentence Mixingモードでは、連続したイベントやピッチの連続したイベント、同じ音節の通常の条件をコントロールします。\n他の別個のコントロールがオフの場合、ケースにも含まれます。",
					samePitch: "YTPMVまたはSentence Mixingモードでは、同じピッチの連続イベントのコントロールを分離します。",
					differentSyllables: "文混合モードでは、異なる音節の連続したイベントのコントロールを分離します。",
				},
				forceStretch: "使用中の$t(titles.prve, { 'count': {{count}} })にはタイムクラスの効果が含まれています。これにより、これらの効果の下でストレッチが設定制御されずに「$t(stream.stretch.flexingAndExtending, nowrapPerWord)」に強制的に設定されます。",
			},
			pixelScaling: {
				_: "ピクセルスケーリング機能は、シャープなエッジを必要とするピクセルアートや画像のために設計された可逆スケーリング技術です。その目的は、隣接するピクセルの色を混合してグラデーションを作成し、ピクセルアートの明瞭な境界を破壊するVEGAS内蔵の双線形補間スケーリングアルゴリズムによるピクセルのぼやけ問題を解決することである。この特徴は最隣接補間アルゴリズムによってスケーリングされ、最も近いピクセルの色値を直接コピーし、スケーリング後の画像エッジがぼやけないように「ハードカット」効果を維持することを確保する。\nこの機能は特に、レトロなゲームリソース、低解像度UI、またはピクセルスタイルを強化する必要があるシーンに適しています。たとえば、8ビットのゲームキャラクタアニメーションをスケーリングする場合、スムージングすることでキャラクタの輪郭が「ソフト化」されるのを防ぎ、各ピクセルブロックがスケーリング後も読みやすいようにすることができます。コア処理機能を有効にするには、FFmpeg環境を事前に構成するか、Datamosh拡張パッケージをインストールする必要があることに注意してください。\nプロジェクトの解像度に基づいて、この機能は最近傍補間アルゴリズムを使用して適切なサイズの新しいファイルを生成し、ファイル名は接尾辞「_ Scaled」で識別されます。このプロシージャは、画像/ビデオフォーマット、およびVEGASをインポートする画像シーケンスファイルをサポートします。",
			},
			settings: {
				about: "音MADヘルパー、VEGAS Pro用の音MADエクステンションVEGASがMIDIシーケンスファイルのようなスコアを入力として受け入れ、音MADトラックを自動的に生成できるように設計されています。",
				translation: "翻訳に参加したい場合は、ぜひ参加してください。",
				appearance: {
					colorScheme: {
						black: "AMOLED ダークのみ",
						systemContrast: "システムのハイコントラストテーマが有効になっており、現時点ではカラースキームを変更できません。",
					},
					transparency: {
						reducedTransparency: "透過効果はシステムによって無効になっており、現時点ではこのオプションは有効になっていない場合があります。",
						systemContrast: "システムのハイコントラストテーマが有効になっており、このオプションは現時点では有効になっていない可能性があります。",
					},
				},
				preference: {
					autoSwitchSourceFrom: "最後に選択した内容に基づいてソースを自動的に変更します",
					autoCollapsePrveClasses: "クラスを展開するときに、他の拡張された $t(titles.prve) クラスを自動的に折りたたみます。",
				},
			},
		},
		empty: {
			disabled: {
				title: "{{name, capitalize}}は無効です",
				details: "{{name, lowercase}}の生成を有効にする",
			},
			ytpEnabled: {
				partial: {
					title: "YTPを有効にしました。他の関連パラメータは利用できません。",
					details: "他のパラメータを使用したり調整するには、YTP機能を無効にしてください",
				},
				fully: {
					title: "YTPが有効になっており、 {{feature, lowercase}} 機能を使用できません",
					details: "{{feature, lowercase}} 機能を使用するにはYTP機能を無効にしてください",
				},
				disableYtp: "YTPを無効にする",
				gotoYtp: "YTPに移動",
			},
		},
		menu: {
			delete: "削除(&D)",
		},
		preset: "プリセット",
	},
	csharp: {
		host: {
			toolTip: {
				importToHere: "インポート %1",
			},
		},
		contentDialog: {
			button: {
				ok: "&OK",
				cancel: "キャンセル",
				close: "閉じる",
				learnMore: "詳細(&L)",
			},
			expander: {
				expandDetails: "詳細を展開",
				collapseDetails: "詳細を隠す",
			},
			showError: {
				title: "エラー",
			},
		},
		wrongOpeningMethod: {
			script: {
				title: "拡張機能を外しました！",
				content: "音MADヘルパーの新バージョンは拡張機能です。旧バージョンとは異なり、スクリプトではありません。\n\nスクリプトメニューディレクトリの代わりにVEGASのApplication Extensionsディレクトリに拡張を移動してください。\n\n場所：",
			},
		},
		textBox: {
			menu: {
				clearAll: "すべてクリア",
			},
		},
		colorPicker: {
			title: "色を選択",
			eyeDropper: "スポイト",
			axis: {
				red: "赤",
				green: "緑",
				blue: "青",
				hue: "Hue",
				saturation: "彩度",
				lightness: "明るさ",
				brightness: "画面の明るさ",
				white: "白",
				black: "ブラック",
				cyan: "水色",
				magenta: "マゼンタ",
				yellow: "黄色",
				key: "キー / ブラック",
				luminance: "<unk>",
				aAxisInLab: "a-Axis (−緑 ↔️ +赤)",
				bAxisInLab: "b-Axis (−青↔️ +イエロー)",
				chroma: "クロマ",
				alpha: "アルファ/不透明度",
				hex: "16進法",
			},
			axisAbbrs: {
				red: "R",
				green: "G",
				blue: "B",
				hue: "H",
				saturation: "S",
				lightness: "L",
				brightness: "B",
				white: "W",
				black: "B",
				cyan: "C",
				magenta: "M",
				yellow: "Y",
				key: "K",
				luminance: "L",
				aAxisInLab: "a",
				bAxisInLab: "b",
				chroma: "C",
				alpha: "Α",
			},
		},
		flyout: {
			confirmDelete: {
				title: "削除？",
			},
		},
		keybindings: {
			commands: {
				useTrackEventAsSource: "トラックイベントをソースとして使用",
				useProjectMediaAsSource: "ソース としてプロジェクト メディアを使用",
				enableYtp: "YTP機能を有効にする",
				disableYtp: "YTP機能を無効にする",
				startGenerating: "生成を開始",
			},
		},
		descriptions: {
			colorPicker: {
				eyeDropper: "画面から色を選択",
			},
		},
	},
} as const satisfies LocaleIdentifiers;
