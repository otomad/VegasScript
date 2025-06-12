import type { StickyDetectionMethod } from "hooks/sticky";

/**
 * Auto toggles classname (defaults to "sticky") when `position: sticky` is triggered.
 */
export default function StickyPerceptibility({ token = "sticky", method, children, ref }: FCP<{
	/** Custom class name used when sticking. Defaults to `"sticky"`. */
	token?: string;
	/** Detection method. */
	method: StickyDetectionMethod;
}, "section">) {
	const el = useDomRef<"section">();
	useImperativeHandleRef(ref, el);

	const sticky = useIsSticky(el, method);

	return cloneRef(children, el, ({ className }) => ({ className: classNames(className, { [token]: sticky }) }));
}
