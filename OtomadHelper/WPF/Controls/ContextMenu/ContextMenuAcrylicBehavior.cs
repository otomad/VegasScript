using Microsoft.Xaml.Behaviors;
using System.Windows;
using System.Windows.Interop;
using System.Windows.Controls;
using System.Windows.Input;

namespace OtomadHelper.WPF.Controls;

[AttachedDependencyProperty<bool, ContextMenu>("FixCanExecute", DefaultValue = false)]
public partial class ContextMenuAcrylicBehavior : Behavior<FrameworkElement> {
	protected override void OnAttached() {
		AssociatedObject.IsVisibleChanged += ContextMenu_IsVisibleChanged;

		base.OnAttached();
	}

	protected override void OnDetaching() {
		base.OnDetaching();

		AssociatedObject.IsVisibleChanged -= ContextMenu_IsVisibleChanged;
	}

	private void ContextMenu_IsVisibleChanged(object sender, DependencyPropertyChangedEventArgs e) {
		FrameworkElement element = AssociatedObject;

		if (!element.IsVisible) return;
		InitializeComponent(element, element is ToolTip);

		// Fix a confusing issue that caused the IsEnabled of MenuItems to not update in time.
		if (element is ContextMenu contextMenu && GetFixCanExecute(contextMenu))
			foreach (object? _item in contextMenu.Items)
				if (_item is MenuItem item)
					if (item.Command is ICommand command) {
						item.Command = null;
						item.IsEnabled = command.CanExecute(item.CommandParameter);
						item.Command = command;
					}
	}

	internal static void InitializeComponent(FrameworkElement element, bool roundSmaller = false) {
		IntPtr? handle = (PresentationSource.FromVisual(element) as HwndSource)?.Handle;
		if (handle is not IntPtr Handle) return;

		bool isDarkTheme = BackdropWindow.ShouldAppsUseDarkMode();
		SetWindowAttribute(Handle, DwmWindowAttribute.UseImmersiveDarkMode, isDarkTheme ? 1u : 0);
		SetWindowAttribute(Handle, DwmWindowAttribute.WindowCornerPreference, (uint)(roundSmaller ? WindowCornerPreference.RoundSmall : WindowCornerPreference.Round));
		EnableAcrylicBlurBehind(Handle, isDarkTheme ? 0x663a3a3au : 0x69fcfcfcu);
		SetWindowAttribute(Handle, DwmWindowAttribute.BorderColor, 0xfffffffe);
	}
}
