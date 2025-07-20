using System.Drawing;
using System.Windows;
using System.Windows.Interop;
using System.Windows.Media;

using MediaPoint = System.Windows.Point;
using DrawingPoint = System.Drawing.Point;

namespace OtomadHelper.Helpers;

public static partial class Extensions {
	extension(Icon icon) {
		/// <summary>
		/// Convert <see cref="Icon"/> to <see cref="ImageSource"/>.
		/// </summary>
		/// <param name="icon"><see cref="Icon"/></param>
		/// <returns><see cref="ImageSource"/></returns>
		public ImageSource ToImageSource() =>
			Imaging.CreateBitmapSourceFromHIcon(icon.Handle, Int32Rect.Empty, BitmapSizeOptions.FromEmptyOptions());
	}

	extension(MediaPoint point) {
		/// <summary>
		/// Convert <see cref="MediaPoint"/> to <see cref="DrawingPoint"/>.
		/// </summary>
		public DrawingPoint ToDrawingPoint() =>
			new((int)point.X, (int)point.Y);
	}

	extension(DrawingPoint point) {
		/// <summary>
		/// Convert <see cref="DrawingPoint"/> to <see cref="MediaPoint"/>.
		/// </summary>
		public MediaPoint ToMediaPoint() =>
			new(point.X, point.Y);
	}
}
