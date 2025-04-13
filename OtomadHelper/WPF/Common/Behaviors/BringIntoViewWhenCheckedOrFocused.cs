using System.Windows.Controls;
using System.Windows.Controls.Primitives;

using Microsoft.Xaml.Behaviors;

namespace OtomadHelper.WPF.Common;


/// <summary>
/// A behavior that brings the associated <see cref="ToggleButton"/>
/// (or <see cref="RadioButton"/>, <see cref="CheckBox"/>, etc.) into view when it is checked or focused.
/// </summary>
internal class BringIntoViewWhenCheckedOrFocused : Behavior<ToggleButton> {
	/// <summary>
	/// Called when the behavior is attached to a <see cref="ToggleButton"/>.
	/// </summary>
	protected override void OnAttached() {
		base.OnAttached();
		AssociatedObject.Checked += AssociatedObject_CheckedOrFocused;
		AssociatedObject.GotFocus += AssociatedObject_CheckedOrFocused;
		AssociatedObject.GotKeyboardFocus += AssociatedObject_CheckedOrFocused;
	}

	/// <summary>
	/// Called when the behavior is detached from a <see cref="ToggleButton"/>.
	/// </summary>
	protected override void OnDetaching() {
		base.OnDetaching();
		AssociatedObject.Checked -= AssociatedObject_CheckedOrFocused;
		AssociatedObject.GotFocus -= AssociatedObject_CheckedOrFocused;
		AssociatedObject.GotKeyboardFocus -= AssociatedObject_CheckedOrFocused;
	}

	/// <summary>
	/// Handles the Checked, GotFocus, and GotKeyboardFocus events of the associated <see cref="ToggleButton"/>.
	/// Brings the <see cref="ToggleButton"/> into view when any of these events are raised.
	/// </summary>
	/// <param name="sender">The source of the event.</param>
	/// <param name="e">The event data.</param>
	private void AssociatedObject_CheckedOrFocused(object sender, System.Windows.RoutedEventArgs e) {
		AssociatedObject.BringIntoView();
	}
}
