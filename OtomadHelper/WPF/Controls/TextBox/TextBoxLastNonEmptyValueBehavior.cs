using System.Windows.Controls;

using Microsoft.Xaml.Behaviors;

namespace OtomadHelper.WPF.Common;

[AttachedDependencyProperty<string, TextBox>("LastNonEmptyValue")]
public partial class TextBoxLastNonEmptyValueBehavior : Behavior<TextBox> {
	protected override void OnAttached() {
		SetLastNonEmptyValue(AssociatedObject, AssociatedObject.Text);
		AssociatedObject.TextChanged += TextBox_TextChanged;

		base.OnAttached();
	}

	protected override void OnDetaching() {
		base.OnDetaching();

		AssociatedObject.TextChanged -= TextBox_TextChanged;
	}

	private void TextBox_TextChanged(object sender, TextChangedEventArgs e) {
		string newText = AssociatedObject.Text;
		if (!string.IsNullOrEmpty(newText))
			SetLastNonEmptyValue(AssociatedObject, newText);
	}
}
