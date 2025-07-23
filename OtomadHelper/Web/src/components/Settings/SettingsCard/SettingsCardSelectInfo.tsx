const StyledSettingsCardSelectInfo = styled.p`
	color: ${c("accent-color")} !important;

	&.invalid {
		color: ${c("fill-color-system-critical")} !important;
	}

	.badge {
		--size: 12px;
		margin-inline-end: 5px;
	}

	&:not(.invalid) .badge {
		background-color: ${c("accent-color")};
	}
`;

export /* @internal */ default function SettingsCardSelectInfo({ valid = true, children, ...htmlAttrs }: FCP<{
	/** Specifies whether the selection is valid if it's boolean, or the number of selection is not 0 if it's number. */
	valid?: boolean | number;
}, "p">) {
	return children && (
		<StyledSettingsCardSelectInfo {...htmlAttrs} className={["details", "select-info", { invalid: !valid }]}>
			<Badge status={valid ? "success" : "error"} colorOverride={valid ? "asterisk" : "error"} transitionOnAppear={false} />
			<Preserves>{children}</Preserves>
		</StyledSettingsCardSelectInfo>
	);
}
