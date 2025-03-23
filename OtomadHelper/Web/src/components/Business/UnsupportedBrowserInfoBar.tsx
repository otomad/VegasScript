import { doesBrowserSupportACertainFeature, getBrowserName } from "helpers/browserslist";

const HEIGHT = 48;

const StyledUnsupportedBrowserInfoBar = styled(InfoBar).attrs({
	status: "error",
})`
	block-size: ${HEIGHT}px;
	border: none;
	border-radius: none;
`;

export default function UnsupportedBrowserInfoBar() {
	const browserName = useMemo(() => getBrowserName(), []);
	const isBrowserSupported = useMemo(() => doesBrowserSupportACertainFeature(), []);

	return !isBrowserSupported && <StyledUnsupportedBrowserInfoBar title={t.descriptions.unsupportedBrowser({ browser: browserName })} />;
}

UnsupportedBrowserInfoBar.height = HEIGHT;
