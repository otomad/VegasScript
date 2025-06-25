using System.Windows.Media;

using OtomadHelper.Services;

namespace OtomadHelper.Models;

public class AccentPalette() : BaseWebMessageEvent {
	public Color? Colorization { get; set; }
	public Color? LightAccentColor { get; set; }
	public Color? DarkAccentColor { get; set; }
}

public class SystemConfig() : AccentPalette {
	public int CursorSize { get; set; } = SystemCursorConfig.DEFAULT_SIZE;
	public Color CursorFill { get; set; } = SystemCursorConfig.DEFAULT_COLOR;
}
