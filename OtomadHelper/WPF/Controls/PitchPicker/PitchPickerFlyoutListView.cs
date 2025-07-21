using System.Windows;
using System.Windows.Controls;

namespace OtomadHelper.WPF.Controls;

public class PitchPickerFlyoutListView : ListView {
	protected override DependencyObject GetContainerForItemOverride() =>
		new PitchPickerFlyoutListViewItem();

	protected override bool IsItemItsOwnContainerOverride(object item) =>
		item is PitchPickerFlyoutListViewItem;
}

[DependencyProperty<bool>("IsPressed", DefaultValue = false)]
[RoutedEvent("Click", RoutedEventStrategy.Bubble)]
public partial class PitchPickerFlyoutListViewItem : ListViewItem {
	public PitchPickerFlyoutListViewItem() {
		// If user press the item and then drag it out, do not trigger the click event when mouse up.
		PreviewMouseLeftButtonDown += (_, _) => IsPressed = true;
		MouseLeave += (_, _) => IsPressed = false;
		PreviewMouseLeftButtonUp += (_, _) => {
			if (IsPressed) {
				RaiseEvent(new RoutedEventArgs(ClickEvent));
			}
		};
	}
}
