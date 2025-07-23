const StyledPillButton = styled.button.attrs({
	type: "button",
})`
	${styles.mixins.oval()};
	${styles.effects.text.body};
	position: relative;
	display: flex;
	flex-shrink: 0;
	gap: 8px;
	align-items: center;
	min-block-size: 30px;
	margin: 1px;
	padding: 4px 11px;
	background-color: ${c("fill-color-control-quarternary")};
	outline: 1px solid ${c("stroke-color-control-stroke-default")};

	&:hover {
		background-color: ${c("fill-color-control-secondary")};
	}

	&:active {
		color: ${c("fill-color-text-secondary")};
		background-color: ${c("fill-color-control-secondary")};
	}

	&[disabled] {
		color: ${c("fill-color-text-disabled")};
		background-color: ${c("fill-color-control-disabled")};
	}

	&.selected {
		color: ${c("fill-color-text-on-accent-primary")};
		background-color: ${c("accent-color")};
		outline-color: ${c("accent-color")};

		&:hover {
			background-color: ${c("fill-color-accent-secondary")};
			outline-color: ${c("fill-color-accent-secondary")};
		}

		&:active {
			color: ${c("fill-color-text-on-accent-secondary")};
			background-color: ${c("fill-color-accent-tertiary")};
			outline-color: ${c("fill-color-accent-tertiary")};
		}

		&[disabled] {
			color: ${c("fill-color-text-on-accent-disabled")};
			background-color: ${c("fill-color-accent-disabled")};
			outline-color: ${c("fill-color-accent-disabled")};
		}
	}

	// Extend the click area, make the area outside the round corner also clickable.
	&::before {
		content: "";
		position: absolute;
		inset: -2.5px;
	}

	.icon {
		font-size: 16px;
	}

	> .badge {
		position: absolute;
		inset-block-start: -5px;
		inset-inline-end: -5px;
	}
`;

export /* @internal */ default function PillButton({ icon, id, selected, badge, children, className, ...htmlAttrs }: FCP<{
	/** Icon. */
	icon?: DeclaredIcons;
	/** Identifier. */
	id: string;
	/** Selected? */
	selected?: boolean;
	/** Badge. */
	badge?: Readable;
}, "button">) {
	const ariaId = useId();
	const pillEl = useDomRef<"button">();

	const scrollIntoView = (force = false) => {
		if (selected || force)
			pillEl.current?.scrollIntoView({ inline: "center", block: "nearest" });
	};
	useEffect(() => scrollIntoView(), [selected]);
	useKeyboardFocus(pillEl, () => scrollIntoView(true));

	return (
		<StyledPillButton
			ref={pillEl}
			className={[className, { selected }]}
			role="radio"
			aria-checked={selected}
			aria-labelledby={`${ariaId}-title`}
			{...htmlAttrs}
		>
			{icon && <Icon name={icon} />}
			<p id={`${id}-title`} className="title">{children}</p>
			{badge ? <Badge status="accent">{badge}</Badge> : undefined}
		</StyledPillButton>
	);
}
