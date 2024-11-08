using System.Globalization;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Media;

using Wacton.Unicolour;

namespace OtomadHelper.WPF.Controls;

[ValueConversion(typeof(ColorPickerModelAxis), typeof(bool))]
public class ColorPickerModelAxisToCheckedConverter : ValueConverter<ColorPickerModelAxis, bool, string> {
	public override bool Convert(ColorPickerModelAxis modelAxis, Type targetType, string parameter, CultureInfo culture) =>
		modelAxis == ColorPickerModelAxis.FromName(parameter);

	public override ColorPickerModelAxis ConvertBack(bool value, Type targetType, string parameter, CultureInfo culture) =>
		ColorPickerModelAxis.FromName(parameter);
}

[ValueConversion(typeof(Dictionary<ColorPickerModelAxis, double>), typeof(string))]
public class ColorPickerValuesToTextConverter : ValueConverter<Dictionary<ColorPickerModelAxis, double>, string, string> {
	public override string Convert(Dictionary<ColorPickerModelAxis, double> dictionary, Type targetType, string parameter, CultureInfo culture) {
		try {
			return dictionary.TryGetValue(ColorPickerModelAxis.FromName(parameter), out double result) ? Math.Round(result).ToString() : string.Empty;
		} catch (Exception) {
			return string.Empty;
		}
	}
}

[ValueConversion(typeof(TextChangedEventArgs), typeof(ValueTuple<string, string>))]
public class ColorPickerTextChangedEventArgsToTextAndNameConverter : ValueConverter<TextChangedEventArgs, (string text, string name)> {
	public override (string text, string name) Convert(TextChangedEventArgs e, Type targetType, object parameter, CultureInfo culture) {
		TextBox textBox = (TextBox)e.Source;
		return (textBox.Text, (string)textBox.Tag);
	}
}

[ValueConversion(typeof(Unicolour), typeof(Color))]
public class UnicolourToMediaColorConverter : ValueConverter<Unicolour, Color, double?> {
	public override Color Convert(Unicolour unicolour, Type targetType, double? alpha, CultureInfo culture) {
		Color color = unicolour.ToMediaColor();
		if (alpha is double a) color.A = (byte)(a * 255);
		return color;
	}

	public override Unicolour ConvertBack(Color color, Type targetType, double? parameter, CultureInfo culture) =>
		color.ToUnicolour();
}

public class TrackThumbInnerBaseMultiplySizeConverter : MultiValueConverter<double[], double> {
	public override double Convert(double[] values, Type targetType, object parameter, CultureInfo culture) =>
		values.ToArray().Aggregate(1d, (a, b) => a * b);
}

[ValueConversion(typeof(string), typeof(Range?))]
public class TextBoxNameToRangeConverter : ValueConverter<string, Range?> {
	public override Range? Convert(string name, Type targetType, object parameter, CultureInfo culture) {
		try {
			(ColourSpace model, int axis) = ColorPickerModelAxis.FromName(name);
			(Range X, Range Y, Range Z) ranges = ColorPickerViewModel.GetInputRange(model);
			return axis switch {
				0 => ranges.X,
				1 => ranges.Y,
				2 => ranges.Z,
				_ => null,
			};
		} catch (Exception) {
			return null;
		}
	}
}

[ValueConversion(typeof(int), typeof(int))]
public class Alpha255ToAlpha100Converter : ValueConverter<int, int> {
	public override int Convert(int value, Type targetType, object parameter, CultureInfo culture) =>
		(int)Math.Round((double)value / 255 * 100);
}

[ValueConversion(typeof(string), typeof(bool))]
public class ColorPickerIsNotSpecialColorTextBoxConverter : ValueConverter<string, bool> {
	public override bool Convert(string name, Type targetType, object parameter, CultureInfo culture) =>
		name.Contains(".");
}

[ValueConversion(typeof(string), typeof(string))]
public class ColorAxisKeyToTranslationConverter : ValueConverter<string, string, bool> {
	public override string Convert(string value, Type targetType, bool useLongName, CultureInfo culture) =>
		useLongName ? t.ColorPicker.Axis[value] : t.ColorPicker.AxisAbbrs[value];
}
