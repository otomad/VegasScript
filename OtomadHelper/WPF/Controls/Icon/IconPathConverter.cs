using System.Globalization;
using System.Windows.Media;

namespace OtomadHelper.WPF.Controls;

public class IconPathConverter : TypeConverter {
	public override bool CanConvertFrom(ITypeDescriptorContext context, Type sourceType) =>
		sourceType == typeof(string) || base.CanConvertFrom(context, sourceType);
	public override bool CanConvertTo(ITypeDescriptorContext context, Type destinationType) =>
		destinationType == typeof(string) || base.CanConvertTo(context, destinationType);

	public override object ConvertFrom(ITypeDescriptorContext context, CultureInfo culture, object value) {
		List<Geometry> geometries = [];
		if (value is null)
			return geometries;
		if (value is not string path)
			return base.ConvertFrom(context, culture, value);
		geometries.Add(Geometry.Parse(path));
		return geometries;
	}

	public override object ConvertTo(ITypeDescriptorContext context, CultureInfo culture, object value, Type destinationType) =>
		destinationType == typeof(string) && value is List<Geometry> geometries && geometries.HasIndex(0) ?
		geometries[0].ToString() :
		base.ConvertTo(context, culture, value, destinationType);
}
