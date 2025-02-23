import { CommandBarAnchorContext } from "./CommandBar";

export /* @internal */ function CommandBarItem({ icon, caption, details, iconOnly, children, canBeDisabled, disabled, onClick, ...buttonAndTransitionAttrs }: FCP<{
	/** Button icon. */
	icon?: DeclaredIcons;
	/** Caption. */
	caption?: ReactNode;
	/** Detailed description. */
	details?: ReactNode;
	/** Hide the caption and show the icon only? */
	iconOnly?: boolean;
	/** Can be disabled? */
	canBeDisabled?: boolean;
}, "section"> & TransitionProps) {
	const { transitionAttrs, htmlAttrs } = separateTransitionAttrs(buttonAndTransitionAttrs);
	if (!caption) iconOnly = true;
	const [showFlyout, setShowFlyout] = useState(false);
	const anchorName = useUniqueId("--command-bar-item");
	const { anchorName: commandBarAnchorName, position } = useContext(CommandBarAnchorContext);
	const tooltip = !iconOnly ? details : <Tooltip.Content title={caption}>{details}</Tooltip.Content>;
	const button = (
		<Button
			icon={icon}
			subtle="small-icon"
			disabled={disabled}
			minWidthUnbounded={iconOnly}
			onClick={e => { onClick?.(e); if (children) setShowFlyout(true); }}
			{...htmlAttrs}
		>
			{!iconOnly && caption}
		</Button>
	);

	return (
		<Tooltip title={tooltip} placement="y">
			<CssTransition {...transitionAttrs}>
				<div className="command-bar-item" style={{ anchorName }}>
					{!canBeDisabled ? button : (
						<DisabledButtonWrapper key="complete" disabled={disabled} onClick={onClick}>
							{button}
						</DisabledButtonWrapper>
					)}
					{children && <Flyout shown={[showFlyout, setShowFlyout]} anchorName={anchorName} position="bottom" _commandBarAnchorName={commandBarAnchorName} _horizontalPosition={position}>{children}</Flyout>}
				</div>
			</CssTransition>
		</Tooltip>
	);
}

function separateTransitionAttrs(buttonAndTransitionAttrs: object) {
	type HTMLElementAttrs = FCP<{}, "button">;
	const transitionAttrKeys = ["in", "mountOnEnter", "unmountOnExit", "onEnter", "onEntering", "onEntered", "onExit", "onExiting", "onExited", "nodeRef"];
	const transitionAttrs: TransitionProps = {}, htmlAttrs: HTMLElementAttrs = {};
	for (const [key, value] of entries(buttonAndTransitionAttrs))
		if (transitionAttrKeys.includes(key)) transitionAttrs[key] = value;
		else htmlAttrs[key] = value;
	return { transitionAttrs, htmlAttrs };
}
