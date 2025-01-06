using System.Globalization;
using System.Windows.Media;

namespace OtomadHelper.WPF.Controls;

public class IconPathConverter : TypeConverter<List<Geometry>> {
	public IconPathConverter() {
		CanConvertFromNullable = true;
	}

	public override List<Geometry> ConvertFrom(ITypeDescriptorContext context, CultureInfo culture, string? path) {
		List<Geometry> geometries = [];
		if (path is null) return geometries;
		geometries.Add(Geometry.Parse(path));
		return geometries;
	}

	public override string? ConvertTo(ITypeDescriptorContext context, CultureInfo culture, List<Geometry> geometries) =>
		geometries.HasIndex(0) ? geometries[0].ToString() : null;
}
