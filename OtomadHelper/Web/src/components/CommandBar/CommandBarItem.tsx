import { transitionPropKeys } from "react-transition-group-fc";
import { CommandBarAnchorContext } from "./CommandBar";

const HIDE_DELAY = 500;

const $p = (test?: boolean) => test ? "true" : undefined;

export /* @internal */ function CommandBarItem({ icon, caption, altCaption, details, iconOnly, children, canBeDisabled, disabled, hovering, on, onClick, onKeyDown, ...buttonAndTransitionAttrs }: FCP<{
	/** Button icon. */
	icon?: DeclaredIcons;
	/** Caption. */
	caption?: ReactNode;
	/** Alternate caption. */
	altCaption?: ReactNode;
	/** Detailed description. */
	details?: ReactNode;
	/** Hide the caption and show the icon only? */
	iconOnly?: boolean;
	/** Can be disabled? */
	canBeDisabled?: boolean;
	/** Open flyout by hovering instead of clicking. */
	hovering?: boolean;
	/** Use as a toggle button. */
	on?: boolean | StatePropertyNonNull<boolean>;
}, "section"> & TransitionProps) {
	const { transitionAttrs, htmlAttrs } = separateTransitionAttrs(buttonAndTransitionAttrs);
	const { anchorName: commandBarAnchorName, position, tooNarrow } = useContext(CommandBarAnchorContext);
	if (!caption) iconOnly = true;
	const anchorName = useUniqueId("--command-bar-item");
	const [flyoutShown, setFlyoutShown] = useState(false);
	const hideTimeout = useRef<Timeout>(undefined);
	const showFlyout = () => { clearTimeout(hideTimeout.current); if (children) { useEvent("app:hideOtherFlyouts", anchorName); setFlyoutShown(true); } };
	const hideFlyoutLater = () => { hideTimeout.current = setTimeout(() => setFlyoutShown(false), HIDE_DELAY); };
	useListen("app:hideOtherFlyouts", exceptId => { if (exceptId !== anchorName) { clearTimeout(hideTimeout.current); setFlyoutShown(false); } });
	const [isMouse, _setIsMouse] = useState(true);
	const checkIsMouse = (e: PointerEvent) => { const result = e.pointerType === "mouse"; _setIsMouse(result); return result; };
	let setOn: SetStateNarrow<boolean> | undefined;
	if (Array.isArray(on)) { setOn = on[1]; on = on[0]; }
	const buttonEl = useDomRef<"button">();

	useOnFormKeyDown(buttonEl, { parent: ".command-bar", item: ".command-bar-item", focus: "button", disableUpDown: true });

	const tooltip = iconOnly || altCaption ? <Tooltip.Content title={caption}>{details}</Tooltip.Content> : details;
	const button = (
		<ClickOnSameElement
			onClick={e => { if (hovering && checkIsMouse(e) || !children) { onClick?.(e); setOn?.(on => !on); } showFlyout(); }}
		>
			<ToggleButton
				ref={buttonEl}
				checked={[on]}
				icon={icon}
				disabled={disabled}
				aria-label={canToString(caption) ? caption : undefined}
				aria-description={canToString(details) ? details : undefined}
				aria-haspopup={!!children}
				ariaHiddenForChildren
				onPointerEnter={e => { if (hovering && checkIsMouse(e)) showFlyout(); }}
				onPointerLeave={e => { if (hovering && checkIsMouse(e)) hideFlyoutLater(); }}
				{...htmlAttrs}
			>
				{altCaption || caption}
			</ToggleButton>
		</ClickOnSameElement>
	);

	return (
		<Tooltip title={tooltip} placement="y" disabled={hovering} applyAriaLabel={false}>
			<CssTransition {...transitionAttrs} requestAnimationFrame>
				<div className="command-bar-item" style={{ anchorName, "--icon-only": $p(iconOnly), "--too-narrow": $p(tooNarrow) }}>
					{!canBeDisabled ? button : (
						<DisabledButtonWrapper key="complete" disabled={disabled} onClick={onClick}>
							{button}
						</DisabledButtonWrapper>
					)}
					{children && (
						<Flyout
							shown={[flyoutShown, setFlyoutShown]}
							anchorName={anchorName}
							position="bottom"
							autoInert={!(hovering && isMouse)}
							target={buttonEl}
							_commandBarAnchorName={commandBarAnchorName}
							_horizontalPosition={position}
							onPointerEnter={e => { if (hovering && checkIsMouse(e)) showFlyout(); }}
							onPointerLeave={e => { if (hovering && checkIsMouse(e)) hideFlyoutLater(); }}
						>
							{(hovering || !isMouse) && (
								<>
									<div className="descriptions">
										{(iconOnly || altCaption || tooNarrow) && <h6>{caption}</h6>}
										<p>{details}</p>
									</div>
									<hr />
								</>
							)}
							{children}
						</Flyout>
					)}
				</div>
			</CssTransition>
		</Tooltip>
	);
}

function separateTransitionAttrs(buttonAndTransitionAttrs: object) {
	type HTMLElementAttrs = FCP<{}, "button">;
	const transitionAttrs: TransitionProps = {}, htmlAttrs: HTMLElementAttrs = {};
	for (const [key, value] of entries(buttonAndTransitionAttrs))
		if (transitionPropKeys.includes(key)) transitionAttrs[key] = value;
		else htmlAttrs[key] = value;
	return { transitionAttrs, htmlAttrs };
}
