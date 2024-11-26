import ExpanderItem from "./ExpanderItem";

export const TRAILING_EXEMPTION = "trailing-exemption";

const ExpanderParent = styled(SettingsCard)<{
	/** Expanded? */
	$expanded?: boolean;
	/** Make expander child items disabled. */
	$childrenDisabled?: boolean;
}>`
	backdrop-filter: blur(4px);

	.check-info {
		${tgs()} {
			translate: 0 16px;
			opacity: 0;
		}

		&.enter-active {
			transition: ${fallbackTransitions}, translate ${eases.easeOutElastic} 1250ms;
		}
	}

	> .base > .trailing > .trailing-icon > * {
		${styles.mixins.enableHardware3d()};
	}

	&:not(:has(.trailing > :not(.${TRAILING_EXEMPTION}):active)):active > .base > .trailing > .trailing-icon > * {
		translate: 0 ${({ $expanded }) => $expanded ? 2 : -2}px;
	}

	${ifProp("$childrenDisabled", css`
		& > .base > .trailing > .trailing-icon > * {
			color: ${c("fill-color-text-disabled")};
			translate: 0 !important;
		}
	`)}

	${({ $expanded }) => {
		const sharpBottom = css`
			border-bottom-right-radius: 0;
			border-bottom-left-radius: 0;
		`;
		return $expanded && css`
			${sharpBottom};

			position: sticky;
			top: -1px;
			z-index: 5;

			> .base {
				${sharpBottom};

				> .trailing > .trailing-icon > * {
					rotate: 180deg;
				}
			}
		`;
	}}
`;

const ExpanderChild = styled.div`
	inline-size: 100%;
	border: 1px solid ${c("stroke-color-card-stroke-default")};
	border-top-width: 0;
	border-radius: 0 0 3px 3px;

	&:not(.enter-done) {
		overflow: clip;
	}

	.expander-child-items {
		background-color: ${c("background-fill-color-card-background-secondary")};
		border-radius: 0 0 2px 2px;

		> :not(:first-child) {
			border-top: 1px solid ${c("stroke-color-divider-stroke-default")};
		}
	}

	&[disabled] {
		opacity: ${c("disabled-text-opacity")};
	}

	${tgs()} {
		block-size: 0;
		border-bottom-width: 0;

		.expander-child-items {
			translate: 0 -100%;
		}
	}

	&,
	.expander-child-items {
		transition: ${fallbackTransitions}, block-size ${eases.easeInOutMaterialEmphasized} 350ms, translate ${eases.easeInOutMaterialEmphasized} 350ms;
	}
`;

const ExpanderChildWrapper = styled.div`
	padding: 7px 51px; // 7px 38px

	&:has(.slider) {
		padding: 21px 52px;
	}

	&:has(.timecode-box) {
		--layout: inline;
	}
`;

export default function Expander({ icon, title, details, actions, expanded = false, children, checkInfo, alwaysShowCheckInfo, clipChildren, childrenDisabled, selectInfo, selectValid, disabled, className, onClickWhenChildrenDisabled }: FCP<PropsOf<typeof SettingsCard> & {
	/** The other action control area on the right side of the component. */
	actions?: ReactNode;
	/** Expanded initially? */
	expanded?: boolean;
	/** The text that displays the selected status of a radio button or checkbox in the expander, which is only displayed when the expander is closed. */
	checkInfo?: Readable;
	/** Regardless of whether the expander is on or off, the selected display text is always displayed. */
	alwaysShowCheckInfo?: boolean;
	/** Make sure expander children won't exceed the area. */
	clipChildren?: boolean;
	/** Make expander child items disabled. */
	childrenDisabled?: boolean;
	/** Occurs when the expander parent has been clicked where the child items disabled. */
	onClickWhenChildrenDisabled?(): void;
}>) {
	const settingsCardProps = { icon, title, details, selectInfo, selectValid, disabled, className };
	const lockExpanderParentContentSizeTimeoutId = useRef<Timeout>();
	const [lockExpanderParentContentSize, setLockExpanderParentContentSize] = useState(false);
	const [internalExpanded, _setInternalExpanded] = useState(expanded);
	const setInternalExpanded: typeof _setInternalExpanded = expanded => void (async () => {
		clearTimeout(lockExpanderParentContentSizeTimeoutId.current);
		setLockExpanderParentContentSize(true);
		await delay(0);
		_setInternalExpanded(expanded);
		await delay(251, lockExpanderParentContentSizeTimeoutId);
		setLockExpanderParentContentSize(false);
	})();
	const resetLockExpanderParentContentSize = () => {
		clearTimeout(lockExpanderParentContentSizeTimeoutId.current);
		setLockExpanderParentContentSize(false);
	};
	const handleClick = useOnNestedButtonClick(() => !childrenDisabled ? setInternalExpanded(expanded => !expanded) : onClickWhenChildrenDisabled?.());
	useUpdateEffect(() => setInternalExpanded(expanded), [expanded]);
	useEffect(() => { if (disabled || childrenDisabled) _setInternalExpanded(false); }, [disabled, childrenDisabled]);

	return (
		<div className="expander">
			<ExpanderParent
				{...settingsCardProps}
				type={childrenDisabled ? onClickWhenChildrenDisabled ? "button" : "container-but-button" : "expander"}
				trailingIcon="chevron_down"
				onClick={handleClick}
				$expanded={internalExpanded}
				$childrenDisabled={childrenDisabled}
				_lockContentSize={lockExpanderParentContentSize}
			>
				{actions}
				{checkInfo != null && (
					<CssTransition
						in={!internalExpanded || alwaysShowCheckInfo}
						onEntered={() => resetLockExpanderParentContentSize()}
						onExited={() => resetLockExpanderParentContentSize()}
						moreCoherentWhenCombo
						hiddenOnExit
					>
						<div className={["check-info", TRAILING_EXEMPTION]}>{checkInfo}</div>
					</CssTransition>
				)}
			</ExpanderParent>
			<CssTransition in={internalExpanded} unmountOnExit>
				<ExpanderChild disabled={disabled || childrenDisabled} className={{ clipChildren }}>
					<div className="expander-child-items">
						{children}
					</div>
				</ExpanderChild>
			</CssTransition>
		</div>
	);
}

Expander.Item = ExpanderItem;
Expander.ChildWrapper = ExpanderChildWrapper;
