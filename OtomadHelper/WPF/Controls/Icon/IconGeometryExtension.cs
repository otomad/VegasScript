using System.Windows.Markup;
using System.Windows.Media;

namespace OtomadHelper.WPF.Controls;

[ContentProperty("Path")]
public class IconGeometryExtension : MarkupExtension {
	public string Path { get; set; } = "";

	public override object? ProvideValue(IServiceProvider serviceProvider) =>
		Geometry.Parse(Path);
}
