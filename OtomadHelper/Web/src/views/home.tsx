export default function Home() {
	const [shown, setShown] = useState(false);
	const [text, setText] = useState("foo");
	const pitch = useState("C5");
	const timecode = useState("00:00:03.000");
	const options = ["foo", "bar", "baz", "hello", "world"];
	const slider = useState(50);
	const checkboxModel = useState<string[]>([]);

	return (
		<div className="container">
			<InfoBar status="accent" title="Info">This page is for testing components currently. The quick brown fox jumps over a lazy dog.</InfoBar>
			<SettingsCardToggleSwitch title="Shown" icon="enabled" on={[shown, setShown]} />
			<TextBox value={[text, setText]} />

			<div>
				<Segmented current={[text, setText]}>
					<Segmented.Item icon="placeholder" id="foo">foo</Segmented.Item>
					<Segmented.Item icon="placeholder" id="bar">bar</Segmented.Item>
					<Segmented.Item icon="placeholder" id="baz">baz</Segmented.Item>
					<Segmented.Item icon="placeholder" id="hello">hello</Segmented.Item>
					<Segmented.Item icon="placeholder" id="world">world</Segmented.Item>
				</Segmented>
			</div>

			<ComboBox options={options} ids={options} current={[text, setText]} />

			<PitchPicker spn={pitch} style={{ maxWidth: "300px" }} />

			<TimecodeBox timecode={timecode} />

			<Slider value={slider} defaultValue={50} />

			<Expander icon="single_select" title="Radio buttons">
				{options.map(option => <RadioButton key={option} id={option} value={[text, setText]}>{option}</RadioButton>)}
			</Expander>
			<Expander icon="multiselect" title="Checkboxes">
				{options.map(option => <Checkbox key={option} id={option} value={checkboxModel}>{option}</Checkbox>)}
			</Expander>
		</div>
	);
}
