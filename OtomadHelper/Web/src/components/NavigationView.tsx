import type { PageScroll } from "stores/page";

const navButtonSize = { width: 44, height: 40 };
const CONTENT_ITEMS_ASSUMED_COUNT = 20;
const NAV_ITEMS_ASSUMED_COUNT = 20;
const NAV_ITEMS_BOTTOM_ASSUMED_COUNT = 3;
const TITLE_ANCHOR_NAME = "--navigation-view-title";

const NavButton = styled(Button).attrs({
	subtle: true,
})`
	position: absolute;
	block-size: ${navButtonSize.height}px;
	inline-size: ${navButtonSize.width}px;
	min-inline-size: unset;
`;

const StyledTopLeftButtons = styled.div`
	z-index: 10;
	margin-block: 4px 1px;
	margin-inline: 9px 5px;
	block-size: ${navButtonSize.height}px;

	&.vertical {
		margin-inline-start: 5px;
		block-size: ${navButtonSize.height * 2}px;

		${NavButton} {
			inline-size: 52px;
		}
	}

	&:not(.shadow) {
		position: fixed;
		z-index: 11;
	}

	.base {
		position: relative;
	}

	&:not(.vertical) ${NavButton}:nth-of-type(2) {
		inset-block-start: 0;
		inset-inline-start: ${navButtonSize.width}px;
	}

	&.vertical ${NavButton}:nth-of-type(2) {
		inset-block-start: ${navButtonSize.height}px;
		inset-inline-start: 0;
	}
`;

function TopLeftButtons({ shadow, paneDisplayMode, canBack = true, onBack, onNavButton }: FCP<{
	/** Is it a shadow? */
	shadow?: boolean;
	/** Navigation panel display mode. */
	paneDisplayMode: PaneDisplayMode;
	/** Can go back? */
	canBack?: boolean;
	/** Back button click event. */
	onBack?(): void;
	/** Global navigation button click event. */
	onNavButton?(): void;
}>) {
	const vertical = paneDisplayMode === "compact";
	const tooltipPlacement: Placement = vertical ? "right" : "bottom";

	useEventListener(window, "keydown", e => {
		if (e.altKey && e.code === "ArrowLeft") onBack?.();
		else if (e.altKey && e.code === "KeyH") onNavButton?.();
	});

	const TooltipTitle = useCallback(({ title, shortcut }: { title: string; shortcut: string }) =>
		<>{title}<code style={{ marginLeft: "0.25em" }}>({shortcut})</code></>, []);

	return (
		<StyledTopLeftButtons className={{ shadow, vertical }}>
			{!shadow && (
				<div className="base">
					<Tooltip placement={tooltipPlacement} title={<TooltipTitle title={t.back} shortcut="Alt + ←" />}>
						<NavButton animatedIcon="back" disabled={!canBack} onClick={onBack} aria-label="Back" dirBased />
					</Tooltip>
					<Tooltip placement={tooltipPlacement} title={<TooltipTitle title={t.navigation} shortcut="Alt + H" />}>
						<NavButton animatedIcon="global_nav_button" onClick={onNavButton} aria-label="Navigation" />
					</Tooltip>
				</div>
			)}
		</StyledTopLeftButtons>
	);
}

const floatUp = keyframes`
	from {
		opacity: 0;
		translate: 0 1rem;
	}
`;

const CONTENT_MARGIN_X = 20;
const TITLE_LINE_HEIGHT = 40;
const COMPACT_WIDTH = 62;

const StyledNavigationView = styled.div<{
	$transitionName: string;
}>`
	${styles.mixins.square("100%")};
	display: flex;

	> * {
		display: flex;
		flex-direction: column;
	}

	> .left {
		flex-shrink: 0;
		padding-block-end: 4px;
		block-size: 100%;
		inline-size: 320px;
		max-inline-size: calc(100dvw / var(--zoom));

		@media (horizontal-viewport-segments >= 2) {
			inline-size: calc((env(viewport-segment-left 1 0) - env(viewport-segment-left 0 0)) / var(--zoom, 1));

			&.expanded:not(.flyout) {
				padding-inline-end: calc((env(viewport-segment-left 1 0) - env(viewport-segment-right 0 0)) / var(--zoom, 1));
			}

			&.expanded.flyout {
				inline-size: calc((env(viewport-segment-right 0 0) - env(viewport-segment-left 0 0)) / var(--zoom, 1));
			}
		}

		> * {
			flex-shrink: 0;
		}

		.nav-items {
			flex-shrink: 1;
			block-size: 100%;
			overflow-y: auto;

			&.overflowing {
				border-block-end: 1px solid ${c("stroke-color-divider-stroke-default")};
			}
		}

		.nav-items,
		.nav-items-bottom {
			overflow-x: hidden;
		}

		&:is(.compact, .minimal):not(.flyout) .nav-items {
			${styles.mixins.noScrollbar()};
		}

		&.compact {
			inline-size: ${COMPACT_WIDTH}px;
		}

		&.minimal {
			inline-size: 0;

			&:not(.flyout) {
				translate: -${COMPACT_WIDTH}px;
			}

			&.flyout {
				outline-width: 0;

				.nav-items {
					${styles.mixins.noScrollbar()};
				}
			}
		}

		&.flyout {
			position: fixed;
			z-index: 8;
			/* background-color: ${c("background-fill-color-acrylic-background-default")}; */
			border-radius: 0 8px 8px 0;
			outline: 1px solid ${c("stroke-color-surface-stroke-flyout-navigation-panel")};
			box-shadow: 0 8px 16px ${c("shadows-flyout")};
			backdrop-filter: blur(60px);
			transition-behavior: allow-discrete;
		}
	}

	> .right {
		inline-size: 100%;

		&.hairtail {
			> .title-wrapper,
			> .page-content {
				scrollbar-gutter: stable;

				> * {
					margin: 0 auto;
					inline-size: 100%;
					max-inline-size: 1000px;
				}
			}
		}

		&.minimal > .title-wrapper {
			margin-block-start: 40px;
		}

		.title-wrapper {
			position: relative;
			flex-shrink: 0;
			margin: 12px 0 8px;
			overflow: hidden;
			font-weight: 600;

			> .title-wrapper-inner {
				display: flex;
				justify-content: space-between;
				align-items: center;
				block-size: ${TITLE_LINE_HEIGHT}px;
				inline-size: 100%;
				anchor-name: ${TITLE_ANCHOR_NAME};

				> div {
					${styles.mixins.square("100%")};
				}

				.command-bar {
					flex-shrink: 0;
					block-size: ${TITLE_LINE_HEIGHT}px;
					transition: ${fallbackTransitions}, inset-inline 0s;

					@supports (anchor-name: ${TITLE_ANCHOR_NAME}) {
						position: fixed;
						inset-block-start: 12px;
						inset-inline-end: anchor(end);
						position-anchor: ${TITLE_ANCHOR_NAME};
					}
				}
			}
		}

		&.minimal .title-wrapper > .title-wrapper-inner .command-bar {
			inset-block-start: 4px !important;
		}

		.title-wrapper .title {
			${styles.effects.text.title};
			position: absolute;
			display: flex;
			gap: 14px;
			align-items: center;
			transition: all ${eases.easeInOutMaterialEmphasized} 700ms;

			* {
				white-space: nowrap;
			}

			${tgs(tgs.exit)} {
				translate: 0 -${TITLE_LINE_HEIGHT}px;
			}

			${tgs(tgs.enter)} {
				translate: 0 ${TITLE_LINE_HEIGHT}px;
			}

			&.exit:has(+ .title.exit) {
				transition-duration: 1s;
			}

			> div {
				display: contents;

				.enter,
				.exit-active {
					translate: 20px;
					opacity: 0;
				}

				.enter-active {
					translate: 0;
					opacity: 1;
					transition-duration: 300ms;
					transition-delay: 200ms;

					&.crumb {
						transition-delay: 300ms;
					}
				}

				.exit-active {
					transition-timing-function: ${eases.easeInMax};

					&.bread-crumb-chevron-right {
						transition-delay: 50ms;
					}
				}

				> .parent {
					color: ${c("fill-color-text-secondary")};

					&:hover {
						color: ${c("foreground-color")};
					}

					&:active {
						color: ${c("fill-color-text-tertiary")};
					}
				}
			}
		}

		.page-content {
			block-size: 100%;
			overflow: hidden auto;
			overscroll-behavior: contain;

			&:has(> .enter, > .exit),
			&:has(> main > .container-preview) {
				overflow-y: hidden;
			}

			> main {
				@layer layout {
					> * {
						display: flex;
						flex-direction: column;
						gap: 6px;
						inline-size: 100%;
					}
				}

				> .container {
					margin-block-start: 2px;

					&::after {
						content: "";
						block-size: 18px;
					}

					.card.media-pool > .base {
						padding: 2px;
					}

					${({ $transitionName }) => forMap(CONTENT_ITEMS_ASSUMED_COUNT, i => css`
						> :nth-child(${i}) {
							animation: ${$transitionName === "jump" ? floatUp : ""}
								300ms ${50 * (i - 1)}ms ${eases.easeOutMax} backwards;
						}
					`, 1)}

					> .contents > * {
						animation: inherit;
					}

					> div:is(:not([class]), .stack-panel):has(> button) {
						display: flex;
						flex-wrap: wrap;
						gap: 8px;

						> button {
							min-inline-size: 120px;
						}
					}
				}

				> .container-preview {
					${styles.mixins.square("100%")};
					position: absolute;
				}
			}

			> .exit > .container > * {
				animation: none !important;
			}
		}

		.title-wrapper,
		.page-content {
			padding: 0 ${CONTENT_MARGIN_X}px;
		}
	}

	${() => {
		const selectors = forMap(NAV_ITEMS_ASSUMED_COUNT, i =>
			`&:has(.nav-items .tooltip-child-wrapper:nth-of-type(${i}) .tab-item-wrapper .tab-item:active) .nav-items .tooltip-child-wrapper:nth-of-type(${i}) .tab-item-wrapper .tab-item .animated-icon`, 1);
		selectors.push(...forMap(NAV_ITEMS_BOTTOM_ASSUMED_COUNT, i =>
			`&:has(.nav-items-bottom .tooltip-child-wrapper:nth-of-type(${i}) .tab-item-wrapper .tab-item:active) .nav-items-bottom .tooltip-child-wrapper:nth-of-type(${i}) .tab-item-wrapper .tab-item .animated-icon`, 1));
		return css`
			${selectors.join(", ")} {
				--state: pressed;
			}
		`;
	}}
`;

const StyledPage = styled.main`
	container: page / inline-size;
	position: relative;
	display: flex;
	min-block-size: 100%;
	transition: none;

	&.exit {
		pointer-events: none; // Prevent users from quickly clicking buttons to enter sub-pages.
	}

	&.exit-done {
		display: none;
	}

	// #region Page transitions
	.jump > &:is(.exit, .exit-done) {
		translate: 0 -2rem;
		opacity: 0;
		transition: all ${eases.easeInExpo} 150ms;
	}

	.jump > &.enter {
		translate: 0 5rem;
		opacity: 0;
	}

	.jump > &.enter-active {
		translate: 0;
		opacity: 1;
		transition: all ${eases.easeOutExpo} 500ms;
	}

	.forward > &.exit,
	.backward > &.exit {
		transition: all ${eases.easeInExpo} 300ms;
	}

	.forward > &:is(.exit, .exit-done),
	.backward > &.enter {
		translate: -20%;

		&:dir(rtl) {
			translate: 20%;
		}
	}

	.forward > &.enter,
	.backward > &:is(.exit, .exit-done) {
		translate: 20%;

		&:dir(rtl) {
			translate: -20%;
		}
	}

	.forward > &.enter-active,
	.backward > &.enter-active {
		translate: 0 !important;
		transition: all ${eases.easeOutExpo} 300ms;
	}
	// #endregion
`;

function NavigationViewLeftPanel({ paneDisplayMode, isFlyoutShown, customContent, currentNavTab, navItems, navItemsId, flyout, isCompact }: FCP<{
	paneDisplayMode: PaneDisplayMode;
	isFlyoutShown: boolean;
	customContent?: ReactNode;
	currentNavTab: StateProperty<string>;
	navItems: (NavItem | NavBrItem)[];
	navItemsId?: string;
	flyout: boolean;
	isCompact: boolean;
}>) {
	const [isNavItemsOverflowing, setIsNavItemsOverflowing] = useState(false);
	const navItemsEl = useDomRef<"div">();
	const focusable = !flyout && paneDisplayMode === "minimal" ? false : isFlyoutShown === flyout;
	const covered = !flyout && isFlyoutShown;

	const getNavItemNode = useCallback((item: typeof navItems[number], index: number) => {
		if ("type" in item) return item.type === "hr" ? <hr key={index} /> : undefined;
		const { text, icon, animatedIcon, id, badge } = item;
		return (
			<TabBar.Item
				key={id}
				id={id}
				icon={icon || (!animatedIcon ? "placeholder" : undefined)}
				animatedIcon={animatedIcon}
				focusable={focusable}
				badge={badge}
				ariaCurrentWhenSelected="page"
			>
				{text}
			</TabBar.Item>
		);
	}, [isFlyoutShown, focusable]);

	useEventListener(window, "resize", () => {
		const navItems = navItemsEl.current;
		if (!navItems) return;
		setIsNavItemsOverflowing(navItems.scrollHeight > navItems.offsetHeight);
	}, { immediate: true });

	const onNavItemsScroll = useCallback<UIEventHandler<HTMLDivElement>>(e => {
		const currentElement = e.currentTarget;
		const panel = currentElement.closest(".left")!;
		if (panel.classList.containsAny("minimal", "covered")) return;
		const { scrollTop, dataset: { navItemsId } } = currentElement;
		if (!navItemsId) return;
		document.querySelectorAll(`[data-nav-items-id="${navItemsId}"]`).forEach(element => {
			if (element === currentElement) return;
			element.scrollTo({ top: scrollTop, behavior: "instant" });
		});
	}, []);

	return (
		<div className={["left", paneDisplayMode, { flyout, covered }]} aria-hidden={paneDisplayMode === "minimal" || covered}>
			<TopLeftButtons shadow paneDisplayMode={isCompact ? "compact" : paneDisplayMode} />
			<div
				ref={navItemsEl}
				data-nav-items-id={navItemsId}
				className={["nav-items", { overflowing: isNavItemsOverflowing }]}
				tabIndex={-1}
				onScroll={onNavItemsScroll}
			>
				{customContent}
				<TabBar current={currentNavTab} collapsed={paneDisplayMode === "compact"} vertical role="navigation">
					{navItems.map((item, index) => {
						if (!item.bottom) return getNavItemNode(item, index);
					})}
				</TabBar>
			</div>
			<div className="nav-items-bottom">
				<TabBar current={currentNavTab} collapsed={paneDisplayMode === "compact"} vertical role="navigation">
					{navItems.map((item, index) => {
						if (item.bottom) return getNavItemNode(item, index);
					})}
				</TabBar>
			</div>
		</div>
	);
}

const StyledBreadCrumbChevronRight = styled.div`
	${styles.mixins.flexCenter()};
	margin-block-start: 4px;

	.icon {
		color: ${c("fill-color-text-secondary")};
		font-size: 16px;
	}
`;

const BreadCrumbChevronRight = ({ ref }: FCP<{}, "div">) => (
	<StyledBreadCrumbChevronRight ref={ref}>
		<Icon name="chevron_right" />
	</StyledBreadCrumbChevronRight>
);

interface NavItem {
	/** Label text. */
	text: string;
	/** Icon. */
	icon?: DeclaredIcons;
	/** Animated icon. */
	animatedIcon?: DeclaredLotties;
	/** Identifier. */
	id: string;
	/** Place it at the bottom of the navigation panel? */
	bottom?: boolean;
	/** Show the badge, or **beacon** by `true`. */
	badge?: BadgeArgs;
}

interface NavBrItem {
	/** Type: dividing line. */
	type: "hr";
	/** Place it at the bottom of the navigation panel? */
	bottom?: boolean;
}

type PaneDisplayMode = "expanded" | "compact" | "minimal";
const getPaneDisplayMode = (zoom: number = 1): PaneDisplayMode =>
	window.innerWidth < 641 * zoom ? "minimal" :
	window.innerWidth < 1008 * zoom ? "compact" : "expanded";
const usePaneDisplayMode = () => {
	const { uiScale1 } = useSnapshot(configStore.settings);
	const [paneDisplayMode, setPaneDisplayMode] = useState<PaneDisplayMode>(getPaneDisplayMode(configStore.settings.uiScale1));
	const onResize = () => setPaneDisplayMode(getPaneDisplayMode(configStore.settings.uiScale1));
	useEventListener(window, "resize", onResize);
	useEffect(() => onResize(), [uiScale1]);
	// subscribeStoreKey(configStore.settings, "uiScale", onResize);
	return paneDisplayMode;
};

export default function NavigationView({ currentNav, navItems = [], titles, transitionName = "", children, customContent, canBack = true, onBack, commandBar, pageContentId, poppedScroll, ...htmlAttrs }: FCP<{
	/** Current navigation page status parameters. */
	currentNav: StateProperty<string[]>;
	/** All navigation items. */
	navItems?: (NavItem | NavBrItem)[];
	/** Array of breadcrumb navigation titles. */
	titles?: { name: string; link?: string[] }[];
	/** Custom content area. */
	customContent?: ReactNode;
	/** Page transition name. */
	transitionName?: string;
	/** Can go back? */
	canBack?: boolean;
	/** Back button click event. */
	onBack?(): void;
	/** Command bar, optional. */
	commandBar?: ReactNode;
	/** Manually specify the identifier for the page content element. */
	pageContentId?: string;
	/** The page scroll value popped from the stack. */
	poppedScroll?: PageScroll;
}, "div">) {
	const currentNavTab = useStateSelector(currentNav, nav => nav[0], value => [value]);
	const pagePath = currentNav.join("/");
	const responsive = usePaneDisplayMode();
	const [flyoutDisplayMode, setFlyoutDisplayMode] = useState<PaneDisplayMode>("minimal");
	const [isExpandedInExpandedMode, setIsExpandedInExpandedMode] = useState(true);
	const paneDisplayMode: PaneDisplayMode = responsive === "expanded" ?
		isExpandedInExpandedMode ? "expanded" : "compact" : responsive;
	const pageContentEl = useDomRef<"div">();
	const scrollToTopOrPrevious = () => {
		const pageContent = pageContentEl.current;
		if (!pageContent) return;
		const container = pageContent.lastElementChild?.firstElementChild;
		while (poppedScroll && container?.classList.contains("container")) { // Cheat `if` as `while` to use `break` in it.
			let child = container.children[poppedScroll.elementIndex] as HTMLElement | undefined;
			while (isElementContents(child))
				child = child!.firstElementChild as HTMLElement;
			if (isElementHidden(child) || !child) break;
			let { offsetY } = poppedScroll;
			if (child.offsetHeight < offsetY) offsetY = child.offsetHeight;
			child.scrollIntoView({ behavior: "instant" });
			pageContent.scrollBy({ top: offsetY, behavior: "instant" });
			return;
		}
		pageContent.scrollTo({ top: 0, left: 0, behavior: "instant" });
	};
	const navItemsId = useId();

	const currentNavItem = useMemo(() =>
		navItems.find(item => !("type" in item) && item.id === currentNavTab[0]) as NavItem,
	[currentNav, navItems]);
	titles ??= [{ name: currentNavItem?.text ?? "" }];

	const previousPageTitleKey = useRef<typeof pageTitleKey>(undefined);
	const pageTitleKey: [string, number] = [currentNavItem?.id ?? "", new Date().valueOf()];
	if (pageTitleKey[0] === previousPageTitleKey.current?.[0]) pageTitleKey[1] = previousPageTitleKey.current?.[1];
	previousPageTitleKey.current = pageTitleKey;

	const onNavButtonClick = () => responsive === "expanded" ?
		setIsExpandedInExpandedMode(expanded => !expanded) :
		setFlyoutDisplayMode(mode => mode === "expanded" ? "minimal" : "expanded");

	const hideFlyoutNavMenu = () => { flyoutDisplayMode !== "minimal" && setFlyoutDisplayMode("minimal"); };
	useEffect(hideFlyoutNavMenu, [currentNav, useWindowWidth()]);

	return (
		<StyledNavigationView $transitionName={transitionName} {...htmlAttrs}>
			<TopLeftButtons paneDisplayMode={paneDisplayMode} onNavButton={onNavButtonClick} onBack={onBack} canBack={canBack} />
			{forMap(2, i => {
				const isFlyout = !!i;
				return (
					<NavigationViewLeftPanel
						key={i}
						paneDisplayMode={isFlyout ? flyoutDisplayMode : paneDisplayMode}
						isFlyoutShown={flyoutDisplayMode !== "minimal"}
						currentNavTab={currentNavTab}
						navItems={navItems}
						navItemsId={navItemsId}
						customContent={customContent}
						flyout={isFlyout}
						isCompact={paneDisplayMode === "compact"}
					/>
				);
			})}
			<div
				className={[
					"right",
					"hairtail",
					{
						minimal: paneDisplayMode === "minimal",
					},
				]}
				onClick={hideFlyoutNavMenu}
			>
				<Attrs inert={flyoutDisplayMode !== "minimal"}>
					<div className="title-wrapper">
						<div className="title-wrapper-inner">
							<div>
								<TransitionGroup>
									<CssTransition key={pageTitleKey.join()}>
										<h1 className="title" role="navigation" aria-label="Breadcrumb">
											<TransitionGroup>
												{titles.flatMap((title, i, { length }) => {
													const last = i === length - 1;
													const crumb = (
														<div
															key={i}
															className={["crumb", { parent: !last }]}
															tabIndex={last ? -1 : 0}
															role="link"
															aria-current={last && "page"}
															onClick={() => title.link?.length && currentNav[1]?.(title.link)}
														>
															{title.name}
														</div>
													);
													const result = [crumb];
													if (!last) result.push(<BreadCrumbChevronRight key={i + "-chevron"} />);
													return result.map((node, j) =>
														<CssTransition key={i + "-" + j}>{node}</CssTransition>);
												})}
											</TransitionGroup>
										</h1>
									</CssTransition>
								</TransitionGroup>
							</div>
							<section className="command-bar">
								{commandBar}
							</section>
						</div>
					</div>
					<div className={["page-content", transitionName]} ref={pageContentEl} id={pageContentId}>
						<SwitchTransition mode={transitionName === "jump" ? "out-in" : "out-in-preload"}>
							<CssTransition key={pagePath} onEnter={scrollToTopOrPrevious} moreCoherentWhenCombo>
								<StyledPage>
									{children}
								</StyledPage>
							</CssTransition>
						</SwitchTransition>
					</div>
				</Attrs>
			</div>
		</StyledNavigationView>
	);
}
