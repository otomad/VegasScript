using System.Drawing;
using System.Windows;
using System.Windows.Interop;
using System.Windows.Media;

using Point = System.Windows.Point;
using DrawingPoint = System.Drawing.Point;

namespace OtomadHelper.Helpers;

public static partial class Extensions {
	/// <summary>
	/// Convert <see cref="Icon"/> to <see cref="ImageSource"/>.
	/// </summary>
	/// <param name="icon"><see cref="Icon"/></param>
	/// <returns><see cref="ImageSource"/></returns>
	public static ImageSource ToImageSource(this Icon icon) =>
		Imaging.CreateBitmapSourceFromHIcon(icon.Handle, Int32Rect.Empty, BitmapSizeOptions.FromEmptyOptions());

	/// <summary>
	/// Convert <see cref="Point"/> to <see cref="DrawingPoint"/>.
	/// </summary>
	public static DrawingPoint ToDrawingPoint(this Point point) =>
		new((int)point.X, (int)point.Y);

	/// <summary>
	/// Convert <see cref="DrawingPoint"/> to <see cref="Point"/>.
	/// </summary>
	public static Point ToMediaPoint(this DrawingPoint point) =>
		new(point.X, point.Y);
}
