// C# doesn't support union type (mix boolean and string), so we can only use all strings.
const trueFalseAuto = ["false", "auto", "true"] as const;
const onOffAuto = { false: "off", auto: "auto", true: "on" } as const;
const icons = { false: "dismiss", auto: "auto", true: "checkmark" } as const;

export default function ThreeStageSwitch({ current, indetText, indetIcon }: FCP<{
	/** The identifier of the selected segmented item. */
	current: StateProperty<TrueFalseAuto>;
	/** Alternate text for "auto" caption. */
	indetText?: string;
	/** Alternate icon for "auto" caption. */
	indetIcon?: DeclaredIcons;
}, "div">) {
	return (
		<Segmented current={current}>
			{trueFalseAuto.map(option => {
				const isIndet = option === "auto";
				return (
					<Segmented.Item
						id={option}
						key={option}
						icon={indetIcon && isIndet ? indetIcon : icons[option]}
					>
						{indetText && isIndet ? indetText : t[onOffAuto[option]]}
					</Segmented.Item>
				);
			})}
		</Segmented>
	);
}
