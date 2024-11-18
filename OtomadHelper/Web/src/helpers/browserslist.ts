export function DoesBrowserSupportACertainFeature() {
	return [
		CSS.supports("interpolate-size: allow-keywords"),
	].every(item => item);
}

export function getBrowserName() {
	const userAgent = navigator.userAgent;
	if (userAgent.includes("Edg"))
		return "Microsoft Edge";
	else if (userAgent.includes("Chrome"))
		return "Chrome";
	else if (userAgent.includes("Firefox"))
		return "Firefox";
	else if (userAgent.includes("Safari"))
		return "Safari";
	else if (userAgent.includes("Opera"))
		return "Opera";
	else if (userAgent.includes("Trident") || userAgent.includes("MSIE"))
		return "Internet Explorer";
}
