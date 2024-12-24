import { StyledButton } from "./Button";
import { inputInSettingsCardStyle } from "./TextBox";

const StyledComboBox = styled(StyledButton)`
	padding: 4px 11px;

	${inputInSettingsCardStyle};

	.content {
		${styles.mixins.square("100%")};
		display: flex;
		gap: 8px;
		align-items: center;

		.text {
			${styles.effects.text.body};
			width: 100%;
		}

		.icon {
			flex-shrink: 0;
			font-size: 16px;
		}
	}

	&:active .content .icon {
		translate: 0 2px;
	}

	select& {
		option {
			background-color: ${c("background-color")};
		}

		&[disabled],
		[disabled] & {
			color: ${c("fill-color-text-disabled")};
		}
	}
`;

export default function ComboBox<T extends string | number>({ ids, options, icons, current: [current, setCurrent], ...htmlAttrs }: FCP<{
	/** The identifiers for each option of the combo box. */
	ids: readonly T[];
	/** The display texts for each option of the combo box. */
	options: readonly Readable[];
	/** Optional. The icons for each option of the combo box. */
	icons?: readonly DeclaredIcons[];
	/** The selected option of the combo box. */
	current: StateProperty<T>;
}, "select">) {
	const currentOption = options[ids.indexOf(current!)] ?? `<${current}>`;
	const [iconSvgs, setIconSvgs] = useState<string[]>();

	useAsyncEffect(async () => {
		if (!icons || !icons.length) setIconSvgs(undefined);
		else setIconSvgs(await Array.fromAsync(icons, rawIcon));
	}, [icons]);

	const showComboBox: MouseEventHandler<HTMLButtonElement> = async e => {
		console.log(iconSvgs);
		const rect = e.currentTarget.getBoundingClientRect();
		const result = await bridges.bridge.showComboBox(rect, current!, ids, toStringArray(options)) as T;
		setCurrent?.(result);
	};

	if (true || window.isWebView)
		return (
			<StyledComboBox
				role="combobox"
				aria-expanded={false}
				aria-haspopup
				onClick={showComboBox}
				{...htmlAttrs as FCP<{}, "button">}
			>
				<div className="content">
					<div className="text">{currentOption}</div>
					<Icon name="chevron_down" />
				</div>
			</StyledComboBox>
		);
	else // fallback in dev (a normal browser)
		return (
			<StyledComboBox
				as="select"
				role="combobox"
				defaultValue={current}
				onChange={e => setCurrent?.(e.currentTarget.value as T)}
				{...htmlAttrs}
			>
				{ids.map((id, i) => <option key={id} value={id}>{options[i]}</option>)}
			</StyledComboBox>
		);
}

/* eslint-disable @typescript-eslint/no-wrapper-object-types */
// The `Object` means every JavaScript object base class (including string, boolean and almost everything),
// So here we use `Object` instead of `object` for correct typing. So does ESLint disable.
function toStringArray(array: readonly Object[]) {
	return array.map(item => item.toString());
}

const iconsImport = import.meta.glob<string>("/src/assets/icons/**/*.svg", { import: "default", query: "?raw" });
function rawIcon(name: string) { return iconsImport[`/src/assets/icons/${name}.svg`]?.(); }
