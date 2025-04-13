using System.Globalization;
using System.Windows;
using System.Windows.Controls;

namespace OtomadHelper.WPF.Controls;

/// <remarks>
/// Cannot declare <see cref="ContentPresenter.ContentTemplate" /> in XAML Style or it will be replaced by the <see cref="ContentPresenter.Content" />.
/// So define a new <see cref="ContentControl" />.
/// </remarks>
[DependencyProperty<object>("Text")]
public partial class ButtonContentTemplate : ContentControl {
	public ButtonContentTemplate() {
		Focusable = false;
	}

	private static readonly AccessKeyAmpersandToUnderscoreConverter AmpToUnder = new();

	partial void OnTextChanged(object? content) {
		if (content is string text)
			Content = new AccessText {
				Text = AmpToUnder.Convert(text, typeof(string), DependencyProperty.UnsetValue, CultureInfo.CurrentCulture),
			};
		else
			Content = content;
	}
}
