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

	const tooltip = !iconOnly ? details : <Tooltip.Content title={caption}>{details}</Tooltip.Content>;

	const button = (
		<Button
			icon={icon}
			subtle="small-icon"
			disabled={disabled}
			minWidthUnbounded={iconOnly}
			onClick={onClick}
			{...htmlAttrs}
		>
			{!iconOnly && caption}
		</Button>
	);

	return (
		<Tooltip title={tooltip} placement="y" unwrapped>
			<CssTransition {...transitionAttrs}>
				<div className="command-bar-item">
					{!canBeDisabled ? button : (
						<DisabledButtonWrapper key="complete" disabled={disabled} onClick={onClick}>
							{button}
						</DisabledButtonWrapper>
					)}
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
