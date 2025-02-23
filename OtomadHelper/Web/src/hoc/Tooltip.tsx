/** Only used for debugging during development, please ensure to be `false` in production. */
const DEBUG_MODE = false;

const StyledTooltip = styled.div<{
	/** Tooltip offset (animation only). */
	$offset: number;
}>`
	${styles.mixins.square("0")};
	position: fixed;
	z-index: 80;
	display: flex;
	transition: ${fallbackTransitions}, left 0s, top 0s;
	${!DEBUG_MODE && css`pointer-events: none;`};

	.base {
		flex-shrink: 0;
		max-width: 50dvw;
		height: max-content;
		padding: 6px 8px;
		overflow: clip;
		word-wrap: break-word;
		overflow-wrap: break-word;
		background-color: ${c("background-fill-color-acrylic-background-default")};
		border-radius: 4px;
		outline: 1px solid ${c("stroke-color-surface-stroke-flyout")};
		box-shadow: 0 4px 8px ${c("shadows-flyout")};
		backdrop-filter: blur(60px);

		&:has(.tooltip-content) {
			padding: 0;
			border-radius: 7px;
		}
	}

	${tgs()} {
		.base {
			opacity: 0;
		}

		${({ $offset }) => css`
			&.top {
				translate: 0 ${$offset}px;
			}

			&.bottom {
				translate: 0 ${-$offset}px;
			}

			&.right {
				translate: ${-$offset}px;
			}

			&.left {
				translate: ${$offset}px;
			}
		`}
	}

	&.top {
		justify-content: center;
		align-items: flex-end;
	}

	&.bottom {
		justify-content: center;
		align-items: flex-start;
	}

	&.right {
		justify-content: flex-start;
		align-items: center;

		&:dir(rtl) {
			justify-content: flex-end;
		}
	}

	&.left {
		justify-content: flex-end;
		align-items: center;

		&:dir(rtl) {
			justify-content: flex-start;
		}
	}
`;

// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
const canToString = (test: Object | undefined | null): test is string => !!test && !test.toString().match(/^\[object .*\]$/);

export default function Tooltip({ title, placement, offset = 10, timeout = 500, disabled = false, applyAriaLabel = true, unwrapped, children, ref }: FCP<{
	/** Tooltip content. */
	title: ReactNode;
	/** Tooltip placement. */
	placement?: Placement;
	/** Tooltip offset. */
	offset?: number;
	/** Delayed display time. */
	timeout?: number;
	/** Do not show the tooltip? */
	disabled?: boolean;
	/** Auto apply the tooltip title to aria label attribute of the target element? Defaults to true. */
	applyAriaLabel?: boolean;
	/** Do not wrap the child with a child wrapper. Please ensure that your child is exactly one element and forward the ref correctly. */
	unwrapped?: boolean;
	ref?: ForwardedRef<"section">;
}>) {
	const [shown, setShown] = useState(false);
	const [contentsEl, setContentsEl] = useDomRefState<"div">(); // Use state instead of ref to make sure change it to rerender.
	const tooltipEl = useDomRef<"div">();
	const [actualPlacement, setActualPlacement] = useState(placement);
	const [position, setPosition] = useState<CSSProperties>();
	const shownTimeout = useRef<Timeout>(undefined);

	useImperativeHandle(ref, () => contentsEl!);

	const dom = useMemo(() => {
		let dom = contentsEl?.firstElementChild;
		while (dom && (getComputedStyle(dom).display === "contents" || dom.classList.contains("expander")))
			dom = dom.firstElementChild;
		return dom as HTMLElement | null;
	}, [contentsEl]);

	useEffect(() => {
		if (dom && title && applyAriaLabel) {
			if (canToString(title)) dom.ariaLabel = title.toString();
			if (isReactInstance(title, TooltipContent)) {
				if (canToString(title.props.title)) dom.ariaLabel = title.props.title.toString();
				if (canToString(title.props.children)) dom.ariaDescription = title.props.children.toString();
			}
		}
	}, [dom, title, applyAriaLabel]);

	const handleHover = (e: MouseEvent) => {
		clearTimeout(shownTimeout.current);
		if (!dom || !isInPath(e, dom)) return;
		shownTimeout.current = setTimeout(async () => {
			if (!dom) return;
			const options = getPosition(dom, placement, offset);
			setActualPlacement(options.placement);
			setPosition(options.style);
			setShown(true);
			await nextAnimationTick();
			const tooltip = tooltipEl.current;
			if (!tooltip) return;
			setPosition(moveIntoPage(tooltip, tooltip.parentElement!));
		}, timeout);
	};

	const handleUnhover = () => {
		clearTimeout(shownTimeout.current);
		if (DEBUG_MODE) return;
		setShown(false);
	};

	useEventListener(dom, "mouseenter", handleHover, undefined, [contentsEl, title, placement, offset, timeout, disabled, children]);
	useEventListener(dom, "mouseleave", handleUnhover, undefined, [contentsEl]);
	useEventListener(dom, "click", handleUnhover, undefined, [contentsEl]);
	useEventListener(window, "keydown", e => e.code === "Escape" && handleUnhover(), undefined, [contentsEl]);

	return (
		<>
			{!unwrapped ? (
				<Contents className="tooltip-child-wrapper" ref={setContentsEl}>
					{children}
				</Contents>
			) : takeoverRef(children, setContentsEl)}
			{!disabled && title && (
				<Portal>
					<CssTransition in={shown} unmountOnExit>
						<StyledTooltip role="tooltip" $offset={offset} className={actualPlacement} style={position}>
							<div className="base" ref={tooltipEl}>
								{title}
							</div>
						</StyledTooltip>
					</CssTransition>
				</Portal>
			)}
		</>
	);
}

const StyledTooltipContent = styled.figure`
	display: flex;
	flex-direction: column;

	img {
		max-width: 250px;
	}

	figcaption {
		${styles.effects.text.body}
		padding-block: 7px 9px;
		padding-inline: 12px;

		h6 {
			${styles.effects.text.bodyStrong}
		}
	}

	:only-child > img {
		margin: 0 -2px;
	}
`;

function TooltipContent({ image, title, children, ...htmlAttrs }: FCP<{
	/** Image. */
	image?: string;
	/** Title. */
	title?: ReactNode;
}, "figure">) {
	return (
		<StyledTooltipContent {...htmlAttrs}>
			{image && <Img src={image} />}
			{(title || children) && (
				<figcaption>
					{title && <h6>{title}</h6>}
					{children}
				</figcaption>
			)}
		</StyledTooltipContent>
	);
}

type TooltipProps = Parameters<typeof Tooltip>[0];

function TooltipWith(withProps: Partial<TooltipProps>) {
	// eslint-disable-next-line react/display-name
	return (props: TooltipProps) => <Tooltip {...withProps} {...props} />;
}

function TooltipWrap(component: ReactElement | React.ExoticComponent, tooltipProps: Partial<TooltipProps>) {
	const Component = component as unknown as FC;
	return function TooltipWrappedComponent({ title, ...props }: AnyObject) {
		const newTooltipProps = Object.assign({}, tooltipProps, title && { title }) as TooltipProps;
		return (
			<Tooltip {...newTooltipProps}>
				<Component {...props} />
			</Tooltip>
		);
	};
}

Tooltip.Content = TooltipContent;
Tooltip.with = TooltipWith;
Tooltip.wrap = TooltipWrap;
