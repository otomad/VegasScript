import "virtual:svg-icons-register";

const squared = styles.mixins.square("1em");
const StyledIcon = styled.i<{
	/** Keep the color of the icon itself? */
	$filled?: boolean;
}>`
	${squared};
	${styles.mixins.flexCenter()};
	display: inline-flex;

	:where(&) {
		${styles.effects.text.icon};
	}

	svg {
		${squared};

		${({ $filled }) => !$filled && css`
			fill: currentColor;
		`}
	}
`;

export const getIconSymbolId = (name: string) => "#icon-" + name.replaceAll("/", "-");
export const getIconAriaLabel = (name: string) => "Icon - " + name.replace(/^off_slash_correction\//, "").replaceAll("_", " ").replaceAll("/", ": ");

function Icon(props: FCP<{
	/** Icon file name. */
	name: DeclaredIcons | "" | boolean;
	/** Keep the color of the icon itself? */
	filled?: boolean;
	children?: never;
}, "i">, ref: ForwardedRef<"i">): JSX.Element;
function Icon(props: FCP<{
	/** Hold the place, but nothing shown? */
	shadow: boolean;
	children?: never;
}, "i">, ref: ForwardedRef<"i">): JSX.Element;
function Icon({ name, filled, shadow, className, ...htmlAttrs }: FCP<{
	/**
	 * Icon file name.
	 * - If it is a boolean, it will be disguised as a (fake) icon element, but the content will be empty.
	 * - If it is an empty string or undefined, it will return nothing.
	 */
	name?: DeclaredIcons | "" | boolean;
	/** Keep the color of the icon itself? */
	filled?: boolean;
	/** Hold the place, but nothing shown? */
	shadow?: boolean;
}, "i">, ref: ForwardedRef<"i">) {
	if (shadow) return <StyledIcon className={["shadow", className]} {...htmlAttrs} ref={ref} />;

	if (typeof name === "boolean") return <i hidden className={className} {...htmlAttrs} ref={ref} />;
	if (!name) return;

	const symbolId = getIconSymbolId(name);
	const ariaLabel = getIconAriaLabel(name);

	return (
		<StyledIcon
			$filled={filled}
			className={className}
			{...htmlAttrs}
			ref={ref}
			role="img"
			aria-label={ariaLabel}
			aria-hidden
		>
			<svg aria-hidden>
				<use href={symbolId} />
			</svg>
		</StyledIcon>
	);
}

export default forwardRef(Icon) as unknown as typeof Icon; // The `forwardRef` doesn't support overload function.
