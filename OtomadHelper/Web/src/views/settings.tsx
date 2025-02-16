export default function Settings() {
	const [language, setLanguage] = useLanguage();
	const languages = useLanguageTags();
	const systemContrast = useIsSystemContrastScheme();
	const schemes = ["light", "dark", "auto"] as const;
	const { scheme: [scheme, setScheme], amoledDark: [amoledDark, setAmoledDark], contrast: [contrast, setContrast] } = useStoreState(colorModeStore);
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
			<Expander
				title={t.settings.appearance.colorScheme}
				icon="paint_brush"
				checkInfo={withObject(t.settings.appearance.colorScheme, t => contrast || systemContrast ? t.contrast : scheme === "dark" && amoledDark ? t.black : t[scheme])}
				expanded
			>
				{!systemContrast ? (
					<>
						<ItemsView
							view="grid"
							current={[scheme, setScheme]}
						>
							{schemes.map(scheme =>
								<ItemsView.Item id={scheme} key={scheme} withBorder image={<PreviewColorScheme colorScheme={scheme} />}>{t.settings.appearance.colorScheme[scheme]}</ItemsView.Item>)}
						</ItemsView>
						<ItemsView
							view="grid"
							current={null}
							multiple
						>
							<ItemsView.Item
								id="black"
								key="black"
								selected={[amoledDark, setAmoledDark]}
								image={<PreviewColorScheme colorScheme="black" />}
								details={t.descriptions.settings.appearance.colorScheme.black}
								data-scheme={classNames("dark black", { contrast })}
								style={{ opacity: scheme === "light" ? 0.5 : undefined }}
							>
								{t.settings.appearance.colorScheme.black}
							</ItemsView.Item>
							<ItemsView.Item id="contrast" key="contrast" selected={[contrast, setContrast]} image={<PreviewColorScheme colorScheme="contrast" />}>{t.settings.appearance.colorScheme.contrast}</ItemsView.Item>
						</ItemsView>
					</>
				) : (
					<>
						<InfoBar status="warning">{t.descriptions.settings.appearance.colorScheme.systemContrast}</InfoBar>
						<ItemsView
							view="grid"
							current={null}
							multiple
						>
							<ItemsView.Item id="contrast" key="contrast" selected="checked" image={<PreviewColorScheme colorScheme="contrast" />}>{t.settings.appearance.colorScheme.contrast}</ItemsView.Item>
						</ItemsView>
					</>
				)}
			</Expander>
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
