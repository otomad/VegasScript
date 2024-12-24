using System.Windows.Markup;
using System.Windows.Media;

namespace OtomadHelper.WPF.Controls;

[ContentProperty("Path")]
public class IconTemplate {
	[TypeConverter(typeof(IconPathConverter))]
	public List<Geometry> Path { get; set; } = [];

	public double Size { get; set; } = 16;
}
