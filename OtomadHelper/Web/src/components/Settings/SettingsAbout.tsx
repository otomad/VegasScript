import ColoredLogo from "assets/svg/Otomad Helper Colored.svg?react";
import MonoLogo from "assets/svg/Otomad Helper Mono.svg?react";
import links from "helpers/links";

const StyledSettingsAbout = styled.div`
	display: flex;
	gap: 16px;
	margin-bottom: 10px;

	.logo {
		display: none;
		width: 150px;
		height: auto;
		content-visibility: auto;

		${ifColorScheme.light} &.light {
			display: block;
		}

		${ifColorScheme.dark} &.dark {
			display: block;
			fill: currentColor;
		}
	}

	.right {
		display: flex;
		flex-direction: column;
		gap: 5px;

		> div {
			display: flex;
			flex-wrap: wrap;
			column-gap: 10px;

			> * {
				display: inline-block;
			}
		}

		.pairs {
			color: ${c("fill-color-text-secondary")};
		}
	}
`;

export default function SettingsAbout() {
	"use no memo";
	const pairs = new Map<string, string>([
		[t.settings.about.author, t.settings.about.__author__],
		[t.settings.about.originalAuthor, t.settings.about.__originalAuthor__],
	]);
	const currentLanguage = useCurrentLanguage();
	const [hasTranslator, formattedTranslator] = listFormatTranslators(currentLanguage, currentLanguage);
	if (hasTranslator) pairs.set(t.settings.about.translator, formattedTranslator);
	const { version } = useAboutApp();
	const [showTranslators, setShowTranslators] = useState(false);

	return (
		<>
			<StyledSettingsAbout>
				<MonoLogo className="logo dark" aria-hidden />
				<ColoredLogo className="logo light" aria-hidden />
				<div className="right">
					<p>{t.descriptions.settings.about}</p>
					<div className="pairs">
						{Array.from(pairs.entries(), ([key, value]) => <span key={key}>{key + t.colon + value}</span>)}
					</div>
					<div>
						<Link href={links.otomadHelper.documentation[currentLanguage]}>{t.settings.about.documentation}</Link>
						<Link href={links.otomadHelper.repository}>{t.settings.about.repositoryLink}</Link>
						<Link href={links.otomadHelper.changelog}>{t.settings.about.changelog}</Link>
						<Link href={links.otomadHelper.issues}>{t.settings.about.feedback}</Link>
						<Link href={links.gpl3}>{t.settings.about.license}</Link>
						<Link onClick={() => setShowTranslators(true)} aria-haspopup="dialog">{t.settings.about.translators}</Link>
						<Link href={links.crowdin.contributeTranslation[currentLanguage]}>{t.settings.about.translation}</Link>
					</div>
					<Translators shown={[showTranslators, setShowTranslators]} />
				</div>
			</StyledSettingsAbout>
			<Expander
				title={t.settings.about.version}
				icon="sync"
				actions={(
					<>
						<p>v{version}</p>
						<Button onClick={() => checkForUpdates(version)}>{t.settings.about.checkForUpdates}</Button>
					</>
				)}
			>
				<AboutInformation />
			</Expander>
		</>
	);
}

async function checkForUpdates(currentVersion: string) {
	const byApi = fetch(links.api.versionTagGitHubApi)
		.then(res => res.json())
		.then(data => data.tag_name as string);
	const byRaw = fetch(links.api.versionTagGitHubRaw)
		.then(res => res.text())
		.then(data => data.trim());
	const tagName = await Promise.race([byApi, byRaw]);
	const compare = new Version(tagName).compareTo(currentVersion);
	console.log(tagName, compare);
}

const StyledTableBase = styled.div<{
	$table?: boolean;
}>(ifNotProp("$table", css`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	column-gap: 12px;
`, css`
	display: table;

	:is(td, th):not(:first-of-type) {
		border-inline-start: 12px solid transparent;
	}
`));

const StyledTranslatorsTable = styled(StyledTableBase)`
	p:nth-child(2n + 1) {
		text-align: end;
	}

	p.current {
		${styles.effects.text.bodyStrong};
		color: ${c("accent-color")};
	}

	+ p {
		margin-block-start: 1em;
	}
`;

function Translators({ shown: [shown, setShown] }: FCP<{
	/** Show the content dialog? */
	shown: StateProperty<boolean>;
}>) {
	const currentLanguage = useCurrentLanguage();
	const languages = useLanguageTags();

	const availableLanguageNames = {
		original: languages.mapObject(lang => [lang, t({ lng: lang }).metadata.name]),
		english: languages.mapObject(lang => [lang, getLocaleName(lang, "en")]),
		current: languages.mapObject(lang => [lang, getLocaleName(lang, currentLanguage)]),
	};
	const languageDisplayNames = keys(availableLanguageNames);
	const [displayName, setDisplayName] = useState<typeof languageDisplayNames[number]>("original");
	const nextDisplayName = useCallback(() => setDisplayName(name => {
		const getNext = (current: typeof name) => languageDisplayNames[(languageDisplayNames.indexOf(current) + 1) % languageDisplayNames.length];
		let next = getNext(name);
		if (isEnglish(currentLanguage) && next === "english") next = getNext(next);
		return next;
	}), [currentLanguage, languageDisplayNames]);
	const languageNames = availableLanguageNames[displayName];

	useInterval(nextDisplayName, 2000);

	return (
		<ContentDialog
			shown={[shown, setShown]}
			title={t.settings.about.translators}
			buttons={close => (
				<>
					<Button onClick={() => window.open(links.crowdin.contributeTranslation[currentLanguage])}>{t.settings.about.translation}</Button>
					<Button autoFocus accent onClick={close}>{t.ok}</Button>
				</>
			)}
		>
			<StyledTranslatorsTable>
				{languages.map(lang => {
					const langAttr = displayName === "english" ? "en" : displayName === "original" ? lang : undefined;
					const isCurrentLang = { current: lang === currentLanguage };
					const [hasTranslator, formattedTranslator] = listFormatTranslators(lang, langAttr ?? currentLanguage);
					return (
						<Fragment key={lang}>
							<p lang={langAttr} className={isCurrentLang}>{languageNames[lang]}</p>
							<p lang={hasTranslator ? lang : "en"} className={isCurrentLang}>{formattedTranslator}</p>
						</Fragment>
					);
				})}
			</StyledTranslatorsTable>
			<p>{t.descriptions.settings.translation}</p>
		</ContentDialog>
	);
}

const StyledAboutInformation = styled(ItemsView)`
	.card {
		block-size: 100%;
		overflow: hidden;
		color: ${c("foreground-color")};
		// word-break: break-word; // Deprecated, behaviors same as below.
		word-break: normal;
		overflow-wrap: anywhere;

		.base {
			display: flex;
			flex-direction: column;
			gap: 0.75rem;
			justify-content: space-between;
		}

		.name {
			${styles.effects.text.bodyStrong};
		}

		.version {
			${styles.effects.text.bodyLarge};
			margin-block-end: -0.25rem;
			color: ${c("fill-color-text-secondary")};
		}

		.icon {
			float: inline-end;
			margin-block-start: 2px;
			margin-inline-start: 4px;
			color: ${c("fill-color-text-secondary")};
			font-size: 16px;
		}
	}
`;

const $v = (name: string, version: string, link?: string) => ({ name, version, link });
function AboutInformation() {
	const { appName, version } = useAboutApp();
	const data = [
		$v(appName, "v" + version, links.otomadHelper.repository),
		$v("React", "v" + React.version, links.react),
	];

	return (
		<StyledAboutInformation
			view="grid"
			current={null}
			className="monospace"
			role="group"
			lang="en"
			translate="no"
		>
			{data.map(({ name, version, link }) => (
				<Card width={200} key={name} as={Link} href={link}>
					<p className="name"><Icon name="open" />{name}</p>
					<p className="version">{version}</p>
				</Card>
			))}
		</StyledAboutInformation>
	);
}

function listFormatTranslators_static(translators: string[] | string, lang: string) {
	if (typeof translators === "string" || isI18nItem(translators)) translators = translators.toString().split("\n").toTrimmed();
	const formatted = new Intl.ListFormat(lang, { style: "narrow", type: "conjunction" }).format(translators);
	return panguSpacing(formatted);
}

export function listFormatTranslators(targetLanguage: string, displayLanguage: string): [hasTranslator: boolean, formattedTranslator: string] {
	const translators = t({ lng: targetLanguage }).metadata.__translator__, hasTranslator = translators.length > 0;
	const formattedTranslator = hasTranslator ? listFormatTranslators_static(translators, displayLanguage) : "—";
	return [hasTranslator, formattedTranslator];
}
