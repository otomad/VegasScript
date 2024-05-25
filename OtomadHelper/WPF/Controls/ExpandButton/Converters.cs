using System.Globalization;
using System.Windows.Data;

namespace OtomadHelper.WPF.Controls;

public class ExpandButtonIsCheckedToIsExpandedTextConverter : IValueConverter {
	public object Convert(object value, Type targetType, object parameter, CultureInfo culture) {
		bool isExpanded = (bool)value;
		return isExpanded ? t.ContentDialog.Expander.CollapseDetails : t.ContentDialog.Expander.ExpandDetails;
	}

	public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture) =>
		throw new NotImplementedException();
}
