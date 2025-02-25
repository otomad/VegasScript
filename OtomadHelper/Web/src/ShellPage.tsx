const pages = import.meta.glob<FC>("/src/views/**/*.tsx", { import: "default", eager: true });

function EmptyPage() {
	return <div className="container"><EmptyMessage icon="settings" title={t.underConstruction} spinAtBegin noSideEffect /></div>;
}

const navItems = ["home", "source", "score", "audio", "visual", "track", "sonar", "lyrics", "shupelunker", "ytp"] as const;
const navToolItems = ["management", "mosh", "tools"] as const;
const bottomNavItems = ["settings"] as const;

export function redirectIcon(name: string): DeclaredIcons & DeclaredLotties {
	const redirects = {
		source: "video_clip_multiple",
		score: "instrument",
		audio: "volume",
		visual: "image",
		track: "layer",
		shupelunker: "slice",
		tools: "apps",
		management: "library",
	} as const;
	return hasOwn(redirects, name) ? redirects[name] : name as DeclaredIcons & DeclaredLotties;
}

const isCompleteAvailable = (page: string[]) => !["management", "mosh", "tools", "settings"].includes(page[0]);
const isAutoLayoutTracks = (page: string[]) => page.length >= 2 && page[0] === "track";

const getTitle = (viewName: string, full: boolean = false, plural?: number) => {
	const tp = plural !== undefined ? t(plural) : t;
	const str = tp.titles[new VariableName(viewName).camel];
	const ctx = full ? str({ context: "full" }) : str;
	return ctx;
};

export default function ShellPage() {
	const { page, changePage, pagePath, transition, canBack, back, reset, setPageContentId, poppedScroll } = useSnapshot(pageStore);
	const pageTitles = page.map((crumb, i, { length }) => {
		try {
			return {
				name: getTitle(crumb, true),
				link: i === length - 1 ? undefined : page.slice(0, i + 1),
			};
		} catch (error) {
			reset();
			throw error;
		}
	});
	const Page = pages[`/src/views/${pagePath}.tsx`] ?? EmptyPage;
	const { uiScale } = useSnapshot(configStore.settings);
	const zoom = uiScale === 100 ? undefined : uiScale / 100;
	const { appName } = useAboutApp();
	const { enabled: enablePixelScaling } = useSnapshot(configStore.visual.pixelScaling);
	const documentTitle = (() => {
		const lastPage = page.last();
		return (lastPage ? getTitle(lastPage, true) + " - " : "") + appName;
	})();
	const pageContentId = useId();
	setPageContentId(pageContentId);

	useEffect(() => {
		document.body.classList.toggle("pixelated", enablePixelScaling);
	}, [enablePixelScaling]);

	const completeDisabled = !isCompleteAvailable(page);
	const autoLayoutTracksMode = isAutoLayoutTracks(page);
	const navBadges = useSnapshot(navBadgeStore);
	const getBadge = (id: string) => hasOwn(navBadges, id) ? navBadges[id] : undefined;

	return (
		<NavigationView
			currentNav={[page, changePage]}
			navItems={[
				...navItems.map(item => ({ text: getTitle(item), id: item, icon: redirectIcon(item), animatedIcon: redirectIcon(item), badge: getBadge(item) })),
				{ type: "hr" },
				...navToolItems.map(item => ({ text: getTitle(item, false, 2), id: item, icon: redirectIcon(item), animatedIcon: redirectIcon(item) })),
				...bottomNavItems.map(item => ({ text: getTitle(item, false, 2), id: item, icon: redirectIcon(item), animatedIcon: redirectIcon(item), bottom: true })),
			]}
			titles={pageTitles}
			transitionName={transition}
			canBack={canBack}
			onBack={back}
			pageContentId={pageContentId}
			poppedScroll={poppedScroll}
			commandBar={(
				<CommandBar>
					{
						...autoLayoutTracksMode ? [
							<CommandBar.Item key="save" icon="save" caption={t.save} onClick={() => { pageStore.onSave?.(); back(); }} />,
							<CommandBar.Item key="applyToSelectedTracks" caption={t.track.applyToSelectedTracks} icon="arrow_sync_checkmark" />,
						] : [
							<CommandBar.Item
								key="complete" icon="checkmark" caption={t.complete} disabled={completeDisabled} canBeDisabled
								onClick={() => completeDisabled && alert("Cannot complete!")}
							/>,
						]
					}
				</CommandBar>
			)}
			style={{ zoom, "--zoom": zoom }}
		>
			<title>{documentTitle}</title>
			<Page />
		</NavigationView>
	);
}
