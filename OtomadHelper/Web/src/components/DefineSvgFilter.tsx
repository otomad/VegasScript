const filters = proxyMap<string, [FCP<{}, "filter">, ReactNode]>();

function SvgFilterPortal() {
	const snapFilters = useSnapshot(filters);

	return (
		<Portal container={document.body}>
			<svg id="svg-filters" width={0} height={0}>
				<defs>
					{Map.prototype.map.call(snapFilters, (id, [svgAttrs, filter]) => <filter key={id} id={id} {...svgAttrs}>{filter}</filter>)}
				</defs>
			</svg>
		</Portal>
	);
}

export default function DefineSvgFilter({ id, children, ...svgAttrs }: FCP<{
	/** Globally unique identifier. */
	id: string;
}, "filter">): undefined {
	useEffect(() => {
		if (children == null) return;
		filters.set(id, [svgAttrs, children]);
	}, [children]);
}

DefineSvgFilter.Portal = SvgFilterPortal;
