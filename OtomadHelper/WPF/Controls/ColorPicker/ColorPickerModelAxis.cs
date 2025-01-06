using System.Globalization;

using Wacton.Unicolour;

namespace OtomadHelper.WPF.Controls;

[TypeConverter(typeof(ColorPickerModelAxisConverter))]
public class ColorPickerModelAxis(ColourSpace model, int axis) {
	public ColourSpace Model { get; set; } = model;
	public int Axis { get; set; } = axis;

	public string Special { get; private set; } = "";
	public bool IsSpecial => !string.IsNullOrEmpty(Special);

	public static bool operator ==(ColorPickerModelAxis? item1, ColorPickerModelAxis? item2) =>
		item1 is null || item2 is null ? item1 is null && item2 is null :
		item1.IsSpecial || item2.IsSpecial ?
			item1.IsSpecial && item2.IsSpecial ? item1.Special == item2.Special : false :
		item1.Model == item2.Model && item1.Axis == item2.Axis;
	public static bool operator !=(ColorPickerModelAxis? item1, ColorPickerModelAxis? item2) => !(item1 == item2);
	public override bool Equals(object obj) => obj is ColorPickerModelAxis item && this == item;
	public override int GetHashCode() => Model.GetHashCode() ^ Axis.GetHashCode();

	internal static readonly Dictionary<string, ColourSpace> NameModelMap = new() {
		["RGB"] = ColourSpace.Rgb255,
		["HSL"] = ColourSpace.Hsl,
		["HSB"] = ColourSpace.Hsb,
		["HWB"] = ColourSpace.Hwb,
		//["LAB"] = ColourSpace.Lab,
		//["LCH"] = ColourSpace.Lchab,
		["OKLAB"] = ColourSpace.Oklab,
		["OKLCH"] = ColourSpace.Oklch,
	};

	public static ColorPickerModelAxis FromName(string name) {
		try {
			string[] splitted = name.Split('_', '.');
			return new(
				NameModelMap[splitted[0].ToUpperInvariant()],
				int.Parse(splitted[1])
			);
		} catch (Exception) {
			return FromSpecial(name);
		}
	}

	public static ColorPickerModelAxis FromSpecial(string special) => new(default, default) { Special = special };

	public override string ToString() => IsSpecial ? Special : $"{NameModelMap.GetKeyByValue(Model)}.{Axis}";

	internal void Deconstruct(out ColourSpace model, out int axis) {
		model = Model;
		axis = Axis;
	}

	public bool IsValid {
		get {
			try {
				return NameModelMap.Values.Contains(Model) && Axis >= 0 && Axis < 3;
			} catch (Exception) {
				return false;
			}
		}
	}

	public static bool Valid([NotNullWhen(true)] ColorPickerModelAxis? value) => value is not null && value.IsValid;
}

public class ColorPickerModelAxisConverter : TypeConverter<ColorPickerModelAxis> {
	public override ColorPickerModelAxis ConvertFrom(ITypeDescriptorContext context, CultureInfo culture, string value) => ColorPickerModelAxis.FromName(value);

	public override string ConvertTo(ITypeDescriptorContext context, CultureInfo culture, ColorPickerModelAxis value) => value.ToString();
}
