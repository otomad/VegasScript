using System.Drawing;

namespace OtomadHelper.Helpers;

public static partial class Extensions {
	public static (uint DpiX, uint DpiY) GetDpi(this Screen screen, DpiType dpiType) {
		const int Monitor_DefaultToNearest = 2;
		Point point = new(screen.Bounds.Left + 1, screen.Bounds.Top + 1);
		IntPtr monitor = MonitorFromPoint(point, Monitor_DefaultToNearest);
		GetDpiForMonitor(monitor, dpiType, out uint dpiX, out uint dpiY);
		return (dpiX, dpiY);
	}

	/// <remarks><see href="https://msdn.microsoft.com/en-us/library/windows/desktop/dd145062(v=vs.85).aspx" /></remarks>
	[DllImport("User32.dll")]
	private static extern IntPtr MonitorFromPoint([In] System.Drawing.Point pt, [In] uint dwFlags);

	/// <remarks><see href="https://msdn.microsoft.com/en-us/library/windows/desktop/dn280510(v=vs.85).aspx" /></remarks>
	[DllImport("Shcore.dll")]
	private static extern IntPtr GetDpiForMonitor([In] IntPtr hmonitor, [In] DpiType dpiType, [Out] out uint dpiX, [Out] out uint dpiY);

	[DllImport("user32.dll")]
	private static extern bool EnumDisplaySettings(string lpszDeviceName, int iModeNum, ref DevModeW lpDevMode);

	public static decimal GetScalingFactor(this Screen screen) {
		DevModeW devMode = new() { dmSize = (ushort)Marshal.SizeOf<DevModeW>() };
		EnumDisplaySettings(screen.DeviceName, -1, ref devMode);
		return Math.Round(decimal.Divide(devMode.dmPelsWidth, screen.Bounds.Width), 2);
	}
}

/// <remarks><see href="https://msdn.microsoft.com/en-us/library/windows/desktop/dn280511(v=vs.85).aspx" /></remarks>
public enum DpiType {
	Effective,
	Angular,
	Raw,
}
