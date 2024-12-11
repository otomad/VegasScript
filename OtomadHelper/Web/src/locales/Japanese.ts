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
			prve: "映像リズム視覚効果",
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
			blindBox: {
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
		allFiles: "すべてのファイル",
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
		curve: "補間曲線",
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
			normalize: "正規化",
			staticVisual: "静的ビジュアル",
			unlengthen: {
				_: "Unlengthen",
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
			timeUnremapping: "時間のマッピングを解除",
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
				},
				stretchAttributes: {
					_: "ストレッチ属性",
				},
				alternativeForExceedsTheRange: {
					_: "範囲を超えた場合",
					multiple: "複数のオーディオエフェクトプラグインを使用する",
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
						sine: "Sinusoid",
						triangle: "Triangle",
						square: "矩形波",
						sawtooth: "ノコギリ波",
					},
					duration: "期間",
					volume: "音量",
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
				stackingAllAfter: "クリップ\nをすべての後にスタックする",
				limitStretch: "ストレッチ制限内のクリップ\n",
				stretch: "ストレッチ制限を超えたときにクリップ\n長さを伸ばします",
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
				_: "Karaoke",
				futureFill: "テキストの塗りつぶし色を再生する",
				pastFill: "再生中のテキストの塗りつぶし色",
			},
			pitchNotation: {
				_: "ピッチ表記法",
				type: "ピッチ表記タイプ",
				scientific: "科学的ピッチ表記法",
				helmholtz: "ヘルムホルツピッチ表示",
				solfeggio: "Solfeggio Syllable",
				numbered: "番号付けされた楽譜の表示",
				gongche: "Gongche表記法",
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
				lowerNeighbors: "下の隣人",
				higherNeighbors: "より高い隣人へ",
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
			render: "レンダリング",
			scramble: "スクランブル",
			automator: "Automator",
			stutter: "Stutter",
			shake: "シェイクする",
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
				colorScheme: {
					_: "配色設定",
					light: "ライト",
					dark: "ダーク",
					auto: "自動",
				},
				uiScale: "UIスケール",
				backgroundImage: {
					_: "背景画像",
					opacity: "透明度",
					tint: "Tint",
					blur: "ぼやけ",
				},
			},
			preference: {
				_: "設定",
				autoSwitchSourceFrom: "ソースの自動切り替え",
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
				blindBox: {
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
					blindBoxEnabled: "ブラインドボックス機能が有効になっており、この機能は現在利用できません。",
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
				stretch: "クリップの長さを変更する代わりに、クリップを伸ばします。",
				loop: "クリップがソースメディアの最後まで長くなると再生が開始されます",
				playbackRate: {
					_: "クリップの再生速度を変更します",
					based: "現在のレートを直接置き換えるのではなく、新しいレートを計算するためにクリップの現在のレートを掛けます。",
					sync: "{{stream, lowercase}} 再生速度設定をここに表示されているものに変更する",
					outSync: "ここから {{stream, lowercase}} の再生速度設定を非同期化を無効にする",
				},
				normalize: "オーディオを標準化し、静かなオーディオに便利です",
				staticVisual: "クリップの先頭にあるフレームをフリーズします。",
				unlengthen: "一部のノートが長すぎる場合、トリミング時間を超えてパートを誤って再生しないようにクリップのアウトポイントでフリーズしようとします。",
				legato: "ノート間のギャップを埋めます",
				unlengthenAndLegatoConflictInAudio: "オーディオで長くなったりレガートが競合しているため、同時に有効にすることはできません！",
				multitrackForChords: "コード用に複数のトラックを作成",
				createGroups: "ビデオクリップとオーディオクリップのグループを1つのノートで表します。",
				autoPan: "エンベロープオートメーションを使用してオーディオをパンする",
				stack: "楽譜に応じて結果を別々のトラックに配置するのではなく、1つのトラックで可能な限り緊密にクリップをスタックします。",
				timeUnremapping: "ノートが発生した場合、クリップはポイント時間をリセットしません。 再生を続けますソースにエフェクトを適用する場合に便利です",
				resampleImitatively: {
					_: "Visualでリサンプリング動作を模倣し、ピッチが大きくなるとストレッチが屈曲します",
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
						noTuning: "ピッチエフェクトなし",
						pitchShift: "ピッチオーディオエフェクトプラグインを使用します。再生速度の変化では遅く、効果はありませんが、範囲を超えることができます。",
						elastic: "Elastic Pitch Changeメソッドを使用します。ただ、+/−キーを直接押すデフォルトのメソッドです。動作範囲を超えることはできません。",
						classic: "範囲を超えることはできませんが、VEGAS Pro 8で利用可能な唯一の方法であるClassic Pitch Change Methodを使用します",
						scaleless: "ストレッチとピッチをロックし、ストレッチを変更して、実際のノートピッチに関係なく対応するピッチを取得します。",
					},
					stretchAttributes: "選択したチューニング方法の詳細設定",
					alternativeForExceedsTheRange: {
						_: "別の方法で範囲外のメモを処理",
						plugin: "ピッチシフトオーディオエフェクトプラグインを繰り返し使用して任意のピッチに到達します。",
						octave: "オクターブ音量を {{formulaFor24}}の範囲まで上げたり下げたりすることによって、少なくとも不協和音の間隔を避けてください。",
						octaveExp: "VEGASは実際には、さまざまな {{formulaFor39}} を内部でサポートしています。VEGASがクラッシュする可能性があるため、注意して使用してください。",
						wrap: "{{formulaFor24}} の範囲内の最も高いキーまたは最も低いキーに戻ります。",
						silent: "これらのメモをミュート",
					},
					resample: "ストレッチとピッチをロックし、ストレッチを調整してピッチを変更します",
					preserveFormant: "チューニング中は音声音の特性を維持します",
					basePitch: {
						_: "オーディオクリップのベースピッチを指定します",
						cent: "ピッチを微調整",
						based: "手動でピッチ値を設定する",
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
				_: "レイアウトは、YTPMVのビジュアル制作プロセスにおけるコアポイントの一つです。 コンポジションについて学ぶ YTPMVのために良い視覚的なレイアウトを作る方法を知ることは、あなたが期待するよりもはるかに楽しいものになります。\n基本的に、ビジュアルでメロディのサンプルが最も顕著なものであることを確認してください。",
				grid: {
					square: "トラック数に応じて、2×2、3×3などの標準グリッドレイアウトを作成します。",
					custom: "グリッドレイアウトの列と行をカスタマイズします。行は列に自動的に適応し、その逆も同様です。",
					fit: {
						_: "トラックボックス内にフィットしながら、アスペクト比を維持するようにクリップのサイズを変更します",
					},
					mirrorEdges: {
						hFlip: "パリティパターンの列を反転させてトラックをミラーする",
						vFlip: "パリティパターンの行を反転させてトラックをミラーする",
					},
					padding: "トラック ボックスの内側の余白を他のボックスとあまり混雑しないように調整します。",
				},
				box3d: {
					deleteTracks: "技術的な制限により、選択したトラックは直接移動できません。 新しいトラックを作成してクリップを移行できますが、トラックの動きやエフェクトなどはできません。 元のトラックを削除するかどうかを決めることができます。\n新しく追加されたトラックは影響を受けません。",
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
				_: "ソナーは、クッキーカッターの形を利用してビートスタイルのモーショングラフィックスを作成する視覚効果です。この機能を使用すると、スコア内のドラムキット（チャンネル10）のさまざまなパーカッションインストゥルメントに異なるシェイプやエフェクトをディスパッチできます。\n音MADの一般的なジャンルは、さまざまな形状を加えてモーショングラフィックス(MG)を作成することです。拡散した円やビートに基づいて視覚化することができますモーショングラフィックスは、グラフィックデザインとアニメーションデザインの間の製品です時間の流れに基づいた視覚的表現とビデオアートの一種ですモーショングラフィックスという用語は、時間の流れによって変形するグラフィックスを指します。モーグラフのみを含む単一の音MADビデオは、しばしば「グラフ」または「形」と題されます。",
				enabled: "スコアのアクティブトラックにドラムキットが含まれている場合、ソナー効果を有効にする",
				separateDrums: "各ドラムをそれぞれのトラックに置きます",
				differenceCompositeMode: "差分ブレンドで作成された曲を作成します。影絵の様式を表示します",
				shadow: "グラフに影を追加します",
			},
			lyrics: {
				_: "シーケンステキストなど、スコアに歌詞が含まれている場合、歌詞の字幕は自動的に生成されます。\n楽譜に歌詞がない場合でもピッチ表記を生成することができます。",
				presetTemplate: "歌詞のテンプレートとして使用するタイトルとテキストメディアジェネレーターを選択してください",
				karaoke: {
					_: "カラオケスタイルの字幕を使用します。色指標は現在のフレーズの進行状況を反映します",
					futureFill: "歌われていない歌詞の文字色を指定します。",
					pastFill: "歌われている歌詞の文字色を指定します。",
				},
				pitchNotation: {
					_: "現在のノートのピッチをテキストとして視覚化します",
					type: "世界には楽譜を表現する方法がいくつかあります。好きな楽譜を選んでください",
				},
			},
			shupelunker: {
				_: "シュペランカー戦法は非チューニング音MAD戦術です。メロディと同じピッチでソース（通常はボーカル）のクリップを使用してメロディを演奏するために使用されます。つまり音源クリップ自体がメロディに合うようにピッチされています\nクリップのピッチがメロディと一致しない場合、「韃靼戦法」が生成されます。調整されていないため、クリップがカットされている場所（通常はダイアログ）を選択できます。オーディオのストレッチと巻き戻しが頻繁に使用されるだけでなく、16〜64分の1の休憩ノートを追加します。制作中、クリップは歌う感覚のリズムに合わせられます。",
				affix: "クリップのベースピッチを名前を付けることで検出する必要があります。 ピッチ情報をクリップ名のプレフィックスまたはサフィックスにするかを指定してください",
				unallocated: {
					_: "ソースがすべてのキーをカバーしていない場合、空き領域を埋める方法を指定します",
					octaves: "最も近い高オクターブまたは低いオクターブのクリップを使用します。これは最も優先度が高く、歌われたsolfeggiosのソースに便利です。",
					lowerNeighbors: "低い隣人を使用しますが、最も低い鍵は最も近い隣人から満たされます。これは高い隣人よりも優先度が高いです",
					higherNeighbors: "高い隣人を使用しますが、最も高い鍵は最も近い下部の隣人から満たされます。",
					default: "すべての残りの空きをカバーするために、任意のアフィックスのない最初のクリップを使用します。これは最も優先度が低いです",
				},
				exclusiveTrack: "ソースの各クリップが同じ位置にあることを確認します。 でもクリップが多すぎると",
				offset: "キーに対応するクリップを全体としてオフセットします",
			},
			ytp: {
				_: "YouTubeのプープ(YTP)は、YTPジャンルで知られている様々な効果を使用して無意味なビデオを作成するために使用されます。\nYTPは、リミックス文化自体にコメントするために、リミックス文化の最も低い技術的、美的基準を模倣し、モック不条理なリミックスで構成されるネオダダのアートフォームです。 これは、視聴者を混乱させるために、さまざまなビデオクリップから編集されたビデオリミックスで構成されています。 ソースはすべて無意味なクロスオーバー物語にまとめたり、奇妙に身振りをするキャラクターの単純に繰り返された映像にマッシュアップすることができます。",
				constrain: "生成するクリップの長さを制御します",
				clips: "生成するクリップの数を設定します",
				effects: "YTP の効果を指定します。",
			},
			mosh: {
				normal: "データモッシュは素材に損傷を与えてグリッチ効果を作成する技術です。",
				glitchy: "繝ﾃﾞ繧ｰﾀ縺ﾓ薙ｯ橸｢ｼ縲ｭ･ﾚよ素木オﾚﾆ才員傷を与ぇτ勹″⺉⺍于交力果をイ乍成すゑ才支ㄔ朮テτ″す。",
				additional: "ビデオアートには、datamoshing と呼ばれるテクニックがあります。中間フレームが 2 つの別々のソースから補間されるように、2 つのビデオがインターリーブされています。 そして、別々のビデオコーデックがどのように動きと色情報を処理するかの違いを利用します。",
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
				_: "Staff Visualizer は、スコアのメロディーに基づいてピアノの譜面シートと同様のビジュアルを描くために、カスタムパターンをノートとして使用するように設計されています。\nYouTuber@grantwoolardの動画を真似たビジュアルエフェクトスタイル。 音楽家のアバターを使ってクラシック音楽のスタッフシートを描きました",
			},
			prve: {
				control: {
					general: "YTPMVまたはSentence Mixingモードでは、連続したイベントやピッチの連続したイベント、同じ音節の通常の条件をコントロールします。\n他の別個のコントロールがオフの場合、ケースにも含まれます。",
					samePitch: "YTPMVまたはSentence Mixingモードでは、同じピッチの連続イベントのコントロールを分離します。",
					differentSyllables: "文混合モードでは、異なる音節の連続したイベントのコントロールを分離します。",
				},
				forceStretch: "現在使用しているPVリズムビジュアルエフェクトにはタイムクラスエフェクトが含まれています。 これはストレッチを強制的に\"$t\"に設定します(ストリーム)。 \"tretch.flexingAndExtending\") これらのエフェクトで、設定によって制御されていない場合",
			},
			pixelScaling: {
				_: "ピクセルスケーリング機能は、VEGAS Pan/Crop による滑らかなグラデーションアルゴリズムを使用して、元のピクセル画像の再スケーリングによるピクセルの歪みの問題を回避するために、ソースのピクセル画像を拡大することができます。 使用するには、FFmpegをシステム環境変数に追加するか、Datamosh Extension Packを直接インストールすることができます。\nピクセルスケーリング機能は、現在のプロジェクトサイズに合わせて、最も近い近傍補間アルゴリズムを使用してソースファイルを拡大するためにFFmpegを使用します。 そしてVEGASのソースメディアファイルを新しく生成されたメディアファイルに置き換えます。 新しく生成されたファイルは、拡張子「_Scaled」をその名前に追加することで識別されます。 この機能は、従来の方法でVEGASにインポートされたイメージシーケンスファイルを含む、任意の画像/ビデオファイル形式をサポートしています。",
			},
			settings: {
				about: "音MADヘルパー、VEGAS Pro用の音MADエクステンションVEGASがMIDIシーケンスファイルのようなスコアを入力として受け入れ、音MADトラックを自動的に生成できるように設計されています。",
				translation: "翻訳に参加したい場合は、ぜひ参加してください。",
				preference: {
					autoSwitchSourceFrom: "最後に選択した内容に基づいてソースを自動的に変更します",
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
