using Wacton.Unicolour;

using DrawingColor = System.Drawing.Color;
using MediaColor = System.Windows.Media.Color;

namespace OtomadHelper.Helpers;

public static partial class Extensions {
	public static DrawingColor ToDrawingColor(this MediaColor color) =>
		DrawingColor.FromArgb(color.A, color.R, color.G, color.B);

	public static MediaColor ToMediaColor(this DrawingColor color) =>
		MediaColor.FromArgb(color.A, color.R, color.G, color.B);

	public static uint ToAbgr(this MediaColor color, bool includeAlpha = true) =>
		(!includeAlpha ? 0 :(uint)color.A << 8 * 3) |
		(uint)color.B << 8 * 2 |
		(uint)color.G << 8 * 1 |
		(uint)color.R << 8 * 0;

	public static uint ToAbgr(this DrawingColor color, bool includeAlpha = true) =>
		(!includeAlpha ? 0 : (uint)color.A << 8 * 3) |
		(uint)color.B << 8 * 2 |
		(uint)color.G << 8 * 1 |
		(uint)color.R << 8 * 0;

	public static Unicolour ToUnicolour(this MediaColor color) =>
		new(ColourSpace.Rgb255, color.R, color.G, color.B, color.A);

	public static MediaColor ToMediaColor(this Unicolour color) {
		Rgb255 rgb = color.Rgb.Byte255;
		return MediaColor.FromArgb((byte)color.Alpha.A255, (byte)rgb.ConstrainedR, (byte)rgb.ConstrainedG, (byte)rgb.ConstrainedB);
	}

	public static string ToHex(this MediaColor color) {
		string hex = "#" + color.R.ToString("X2") + color.G.ToString("X2") + color.B.ToString("X2");
		if (color.A != 255) hex += color.A.ToString("X2");
		return hex;
	}

	/// <summary>
	/// This function performs a quick calculation of the <i>perceived brightness</i> of a color,
	/// and takes into consideration ways that different channels in an RGB color value contribute
	/// to how bright it looks to the human eye. It uses all-integer math for speed on typical CPUs.
	/// </summary>
	/// <remarks>
	/// <para>
	/// This is not a model for real analysis of color brightness. It is good for quick calculations
	/// that require you to determine if a color can be classified as <i>light</i> or <i>dark</i>.
	/// Theme colors can often be light but not pure white, or dark but not pure black.
	/// </para>
	/// <para>
	/// Now that you have a function to check whether a color is light,
	/// you can use that function to detect if Dark mode is enabled.
	/// </para>
	/// <para>
	/// Dark mode is defined as a dark background with a contrasting light foreground.
	/// Since <c>IsColorLight</c> checks if a color is considered light, you can use that function
	/// to see if the foreground is light. If the foreground is light, then Dark mode is enabled.
	/// </para>
	/// <see href="https://learn.microsoft.com/zh-cn/windows/apps/desktop/modernize/ui/apply-windows-themes#know-when-dark-mode-is-enabled">
	/// Know when Dark mode is enabled</see>
	/// </remarks>
	public static bool IsColorLight(this MediaColor color) =>
		5 * color.G + 2 * color.R + color.B > 8 * 128;
}
