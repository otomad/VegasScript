export const useWindowWidth = () => {
	const [width, setWidth] = useState(window.innerWidth);
	useEventListener(window, "resize", () => setWidth(window.innerWidth), undefined, [width]);
	return width;
};
