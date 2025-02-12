import { DoesBrowserSupportACertainFeature, getBrowserName } from "helpers/browserslist";
import { changeColorScheme } from "helpers/color-mode";
import DynamicAccentColor from "styles/accent";
import GlobalStyle from "styles/global";
import ShellPage from "./ShellPage";

export default function App() {
	const [ready, setReady] = useState(false);

	useMountEffect(() => {
		delay(100).then(() => setReady(true));
		document.documentElement.style.removeProperty("background-color");
		changeColorScheme(undefined, undefined, undefined, "refresh");
	});

	const { i18n } = useTranslation();
	const forceUpdate = useForceUpdate();
	i18n.on("languageChanged", forceUpdate);

	const browserName = useMemo(() => getBrowserName(), []);
	const isBrowserSupported = useMemo(() => DoesBrowserSupportACertainFeature(), []);

	return (
		<>
			<BackgroundImage />
			<GlobalStyle $ready={ready} />
			<DynamicAccentColor />
			{!isBrowserSupported && <InfoBar status="error" title={t.descriptions.unsupportedBrowser({ browser: browserName })} />}
			<ShellPage />
			<DevContextMenu />
			<Toast />
			<DefineSvgFilter.Portal />
			<div id="portals" />
			<meta name="description" content={t.descriptions.settings.about} />
		</>
	);
}
