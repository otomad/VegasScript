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
			settings: "設定",
			prve: "映像リズム視覚効果",
			staff: "五線譜視覚化",
			pixelScaling: "ピクセルスケーリング",
			track: "トラック",
			mosh: "モッシュ",
			customEffect: "カスタムエフェクト",
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
			preferredTrack: {
				_: "優先トラック",
				index: "トラックの優先インデックス",
				top: "最上部",
				ordinal: "{{count, ordinal}}トラックの下",
				belowAdjustmentTracks: "1つ以上の調整トラックがこのトラックの下にある場合は、次のトラックを選択してください。",
				newTrack: "新しいトラック",
			},
			afterCompletion: {
				_: "完了後",
				removeSourceClips: "ソーストラッククリップを削除",
				selectSourceClips: "ソーストラッククリップを選択",
				selectGeneratedAudioClips: "生成されたすべてのオーディオクリップを選択",
				selectGeneratedVideoClips: "生成されたすべてのビデオクリップを選択",
			},
			randomOffsetForTracks: "異なるトラックにランダムなオフセットを使用",
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
			effects: "効果",
		},
		units: {},
		score: {
			midi: "MIDI",
			midiFile: "MIDIシーケンスファイル",
			st: "シーケンステキスト",
			stFile: "サポートされているすべてのシーケンステキスト ファイル",
			ustFile: "UTAU/OpenUTAUシーケンス テキスト ファイル",
			vsqFile: "Vocaloidシーケンス ファイル",
			refOtherTracks: "他の曲を参照",
			tts: "テキストから発話する",
			pureNotes: "純粋なノート",
			encoding: "エンコード",
			bpm: {
				_: "BPM",
				variableMidi: "MIDIテンポを変更する",
				constantMidi: "定数MIDIテンポ",
				project: "プロジェクトのテンポ",
			},
			timeSignature: "拍子記号",
			constraint: {
				_: "音符の長さを拘束する",
				none: "拘束なし",
				max: "最大長さ",
				fixed: "固定長さ",
			},
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
			normalize: "正規化",
			staticVisual: "静的ビジュアル",
			noLengthening: {
				_: "延長しない",
				lengthenable: "Lengthenable",
				freezeEndFrames: "終了フレームを固定",
				trimEndFrames: "終了フレームをトリムする",
				splitThenFreeze: "分割して凍結する",
				freezeToGray: "グレーに固定",
				freezeToEffect: "フリーズして有効化",
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
			glissando: {
				_: "グリッサンド",
				amount: "数量",
			},
			autoPan: "オート パン",
			transformMethod: {
				_: "変換方法",
				panCrop: "パン/トリミング",
				transformOfx: "TransformOFX",
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
					multiple: "複数のオーディオエフェクトプラグインを使用",
					plugin: "オーディオエフェクトプラグインに切り替える",
					octave: "高オクターブまたは低オクターブです",
					dock: "端にドックする",
					silent: "サイレントモード",
				},
				resample: "リサンプ",
				preserveFormant: "フォルマントを保存する",
				basePitch: "ベース ピッチ",
				prelisten: {
					_: "プレ再生",
					engine: "エンジン",
					waveform: {
						_: "波形",
						sinusoid: "Sinusoid",
						triangle: "Triangle",
						square: "矩形波",
						sawtooth: "ノコギリ波",
					},
					duration: "期間",
					adjustAudioToBasePitch: "音声をベースピッチに調整",
				},
			},
			mapping: {
				_: "マッピング",
			},
			preset: {},
			parameters: {
				copyFromAnotherParameterScheme: "別のパラメータスキームからここにコピー",
			},
		},
		track: {
			layout: "レイアウト",
			grid: "グリッドレイアウト",
			box3d: "3D ボックスレイアウト",
			gradient: "グラデーショントラック",
			applyToSelectedTracks: "選択したトラックに適用",
			legato: {
				_: "Legato",
			},
			clear: {
				_: "クリア",
			},
		},
		sonar: {},
		ytp: {
			constraint: "拘束の長さ",
			clips: "クリップ",
			effects: "YTPエフェクト",
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
			source: "{{count}}のメディアソースが選択されました",
			track: "{{count}}トラックが選択されました",
			videoTrack: "{{count}}ビデオトラックが選択されました",
			audioTrack: "{{count}}オーディオトラックが選択されました",
			trackEvent: "{{count}}トラックイベントが選択されました",
			videoEvent: "{{count}}ビデオトラックイベントが選択されました",
			audioEvent: "{{count}}オーディオトラックイベントが選択されました",
		},
		prve: {
			classes: {
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
		},
		pixelScaling: {
			scaleFactor: "拡大率",
			replaceSourceMedia: "ソースメディアを置き換え",
		},
		settings: {
			about: {
				checkForUpdates: "アップデートを確認",
				repositoryLink: "リポジトリリンク",
				documentation: "ドキュメント",
				translation: "翻訳に貢献",
				feedback: "フィードバック",
				version: "バージョン",
				author: "作成者",
				__author__: "蘭音",
				originalAuthor: "オリジナルの著者",
				__originalAuthor__: "Chaosinism",
				translator: "翻訳",
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
			condition: "次の設定をいつ適用するかを指定します",
			source: {
				trim: "指定したソースの開始時刻または終了時刻を調整します。",
				startTime: "プロジェクトから生成を開始するタイミングを指定します",
				preferredTrack: {
					_: "生成する既存のトラックを指定できます(マルチトラックを除く)",
					belowAdjustmentTracks: {
						versionRequest: "注意: この機能はVEGAS Pro 19以上が必要です。現在のバージョンは {{version}}です。",
					},
				},
				randomOffsetForTracks: "オンにすると、ランダムに選択されたソースクリップが異なるベースピッチを持つ場合があります。 娯楽用の面白い動画の作成にのみ役立ちますし、高度な動画の作成にはほとんど使えませんでした",
			},
			score: {
				trim: "スコアの生成時間範囲をインターセプトします",
				bpm: "分あたりの拍数を指定します",
				constraint: "スコアからのノートの出力長さを制御します",
				encoding: "ファイルの読み込み時に使用するテキストエンコーディングを指定します",
			},
			stream: {
				stretch: "オンの場合、クリップの長さを変更せずにストレッチします",
				loop: "クリップがソースメディアの最後まで長くなると再生が開始されます",
				normalize: "オーディオを標準化し、静かなオーディオに便利です",
				staticVisual: "クリップの先頭にあるフレームをフリーズします。",
				noLengthening: "ノートより長い場合はクリップを処理します。",
				legato: "ノート間のギャップを埋めます",
				multitrackForChords: "コード用に複数のトラックを作成",
				createGroups: "ビデオクリップとオーディオクリップのグループを1つのノートで表します。",
				glissando: {
					_: "音符ピッチが曲がったときまたはスライドで旋回効果を作成します",
					amount: "旋回ツイスト振幅の大きさを指定します",
				},
				autoPan: "エンベロープオートメーションを使用してオーディオをパンする",
				transformMethod: "変換されたキーフレームのターゲットプロパティを指定します",
				tuning: {
					stretchAttributes: "選択したチューニング方法の詳細設定",
					alternativeForExceedsTheRange: "範囲外のノートを別の方法で処理",
					resample: "ストレッチとピッチをロックし、ストレッチを調整してピッチを変更します",
					preserveFormant: "チューニング中に音声音を維持します",
					basePitch: "オーディオクリップのベースピッチを指定します",
					prelisten: {
						_: "クリップとベースピッチを比較し、簡単に調整できます",
						adjustAudioToBasePitch: "クリップのオーディオを逆の方法ではなくベースピッチに合わせて、古いスタイルのリミックスに便利です。",
					},
				},
				effects: {
					prve: "ビジュアルのリズムを上げます。",
					staff: "カスタムパターンをメモとして使用し、ピアノ譜面と同様のビジュアルを描きます。",
					pixelScaling: "最も近い近傍のハードエッジ増幅と補間アルゴリズムを使用してスケーリングします",
					customEffect: "カスタムエフェクトプリセットをすべてのクリップとトラックに適用する",
				},
				mapping: {
					_: "指定されたアイテムにノートのプロパティをマップ",
				},
				preset: {},
			},
			track: {
				gradient: "レイアウトにグラデーションカラー効果を与えます。",
				legato: "トラッククリップ間のギャップを埋めます",
			},
			sonar: {
				_: "Sonarは、Cookieカッター形状を利用してビートスタイルのビジュアルモーショングラフィックスを作成する視覚効果です。 この機能を使用すると、スコア内のドラムキット (チャンネル 10) のさまざまなパーカッションインストゥルメントに異なるシェイプやエフェクトを割り当てることができます。\nOmadの一般的なジャンルは、さまざまな形状を加えてモーショングラフィックス(Mograph)を作成することです。 拡散円のようにビートに基づいて視覚化します Mograph は、グラフィックデザインとアニメーションデザインの間の製品です 時間の流れに基づいた視覚的表現とビデオアートのようなものです モーショングラフィックスという用語は、時間の流れによって変形するグラフィックスを指します。 モーグラフのみを含む単一のOtomadビデオは、「グラフ」または「形」と題されることがよくあります。",
			},
			shupelunker: {
				_: "Shupelunker戦術はピッチのないYTPMV/Omad戦術です。 それはメロディと同じピッチでソース(通常はボーカル)のクリップを使用してメロディを演奏するために使用されます。 をクリックします。ソースクリップ自体がメロディに合うようにピッチします。\nクリップのピッチがメロディと一致しない場合、「タルタルタクティクス」が生成されます。 また、クリップの切り取り位置(通常はダイアログで)を選択することもできます。 多くの場合、オーディオのストレッチと巻き戻しを使用し、16〜64分の1の休憩を追加します。 制作中、クリップはボーカルセンスのリズムに合わせられます。",
			},
			ytp: {
				_: "YouTubeのプープ(YTP)は、YTPジャンルで知られている様々な効果を使用して無意味なビデオを作成するために使用されます。\nYTPは、リミックス文化自体にコメントするために、リミックス文化の最も低い技術的、美的基準を模倣し、モック不条理なリミックスで構成されるネオダダのアートフォームです。 これは、視聴者を混乱させるために、さまざまなビデオクリップから編集されたビデオリミックスで構成されています。 ソースはすべて無意味なクロスオーバー物語にまとめたり、奇妙に身振りをするキャラクターの単純に繰り返された映像にマッシュアップすることができます。",
				constraint: "生成するクリップの長さを制御します",
				clips: "生成するクリップの数を設定します",
				effects: "YTP の効果を指定します。",
			},
			mosh: {
				normal: "データモッシュは素材に損傷を与えてグリッチ効果を作成する技術です。",
				glitchy: "繝ﾃﾞ繧ｰﾀ縺ﾓ薙ｯ橸｢ｼ縲ｭ･ﾚよ素木オﾚﾆ才員傷を与ぇτ勹″⺉⺍于交力果をイ乍成すゑ才支彳朮テτ″す。",
				additional: "ビデオアートには、datamoshing と呼ばれるテクニックがあります。中間フレームが 2 つの別々のソースから補間されるように、2 つのビデオがインターリーブされています。 そして、別々のビデオコーデックがどのように動きと色情報を処理するかの違いを利用します。",
				datamosh: "ビデオをDatamoshes, 好ましくは、タイムライン上で動くビジュアルの多いです",
				datamix: "あるクリップの動きを別のクリップのビジュアルに適用します。",
				layer: "ビデオクリップを繰り返しコピーすることで多層化します",
				render: "非常に複雑なビデオ編集を含むタイムラインの一部をプリレンダリングし、1つのビデオクリップに置き換えます。",
				scramble: "クリップを多くのクリップフラグメントに分割し、それらをシャッフルします",
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
			pixelScaling: {
				_: "ピクセルスケーリング機能は、VEGAS Pan/Crop による滑らかなグラデーションアルゴリズムを使用して、元のピクセル画像の再スケーリングによるピクセルの歪みの問題を回避するために、ソースのピクセル画像を拡大することができます。 使用するには、FFmpegをシステム環境変数に追加するか、Datamosh Extension Packを直接インストールすることができます。\nピクセルスケーリング機能は、現在のプロジェクトサイズに合わせて、最も近い近傍補間アルゴリズムを使用してソースファイルを拡大するためにFFmpegを使用します。 そしてVEGASのソースメディアファイルを新しく生成されたメディアファイルに置き換えます。 新しく生成されたファイルは、拡張子「_Scaled」をその名前に追加することで識別されます。 この機能は、従来の方法でVEGASにインポートされたイメージシーケンスファイルを含む、任意の画像/ビデオファイル形式をサポートしています。",
			},
			settings: {
				about: "Omad HelperはVEGAS ProのYTPMV/YTP拡張機能で、VEGASはMIDIシーケンスファイルなどのスコアを入力として受け入れ、YTPMVトラックを自動生成することができます。",
			},
		},
		empty: {
			disabled: {
				title: "{{name, capitalize}}は無効です",
				details: "{{name, lowercase}}の生成を有効にする",
			},
			ytpEnabled: {
				partial: {},
				fully: {},
				disableYtp: "YTPを無効にする",
				gotoYtp: "YTPに移動",
			},
		},
	},
	csharp: {
		mainDock: {
			toolTip: {
				importToHere: "インポート %1",
			},
		},
		coreWebView: {
			menuItem: {
				delete: "削除(&D)",
			},
		},
		contentDialog: {
			button: {
				ok: "&OK",
				cancel: "キャンセル",
				close: "閉じる",
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
			script: {},
		},
	},
} as const satisfies LocaleIdentifiers;
