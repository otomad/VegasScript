const filters = proxyMap<string, ReactNode>();

function SvgFilterPortal() {
	return (
		<Portal container={document.body}>
			<svg width={0} height={0}>
				<defs>
					{filters.entries().map(([id, filter]) => <filter key={id} id={id}>{filter}</filter>)}
				</defs>
			</svg>
		</Portal>
	);
}

export default function DefineSvgFilter({ id, children }: PropsWithChildren<{
	/** Globally unique identifier. */
	id: string;
}>) {
	useEffect(() => {
		if (children == null) return;
		filters.set(id, children);
	}, [children]);
}

DefineSvgFilter.Portal = SvgFilterPortal;
