using System.Drawing;
using System.Windows;
using System.Windows.Interop;
using System.Windows.Media;

namespace OtomadHelper.Helpers;

public static partial class Extensions {
	/// <summary>
	/// 将 <see cref="Icon"/> 转换为 <see cref="ImageSource"/>。
	/// </summary>
	/// <param name="icon"><see cref="Icon"/></param>
	/// <returns><see cref="ImageSource"/></returns>
	public static ImageSource ToImageSource(this Icon icon) =>
		Imaging.CreateBitmapSourceFromHIcon(icon.Handle, Int32Rect.Empty, BitmapSizeOptions.FromEmptyOptions());
}
