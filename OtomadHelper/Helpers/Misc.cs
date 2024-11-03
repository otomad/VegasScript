using System.Net;

namespace OtomadHelper.Helpers;

public static class Misc {
	/// <summary>
	/// Open an Internet website link with the default browser.
	/// </summary>
	/// <remarks>
	/// If the link is invalid here (unfortunately when the link contains "?" or "=" will be invalid),
	/// it will unexpected open the explorer.
	/// </remarks>
	/// <param name="link">Internet website link.</param>
	public static void OpenLink(string link) {
		link = "\"" + link.Replace("\"", "\"\"") + "\""; // Escape the double quotes
		Process.Start("explorer.exe", link);
	}

	public static void RunCmdBackground(string command, bool waitForExit = false) {
		ProcessStartInfo processStartInfo = new("cmd.exe", " /c " + command) {
			CreateNoWindow = true,
			UseShellExecute = false,
		};
		Process process = Process.Start(processStartInfo); // still crash, don't know why.
		if (waitForExit) process.WaitForExit();
	}

	/// <summary>
	/// Enumerate an <see cref="Enum" /> type.
	/// </summary>
	/// <typeparam name="TEnum"><see cref="Enum" /></typeparam>
	/// <returns>An array of <see cref="Enum" />.</returns>
	/// <exception cref="ArgumentException">Throw if <typeparamref name="TEnum" /> is not an enumerated type.</exception>
	public static TEnum[] EnumerateEnum<TEnum>() where TEnum : Enum {
		Type type = typeof(TEnum);
		if (!typeof(TEnum).IsEnum)
			throw new ArgumentException($"{type} must be an enumerated type");
		return (TEnum[])Enum.GetValues(type);
	}

	private static readonly string DEFAULT_USER_AGENT =
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0";

	/// <summary>
	/// Get the web page source code.
	/// </summary>
	/// <param name="url">URL link.</param>
	/// <param name="userAgent">Custom the navigator user agent.</param>
	/// <returns>Web page source code content.</returns>
	public static string? GetHtml(string url, string? userAgent = null) {
		try {
			byte[]? text = GetHtmlBytes(url, userAgent); // Get the web page source code.
			return text is null ? null : Encoding.GetEncoding("UTF-8").GetString(text); // Convert the encoding.
		} catch (Exception) {
			return null;
		}
	}

	public static byte[]? GetHtmlBytes(string url, string? userAgent = null) {
		userAgent ??= DEFAULT_USER_AGENT;
		try {
			if (url.StartsWith("https")) { // Resolve an issue of WebClient cannot download content via HTTPS
				ServicePointManager.ServerCertificateValidationCallback += (
					object sender,
					System.Security.Cryptography.X509Certificates.X509Certificate certificate,
					System.Security.Cryptography.X509Certificates.X509Chain chain,
					System.Net.Security.SslPolicyErrors sslPolicyErrors
				) => true; // Always accept.
			}
			WebClient webClient = new();
			webClient.Headers.Add("user-agent", userAgent);
			return webClient.DownloadData(url); // Get the web page source code.
		} catch (Exception) {
			return null;
		}
	}
}
