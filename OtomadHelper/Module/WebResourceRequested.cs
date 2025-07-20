using System.IO;
using System.Windows.Media;
using System.Xml;

using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;

namespace OtomadHelper.Module;

/// <summary>
/// Reading of response content stream happens asynchronously, and WebView2 does not
/// directly dispose the stream once it read. Therefore, use the following stream
/// class, which properly disposes when WebView2 has read all data. For details, see
/// <a href="https://github.com/MicrosoftEdge/WebView2Feedback/issues/2513">
/// CoreWebView2 does not close stream content</a>.
/// </summary>
internal class ManagedStream(Stream s) : Stream {
	#region Overrides
	public override bool CanRead => s.CanRead;

	public override bool CanSeek => s.CanSeek;

	public override bool CanWrite => s.CanWrite;

	public override long Length => s.Length;

	public override long Position { get => s.Position; set => s.Position = value; }

	public override long Seek(long offset, SeekOrigin origin) => s.Seek(offset, origin);

	public override void Flush() => throw new NotImplementedException();

	public override void SetLength(long value) => throw new NotImplementedException();

	public override void Write(byte[] buffer, int offset, int count) => throw new NotImplementedException();

	public override int Read(byte[] buffer, int offset, int count) {
		int read = 0;
		try {
			read = s.Read(buffer, offset, count);
			if (read == 0)
				s.Dispose();
		} catch {
			s.Dispose();
			throw;
		}
		return read;
	}
	#endregion

	internal const string RESOURCE_HOST = "https://app.otomadhelper.example/";

	internal static void Handler(WebView2 webView) {
		const string HOST = RESOURCE_HOST + "*";
		webView.CoreWebView2.AddWebResourceRequestedFilter(HOST, CoreWebView2WebResourceContext.All);
		webView.CoreWebView2.WebResourceRequested += (sender, args) => {
			CoreWebView2Environment webViewEnv = webView.CoreWebView2.Environment;
			Uri uri = new(args.Request.Uri);
			NameValueCollection query = HttpUtility.ParseQueryString(uri.Query);
			string file = uri.AbsolutePath[1..];
			file = Uri.UnescapeDataString(file);
			string[] fileSlug = file.Split('/');
			string? virtualPath = fileSlug.FirstOrDefault();
			string assetsFilePath = "Web.dist." + file.Replace("/", ".");
			try {
				if (virtualPath != null) {
					string path = string.Join("/", fileSlug.Skip(1));
					switch (virtualPath) {
						case "thumbnail":
							Handler_Thumbnail(webView, args, path, false);
							return;
						case "fileicon":
							Handler_Thumbnail(webView, args, path, true);
							return;
						case "api":
							Handler_Api(webView, args, path);
							return;
						default:
							break;
					}
				}
				if (file.EndsWith(".svg", StringComparison.InvariantCultureIgnoreCase) && query.HasKey("cursor")) {
					Handler_SvgCursor(webView, args, assetsFilePath, query);
					return;
				}
				Stream fileStream = ResourceHelper.GetEmbeddedResource(assetsFilePath);
				ManagedStream managedStream = new(fileStream);
				string extension = new Path(file).Extension;
				args.Response = webViewEnv.CreateWebResourceResponse(managedStream, 200, "OK", GetHeader(extension));
			} catch (InvalidOperationException e) {
				args.Response = webViewEnv.CreateWebResourceResponse(null, 415, e.Message, "");
			} catch (Exception) {
				args.Response = webViewEnv.CreateWebResourceResponse(null, 404, "Not Found", "");
			}
		};
	}

	public static string GetContentType(string extension) => extension switch {
		"html" => "text/html",
		"js" => "text/javascript",
		"css" => "text/css",
		"appcache" => "text/cache-manifest",
		"jpg" => "image/jpeg",
		"png" => "image/png",
		"gif" => "image/gif",
		"svg" => "image/svg+xml",
		"webp" => "image/webp",
		"apng" => "image/apng",
		"ico" => "image/vnd.microsoft.icon",
		"cur" => "image/x-win-bitmap",
		"bmp" => "image/bmp",
		"woff" => "font/woff",
		"woff2" => "font/woff2",
		"ttf" => "font/ttf",
		"json" => "application/json",
		"xml" => "application/xml",
		"manifest" => "application/manifest+json",
		"ani" => "application/x-navi-animation",
		"lottie" => "application/zip+dotlottie",
		"frag" => "x-shader/x-fragment",
		"vert" => "x-shader/x-vertex",
		"glsl" => "x-shader/x-glsl",
		_ => "application/octet-stream",
	};

	private static string GetHeader(string extension) {
		const int AGE = 1200;
		string contentType = GetContentType(extension);
		string headers = $"""
			HTTP/1.1 200 OK
			Content-Type: {contentType}
			Cache-Control: max-age={AGE}
			Age: {AGE}
			Keep-Alive: timeout={AGE}
			Date: {DateTime.UtcNow.ToUniversalTime():R}
			""";
		return headers;
	}

	private static void Handler_Thumbnail(WebView2 webView, CoreWebView2WebResourceRequestedEventArgs args, string filePath, bool allowIcon = false) {
		filePath = filePath.Replace("/", "\\");
		BitmapSource thumb = ResourceHelper.GetFileThumbnail(filePath, allowIcon);
		PngBitmapEncoder encoder = new();
		MemoryStream memoryStream = new();
		encoder.Frames.Add(BitmapFrame.Create(thumb));
		encoder.Save(memoryStream);
		ManagedStream managedStream = new(memoryStream);
		args.Response = webView.CoreWebView2.Environment.CreateWebResourceResponse(managedStream, 200, "OK", GetHeader("png"));
	}

	private const string CROWDIN_API_URL = "https://badges.awesome-crowdin.com/stats-16002405-661336.json";

	private static void Handler_Api(WebView2 webView, CoreWebView2WebResourceRequestedEventArgs args, string apiPath) {
		switch (apiPath) {
			case "crowdin":
				if (GetHtmlBytes(CROWDIN_API_URL, webView.CoreWebView2.Settings.UserAgent) is not { } json) goto default;
				MemoryStream memoryStream = new(json);
				ManagedStream managedStream = new(memoryStream);
				args.Response = webView.CoreWebView2.Environment.CreateWebResourceResponse(managedStream, 200, "OK", GetHeader("json"));
				break;
			default:
				args.Response = webView.CoreWebView2.Environment.CreateWebResourceResponse(null, 404, "Not Found", "");
				break;
		}
	}

	private static void Handler_SvgCursor(WebView2 webView, CoreWebView2WebResourceRequestedEventArgs args, string filePath, NameValueCollection query) {
		const int BASE_SIZE = 32, MAX_SIZE = 128;
		if (!double.TryParse(query["size"], out double expectedSize)) expectedSize = BASE_SIZE;
		string expectedFill = query["fill"] ?? "white";
		using Stream fileStream = ResourceHelper.GetEmbeddedResource(filePath);
		XmlDocument document = new();
		document.Load(fileStream);
		XmlElement root = document.DocumentElement;
		if (double.TryParse(root.GetAttributeCaseInsensitive("width"), out double width))
			root.SetAttribute("width", Math.Min(width / BASE_SIZE * expectedSize, MAX_SIZE).ToString());
		if (double.TryParse(root.GetAttributeCaseInsensitive("height"), out double height))
			root.SetAttribute("height", Math.Min(height / BASE_SIZE * expectedSize, MAX_SIZE).ToString());
		if (root.GetAttributeCaseInsensitive("fill") is { } fill && fill != "none") {
			root.SetAttribute("fill", expectedFill);
			try {
				Color fillColor = Color.FromHex_(expectedFill);
				Color strokeColor = fillColor.IsColorLight ? Colors.Black : Colors.White;
				if (root.GetAttributeCaseInsensitive("stroke") is not null)
					root.SetAttribute("stroke", strokeColor.ToHex());
				if (root.GetAttributeCaseInsensitive("style") is { } style && style.Contains("--stroke:"))
					root.SetAttribute("style", style.Replace(new Regex(@"(--stroke:\s*)[^;]+"), "$1" + strokeColor.ToHex()));
			} catch (Exception) { }
		}
		string resultSvg = document.OuterXml;
		MemoryStream resultStream = resultSvg.ToStream();
		ManagedStream managedStream = new(resultStream);
		args.Response = webView.CoreWebView2.Environment.CreateWebResourceResponse(managedStream, 200, "OK", GetHeader("svg"));
	}
}
