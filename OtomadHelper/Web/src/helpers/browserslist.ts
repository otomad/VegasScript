export function doesBrowserSupportACertainFeature() {
	return [
		CSS.supports("interpolate-size: allow-keywords"),
	].every(Boolean);
}

export function getBrowserName() {
	const userAgent = navigator.userAgent;
	if (userAgent.includes("Edg"))
		return "Microsoft Edge";
	else if (userAgent.includes("Chrome"))
		return "Google Chrome";
	else if (userAgent.includes("Firefox"))
		return "Mozilla Firefox";
	else if (userAgent.includes("Safari"))
		return "Apple Safari";
	else if (userAgent.includes("Opera"))
		return "Opera";
	else if (userAgent.includes("Trident") || userAgent.includes("MSIE"))
		return "Internet Explorer";
}
