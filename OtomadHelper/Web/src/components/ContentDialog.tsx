const Content = styled.div({});
const Title = styled.h2({});
const Body = styled.article({});
const ButtonGrid = styled.div({});

const StyledContentDialog = styled.div`
	--width: 500px;
	display: flex;
	flex-direction: column;
	min-width: min(var(--width), 100dvw);
	max-width: 100dvw;
	max-height: 100dvh;
	overflow: clip;
	background-color: ${c("background-fill-color-layer-alt-solid")};
	border-radius: 8px;
	outline: 1px solid ${c("stroke-color-surface-stroke-default")};
	box-shadow:
		0 32px 64px ${c("black", 19)},
		0 2px 21px ${c("black", 15)};

	${Content} {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 24px;
		overflow-y: auto;

		> * {
			${styles.mixins.hideIfEmpty()};
		}

		${Title} {
			${styles.effects.text.subtitle};
		}

		${Body} {
			${styles.effects.text.body};
			container: content-dialog-body / inline-size;

			> .container {
				${styledContainer}
			}

			.empty-message {
				margin-block: 20px 0;
			}
		}
	}

	${ButtonGrid} {
		${styles.mixins.hideIfEmpty()};
		display: flex;
		gap: 8px;
		align-items: center;
		width: 100%;
		padding: 24px;
		background-color: ${c("background-fill-color-solid-background-base")};
		border-block-start: 1px solid ${c("stroke-color-card-stroke-default")};

		> button {
			width: 100%;
		}
	}

	&.peek {
		background-color: color-mix(in srgb, ${c("background-fill-color-layer-alt")} 25%, ${c("background-fill-color-layer-alt-solid")} 75%);

		${ButtonGrid} {
			background-color: ${c("background-fill-color-acrylic-background-base")};
		}
	}
`;

const Mask = styled.div`
	${styles.mixins.gridCenter()};
	position: absolute;
	inset: 0;
	z-index: 30;
	background-color: ${c("background-fill-color-smoke-default")};
	backdrop-filter: grayscale(0.75);
	transition-timing-function: ${eases.easeOutMaterialStandard};

	${tgs()} {
		opacity: 0;

		${StyledContentDialog} {
			scale: 1.1;
		}
	}
`;

export default function ContentDialog({ shown: [shown, setShown], title, static: isStatic = false, children, buttons, autoTitleCase = true, width, peek, style, className, ...htmlAttrs }: FCP<{
	/** Show the content dialog? */
	shown: StateProperty<boolean>;
	/** Dialog title. */
	title?: string;
	/** Focus content dialog. Don't close it when click outside? */
	static?: boolean;
	/** Action buttons. Pass `null` indicates there is no action buttons. Defaults to close button only. */
	buttons?: ReactNode | ((close: () => void) => ReactNode) | null;
	/** Auto convert title to title case? @default true */
	autoTitleCase?: boolean;
	/** Set the preferred content dialog width. @default 500 */
	width?: Numberish;
	/**
	 * When true, if user places the mouse outside the content dialog, the dialog becomes translucent so that
	 * user can view the contents area obscured by the content dialog.
	 */
	peek?: boolean;
}, "div">) {
	const close = () => { setShown?.(false); };
	const closeWhenNonStatic = () => { !isStatic && close(); };
	if (autoTitleCase) title &&= title.toTitleCase();

	useEventListener(window, "keydown", e => e.code === "Escape" && closeWhenNonStatic());

	useRootInert(shown, ".content-dialog");

	return (
		<Portal>
			<CssTransition in={shown} unmountOnExit appear>
				<ClickOnSameElement bubbling={false} onClick={closeWhenNonStatic}>
					<Mask>
						<StyledContentDialog
							role="dialog"
							aria-label={title}
							aria-modal
							style={{ ...style, "--width": styles.toValue(width) }}
							className={[className, { peek }]}
							onClick={e => e.stopPropagation()}
							{...htmlAttrs}
						>
							<Content>
								<Title>{title}</Title>
								<Body>{children}</Body>
							</Content>
							<ButtonGrid>
								{
									typeof buttons === "function" ? buttons(close) :
									buttons === undefined ? <Button onClick={close}>{t.close}</Button> :
									buttons
								}
							</ButtonGrid>
						</StyledContentDialog>
					</Mask>
				</ClickOnSameElement>
			</CssTransition>
		</Portal>
	);
}
