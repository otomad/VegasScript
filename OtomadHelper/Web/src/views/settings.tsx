export default function Settings() {
	const [language, setLanguage] = useLanguage();
	const languages = useLanguageTags();
	const systemContrast = useIsSystemContrastScheme();
	const schemes = ["light", "dark", "auto"] as const;
	const { scheme: [scheme, setScheme], amoledDark, contrast } = useStoreState(colorModeStore);
	const {
		uiScale, hideUseTips, autoSwitchSourceFrom, autoCollapsePrveClasses,
		backgroundImageOpacity, backgroundImageTint, backgroundImageBlur,
	} = selectConfig(c => c.settings);
	const backgroundImages = useBackgroundImages();
	const showBackgroundImage = backgroundImages.backgroundImage[0] !== -1;
	const [displayUiScale, setDisplayUiScale] = useState<Readable | undefined>(uiScale[0]);

	// Dev mode
	const { devMode, rtl } = useStoreState(devStore);

	async function addBackgroundImage() {
		const file = await openFile({ accept: "image/*" });
		if (file) await backgroundImages.add(file);
	}

	return (
		<div className="container">
			<SettingsAbout />
			<ExpanderRadio
				title={t.settings.language + (isEnglish(language ?? "en") ? "" : " / Language")}
				icon="globe"
				items={languages}
				expanded
				view="grid"
				value={[language, setLanguage]}
				idField
				nameField={t.settings.language}
				imageField={language => <PreviewLanguage language={language} />}
				itemsViewItemAttrs={{ withBorder: true }}
			/>

			<Subheader>{t.settings.appearance}</Subheader>
			<ExpanderRadio
				title={t.settings.appearance.backgroundImage}
				icon="wallpaper"
				items={backgroundImages.items}
				expanded
				view="grid"
				value={backgroundImages.backgroundImage}
				idField="key"
				imageField={item => item.key === -1 ? <IconTile name="prohibited" size={48} /> : item.url}
				checkInfoCondition={showBackgroundImage ? t.on : t.off}
				transition
				onItemContextMenu={(item, e) => {
					if (item.key !== -1) createContextMenu([
						{ label: t.menu.delete, onClick: () => backgroundImages.delete(item.key), confirmDeleteMessage: t.confirm.delete.backgroundImage },
					])(e);
				}}
				before={(
					<Expander.ChildWrapper>
						<Button icon="open_file" onClick={addBackgroundImage}>{t.browse}</Button>
					</Expander.ChildWrapper>
				)}
			>
				{showBackgroundImage && (
					<>
						<Expander.Item title={t.settings.appearance.backgroundImage.opacity} icon="fade">
							<Slider
								value={backgroundImageOpacity}
								min={0}
								max={1}
								step={0.01}
								defaultValue={0.2}
								displayValue={i => (i * 100 | 0) + "%"}
							/>
						</Expander.Item>
						<Expander.Item title={t.settings.appearance.backgroundImage.tint} icon="shape_intersect">
							<Slider
								value={backgroundImageTint}
								min={0}
								max={1}
								step={0.01}
								defaultValue={0}
								displayValue={i => (i * 100 | 0) + "%"}
							/>
						</Expander.Item>
						<Expander.Item title={t.settings.appearance.backgroundImage.blur} icon="blur">
							<Slider
								value={backgroundImageBlur}
								min={0}
								max={64}
								step={0.01}
								defaultValue={0}
								displayValue
							/>
						</Expander.Item>
					</>
				)}
			</ExpanderRadio>
			{systemContrast ? ( // TODO
				<Expander
					title={t.settings.appearance.colorScheme}
					icon="paint_brush"
					expanded
				>
					High Contrast
				</Expander>
			) : (
				<ExpanderRadio
					title={t.settings.appearance.colorScheme}
					icon="paint_brush"
					items={schemes}
					expanded
					view="grid"
					value={[scheme, setScheme]}
					idField
					nameField={t.settings.appearance.colorScheme}
					imageField={colorScheme => <PreviewColorScheme colorScheme={colorScheme} currentColorScheme={scheme} />}
					itemsViewItemAttrs={{ withBorder: true }}
					itemWidth={112}
				>
					<ToggleSwitch on={amoledDark}>Black</ToggleSwitch>
					<ToggleSwitch on={contrast}>High Contrast</ToggleSwitch>
				</ExpanderRadio>
			)}
			<Expander
				title={t.settings.appearance.uiScale}
				icon="zoom_in"
				checkInfo={displayUiScale + "%"}
				alwaysShowCheckInfo
				expanded
			>
				<Expander.ChildWrapper>
					<Slider
						value={uiScale}
						min={50}
						max={200}
						defaultValue={100}
						step={1}
						staticSmoothInterval={0}
						displayValue
						onDisplayValueChanged={setDisplayUiScale}
					/>
				</Expander.ChildWrapper>
			</Expander>

			<Subheader>{t.settings.preference}</Subheader>
			<SettingsCardToggleSwitch title={t.settings.preference.autoSwitchSourceFrom} details={t.descriptions.settings.preference.autoSwitchSourceFrom} icon="arrow_swap" on={autoSwitchSourceFrom} />
			<SettingsCardToggleSwitch title={t.settings.preference.autoCollapsePrveClasses} details={t.descriptions.settings.preference.autoCollapsePrveClasses} icon="chevron_down_up" on={autoCollapsePrveClasses} />

			<Subheader>{t.subheaders.config}</Subheader>
			<SettingsCardToggleSwitch title={t.settings.config.hideUsageTips} icon="chat_help_off" on={hideUseTips} />

			<Subheader>{t.settings.dev}</Subheader>
			<SettingsCardToggleSwitch title={t.settings.dev.devMode} icon="devtools" on={devMode} />
			<SettingsCardToggleSwitch title={t.settings.dev.rtl} icon="text_paragraph_direction_left" on={rtl} />
		</div>
	);
}
