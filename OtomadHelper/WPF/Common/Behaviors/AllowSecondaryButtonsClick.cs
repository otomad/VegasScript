using Microsoft.Xaml.Behaviors;

using System.Windows;
using System.Windows.Controls.Primitives;
using System.Windows.Input;

namespace OtomadHelper.WPF.Common;

/// <summary>
/// Allows buttons to trigger click events even when non-primary buttons
/// (specifically, the right button and the middle button) clicked.
/// </summary>
public class AllowSecondaryButtonsClick : Behavior<ButtonBase> {
	protected override void OnAttached() {
		base.OnAttached();
		AssociatedObject.PreviewMouseDown += AssociatedObject_PreviewMouseDown;
		AssociatedObject.PreviewMouseUp += AssociatedObject_PreviewMouseUp;
	}

	protected override void OnDetaching() {
		base.OnDetaching();
		AssociatedObject.PreviewMouseDown -= AssociatedObject_PreviewMouseDown;
		AssociatedObject.PreviewMouseUp -= AssociatedObject_PreviewMouseUp;
	}

	private void AssociatedObject_PreviewMouseDown(object sender, MouseButtonEventArgs e) {
		if (!AreSecondaryButtonsStateChanged(e)) return;
		AssociatedObject.CaptureMouse();
	}

	private void AssociatedObject_PreviewMouseUp(object sender, MouseButtonEventArgs e) {
		bool captured = AssociatedObject.IsMouseCaptured;
		if (!(e.ChangedButton == MouseButton.Left && e.ClickCount == 1))
			AssociatedObject.ReleaseMouseCapture();
		if (!AreSecondaryButtonsStateChanged(e) || !captured || !AssociatedObject.IsMouseOver) return;
		AssociatedObject.RaiseEvent(new RoutedEventArgs(ButtonBase.ClickEvent));
		AssociatedObject.RaiseEvent(new RoutedEventArgs(ToggleButton.CheckedEvent));
		AssociatedObject.Command?.Execute(AssociatedObject.CommandParameter);
	}

	protected bool AreSecondaryButtonsStateChanged(MouseButtonEventArgs e) =>
		e.ChangedButton != MouseButton.Left && e.ClickCount == 1;
}
