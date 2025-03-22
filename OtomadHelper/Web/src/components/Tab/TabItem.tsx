const StyledTabItemWrapper = styled.div`
	.tab-bar.vertical & {
		padding: 1.5px 5px;
	}
`;

const StyledTabItem = styled.button`
	position: relative;
	display: flex;
	align-items: center;
	min-block-size: 30px;
	inline-size: -webkit-fill-available;
	inline-size: -moz-available;
	inline-size: fill-available;
	overflow-x: hidden;
	border-radius: 3px;

	.tab-bar.vertical & {
		gap: 16px;
		padding-block: 9px 11px;
		padding-inline: 16px 12px;

		&:hover,
		&.selected {
			background-color: ${c("fill-color-subtle-secondary")};

			${ifColorScheme.contrast} & {
				background-color: ${cc("Highlight")} !important;

				* {
					color: ${cc("HighlightText")} !important;
					forced-color-adjust: none;
				}

				.badge {
					background-color: ${cc("HighlightText")};
					outline: 1px solid ${cc("Highlight")};

					&,
					* {
						color: ${cc("Highlight")} !important;
					}
				}
			}
		}

		&:not(.selected):active,
		&.selected:not(:active):hover {
			background-color: ${c("fill-color-subtle-tertiary")};
		}

		&:active > * {
			opacity: ${c("pressed-text-opacity")};
		}
	}

	.icon,
	.animated-icon {
		display: flex;
		margin-bottom: -1px;
	}

	.animated-icon {
		&,
		* {
			color: ${c("fill-color-text-primary-solid")};
		}
	}

	.text {
		line-height: 20px;
		white-space: nowrap;
	}

	.fill {
		inline-size: 100%;
		text-align: start;
	}

	.badge-wrapper {
		position: relative;

		.badge {
			position: absolute;
			inset-block-start: 0;
			inset-inline-end: 0;
			translate: 50% -50%;

			&:dir(rtl) {
				translate: -50% -50%;
			}
		}
	}

	.badge-wrapper-adjust-beacon {
		${styles.mixins.gridCenter()};
		min-inline-size: 16px;
	}

	.tab-bar.horizontal & {
		gap: 8px;
		padding: 14px 12px;

		&:hover {
			color: ${c("fill-color-text-secondary")};
		}

		&:active {
			color: ${c("fill-color-text-tertiary")};
		}
	}

	&:active .animated-icon {
		--state: pressed;
	}

	&.selected .animated-icon {
		--selected: true;
	}

	&.selected {
		${styles.effects.text.bodyStrong};
	}
`;

const BadgeItem = ({ hidden: layoutHidden, badge: [badge, status, hidden] = [false] as never }: { hidden?: boolean; badge?: BadgeArgs }) =>
	<Badge status={status ?? "accent"} hidden={hidden || layoutHidden}>{badge}</Badge>;

export /* @internal */ default function TabItem({ icon, animatedIcon, children, selected = false, collapsed, id: _id, focusable = true, badge, ariaCurrentWhenSelected, _vertical: vertical, ...htmlAttrs }: FCP<{
	/** Icon. */
	icon?: DeclaredIcons;
	/** Animated icon. */
	animatedIcon?: DeclaredLotties;
	/** Identifier. */
	id: string;
	/** Selected? */
	selected?: boolean;
	/** Hide the text label and only show the icon? */
	collapsed?: boolean;
	/** Can be focused? */
	focusable?: boolean;
	/** Badge. */
	badge?: BadgeArgs;
	/** Set the `aria-current` attribute only when the tab item has been selected. */
	ariaCurrentWhenSelected?: React.AriaAttributes["aria-current"];
	/** @private Use the vertical NavigationView style? */
	_vertical?: boolean;
}, GenericElement>) {
	const tabItemEl = useDomRef<"button">();

	const scrollIntoView = () => {
		if (selected)
			tabItemEl.current?.scrollIntoViewIfNeeded();
	};

	useEffect(() => scrollIntoView(), [selected]);

	return (
		<Tooltip placement="right" offset={5} disabled={!collapsed} title={children} applyAriaLabel={false}>
			<StyledTabItemWrapper {...htmlAttrs}>
				<StyledTabItem
					type="button"
					ref={tabItemEl}
					tabIndex={focusable ? 0 : -1}
					role="tab"
					aria-selected={selected}
					aria-current={selected ? ariaCurrentWhenSelected : undefined}
					{...htmlAttrs}
					className={{ selected }}
				>
					{(icon || animatedIcon) && (
						<div className="badge-wrapper">
							{icon && !animatedIcon && <Icon name={icon} />}
							{animatedIcon && <AnimatedIcon name={animatedIcon} />}
							<BadgeItem hidden={!(vertical && collapsed)} badge={badge} />
						</div>
					)}
					<div className="badge-wrapper fill">
						<div className="text">{children}</div>
						{!vertical && <BadgeItem badge={badge} />}
					</div>
					{vertical && (
						<div className="badge-wrapper-adjust-beacon">
							<BadgeItem badge={badge} />
						</div>
					)}
				</StyledTabItem>
			</StyledTabItemWrapper>
		</Tooltip>
	);
}
