using System.Globalization;
using System.Windows;
using System.Windows.Input;
using System.Windows.Interop;
using System.Windows.Media;
using System.Windows.Shell;

namespace OtomadHelper.WPF.Controls;

/// <summary>
/// BackdropWindow.xaml 的交互逻辑
/// </summary>
[DependencyProperty<SystemBackdropType>("SystemBackdropType", DefaultValueExpression = "DEFAULT_SYSTEM_BACKDROP_TYPE")]
[DependencyProperty<bool>("IsLightTheme", DefaultValue = true)]
[DependencyProperty<Color?>("CustomAccentColor")]
[DependencyProperty<Color>("WindowGlassColor", DefaultValueExpression = "WindowsDefaultGlassColor", IsReadOnly = true)]
[DependencyProperty<Brush>("WindowGlassBrush", DefaultValueExpression = "WindowsDefaultGlassBrush", IsReadOnly = true)]
[DependencyProperty<TitleBarType>("TitleBarType", DefaultValueExpression = "TitleBarType.System")]
[DependencyProperty<FontFamily>("MonoFont")]
[DependencyProperty<FontFamily>("DefaultFont")]
[DependencyProperty<bool>("IsNonClientActive")]
[RoutedEvent("ThemeChange", RoutedEventStrategy.Bubble)]
[RoutedEvent("AccentChange", RoutedEventStrategy.Bubble)]
[RoutedEvent("Showing", RoutedEventStrategy.Bubble)]
public partial class BackdropWindow : Window {
	protected readonly WindowInteropHelper helper;
	protected IntPtr Handle => helper.Handle;

	public BackdropWindow() : base() {
		InitializeComponent();
		helper = new(this);
	}

	public IntPtr OwnerHandle {
		get => helper.Owner;
		set => helper.Owner = value;
	}

	private void InitializeComponent() {
		RefreshCulture();
		CommandBindings.AddRange(Commands.CommandBindings);
		AddResource("WPF/Themes/Generic.xaml");
		AddResource("WPF/Themes/Controls.xaml");
		Background = Brushes.Transparent;
		Loaded += Window_Loaded;
		IsVisibleChanged += (sender, e) => {
			if ((bool)e.NewValue) RaiseEvent(new RoutedEventArgs(ShowingEvent));
		};
		OnCultureChanged(Culture);
		CultureChanged += OnCultureChanged;

		// Border color (useless when system border color set)
		SetResourceReference(BorderBrushProperty, "CardStroke");
		BorderThickness = new(1);
	}

	private void Window_Loaded(object sender, RoutedEventArgs e) {
		if (ResizeMode is ResizeMode.NoResize or ResizeMode.CanMinimize)
			ReserveSystemMenuItems(Handle, SystemMenuItemType.MOVE | SystemMenuItemType.CLOSE);
		BindViewToViewModel();
		RefreshFrame();
		RefreshDarkMode();
		RefreshAccentColor();
		SetSystemBackdropType(SystemBackdropType);
		if (TitleBarType == TitleBarType.WindowChromeNoTitleBar)
			AddExtendedWindowStyles(Handle, ExtendedWindowStyles.ToolWindow);
		//SetWindowAttribute(Handle, DwmWindowAttribute.BorderColor, 0xfffffffe);
		OnWindowAttributeSetting();
	}

	private void BindViewToViewModel() {
		if (DataContext is IViewAccessibleViewModel viewModel)
			viewModel.View = this;
	}

	public virtual void RefreshBindings() {
		object? viewModel = DataContext;
		DataContext = null;
		DataContext = viewModel;
	}

	public void MoveIntoScreen() {
		Screen screen = Screen.FromHandle(Handle);
		System.Drawing.Rectangle workingArea = screen.WorkingArea;
		(double dpiX, double dpiY) = this.GetDpi();
		double maxLeft = workingArea.Right / dpiX - Width,
			maxTop = workingArea.Bottom / dpiY - Height,
			minLeft = workingArea.Left / dpiX,
			minTop = workingArea.Top / dpiY,
			screenWidth = workingArea.Width / dpiX,
			screenHeight = workingArea.Height / dpiY;
		if (Left > maxLeft) Left = maxLeft;
		if (Top > maxTop) Top = maxTop;
		if (Left < minLeft) Left = minLeft;
		if (Top < minTop) Top = minTop;
		MaxWidth = Math.Min(MaxWidth, screenWidth);
		MaxHeight = Math.Min(MaxHeight, screenHeight);
	}

	protected virtual void SetLocation(double left, double top) {
		Left = left;
		Top = top;
	}
	protected virtual void SetLocation(double left, double top, double width, SetWidthType widthType) {
		SetLocation(left, top);
		if ((widthType & SetWidthType.Width) != 0) Width = width;
		if ((widthType & SetWidthType.MinWidth) != 0) MinWidth = width;
		if ((widthType & SetWidthType.MaxWidth) != 0) MaxWidth = width;
	}
	protected virtual void SetLocation(Rect rect, SetWidthType widthType = SetWidthType.Nothing) =>
		SetLocation(rect.Left, rect.Top, rect.Width, widthType);

	protected internal Task<T> GetDialogResultTask<T>(Func<T> GetResult) {
		bool isGottenDialogResultTask = false;
		TaskCompletionSource<T> taskCompletionSource = new();
		Closing += (sender, e) => {
			if (isGottenDialogResultTask) return;
			isGottenDialogResultTask = true;
			taskCompletionSource.SetResult(GetResult());
		};
		return taskCompletionSource.Task;
	}

	#region Set backdrop type
	/// <inheritdoc cref="FrameworkElement.Resources" />
	/// <remarks>
	/// If I don't create a new property with the same name to override it like this,
	/// the style declaration in the implemented window will overwrite the global style.
	/// </remarks>
	public new ResourceDictionary Resources {
		get => base.Resources;
		set {
			// Why not `base.Resources.MergedDictionaries.Add(value);` ?
			// This will make the XAML hot reload feature become invalid.
			ResourceDictionaries originalResources = base.Resources.MergedDictionaries;
			base.Resources = value;
			base.Resources.MergedDictionaries.AddRange(originalResources);
		}
	}

	protected void SetCurrentThemeResource(bool isDarkTheme) {
		foreach (ResourceDictionary resource in Resources.MergedDictionaries.ToList())
			if (resource is NamedResourceDictionary named && named.Name == "ThemeColor")
				Resources.MergedDictionaries.Remove(resource);

		AddResource($"WPF/Themes/{(isDarkTheme ? "Dark" : "Light")}Theme.xaml", true);
	}

	public void AddResource(string path, bool isNamedResourceDictionary = false) {
		ResourceDictionary resource = isNamedResourceDictionary ? new NamedResourceDictionary() : new ResourceDictionary();
		resource.Source = ProjectUri(path);
		Resources.MergedDictionaries.Add(resource);
	}

	protected void RefreshFrame() {
		HwndSource mainWindowSrc = HwndSource.FromHwnd(Handle);
		mainWindowSrc.CompositionTarget.BackgroundColor = Color.FromArgb(0, 0, 0, 0);

		Margins margins = new(-1);

		ExtendFrame(mainWindowSrc.Handle, margins);
	}

	//[DllImport("UXTheme.dll", SetLastError = true, EntryPoint = "#132")] // Not available after Windows 1903.
	protected internal static bool ShouldAppsUseDarkMode() {
		using RegistryKey? key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Themes\Personalize");
		object? value = key?.GetValue("AppsUseLightTheme");
		return value is 0;
	}

	//[DllImport("dwmapi.dll", EntryPoint = "#127")] // Equivalent
	//internal static extern void DwmGetColorizationParameters(ref DWMCOLORIZATIONPARAMS dp);
	protected internal static Color? GetDwmColorizationColor() {
		using RegistryKey? key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\DWM");
		object? value = key?.GetValue("AccentColor");
		if (value is not int accentColorValue) return null;
		Color color = FromAbgr(accentColorValue);
		return color;

		static Color FromAbgr(int value) => Color.FromArgb(
			(byte)(value >> 8 * 3),
			(byte)(value >> 8 * 0),
			(byte)(value >> 8 * 1),
			(byte)(value >> 8 * 2)
		);
	}

	protected override void OnSourceInitialized(EventArgs e) {
		base.OnSourceInitialized(e);

		// Fix the issue of incorrect window size when use WindowChrome with SizeToContent.WidthAndHeight.
		// See: https://www.cnblogs.com/dino623/p/problems_of_WindowChrome.html#720121120
		if (SizeToContent == SizeToContent.WidthAndHeight && WindowChrome.GetWindowChrome(this) != null)
			InvalidateMeasure();

		// Detect when the theme changed
		HwndSource source = (HwndSource)PresentationSource.FromVisual(this);
		source.AddHook(WndProc);
	}

	/*internal static IntPtr WndProcTemplate(ref System.Windows.Forms.Message m, Action? OnThemeChanged, Action? OnAccentChanged) {
		bool handled = false;
		return WndProcTemplate(m.HWnd, m.Msg, m.WParam, m.LParam, ref handled, OnThemeChanged, OnAccentChanged);
	}

	internal static IntPtr WndProcTemplate(IntPtr hwnd, int msg, IntPtr wParam, IntPtr lParam, ref bool handled, Action? OnThemeChanged, Action? OnAccentChanged) {
		const int SettingChange = 0x001A;
		const int DwmColorizationColorChanged = 0x0320;

		switch (msg) {
			case SettingChange:
				if (wParam == IntPtr.Zero && Marshal.PtrToStringUni(lParam) == "ImmersiveColorSet")
					OnThemeChanged?.Invoke();
				break;
			case DwmColorizationColorChanged:
				OnAccentChanged?.Invoke();
				break;
			default:
				break;
		}
		return IntPtr.Zero;
	}

	/// <inheritdoc cref="System.Windows.Forms.Form.WndProc(ref System.Windows.Forms.Message)"/>
	protected IntPtr WndProc(IntPtr hwnd, int msg, IntPtr wParam, IntPtr lParam, ref bool handled) {
		return WndProcTemplate(hwnd, msg, wParam, lParam, ref handled,
			() => {
				RefreshDarkMode();
				RaiseEvent(new(ThemeChangeEvent, this));
			},
			() => {
				RefreshAccentColor();
				RaiseEvent(new(AccentChangeEvent, this));
			}
		);
	}*/

	/// <inheritdoc cref="System.Windows.Forms.Form.WndProc(ref System.Windows.Forms.Message)"/>
	protected IntPtr WndProc(IntPtr hwnd, int msg, IntPtr wParam, IntPtr lParam, ref bool handled) {
		const int SettingChange = 0x001A;
		const int DwmColorizationColorChanged = 0x0320;
		const int NCActivate = 0x0086;

		switch (msg) {
			case SettingChange:
				if (wParam == IntPtr.Zero && Marshal.PtrToStringUni(lParam) == "ImmersiveColorSet") {
					RefreshDarkMode();
					RaiseEvent(new(ThemeChangeEvent, this));
				}
				break;
			case DwmColorizationColorChanged:
				RefreshAccentColor();
				RaiseEvent(new(AccentChangeEvent, this));
				break;
			case NCActivate:
				// reference: https://www.cnblogs.com/dino623/p/problems_of_WindowChrome.html
				IsNonClientActive = wParam == trueValue;
				break;
			default:
				break;
		}
		return IntPtr.Zero;
	}
	private static readonly IntPtr trueValue = new(1);

	protected override void OnActivated(EventArgs e) {
		base.OnActivated(e);
		IsNonClientActive = true;
	}

	protected override void OnDeactivated(EventArgs e) {
		base.OnDeactivated(e);
		IsNonClientActive = false;
	}

	protected void RefreshDarkMode() {
		bool isDarkTheme = ShouldAppsUseDarkMode();
		IsLightTheme = !isDarkTheme;
		uint flag = isDarkTheme ? 1u : 0;
		SetWindowAttribute(Handle, DwmWindowAttribute.UseImmersiveDarkMode, flag);
		EnableDarkSystemMenu(isDarkTheme);
		SetCurrentThemeResource(isDarkTheme);
		//Color borderColor = isDarkTheme ? Color.FromRgb(20, 20, 20) : Color.FromRgb(219, 219, 219);
		//SetWindowAttribute(Handle, DwmWindowAttribute.BorderColor, borderColor.ToAbgr(false));
	}

	partial void OnCustomAccentColorChanged() => RefreshAccentColor();
	protected void RefreshAccentColor() {
		Color? accentColor = CustomAccentColor;
		accentColor ??= GetDwmColorizationColor();
		if (accentColor is Color color) {
			WindowGlassColor = color;
			WindowGlassBrush = new SolidColorBrush(color);
		}
	}

	private const SystemBackdropType DEFAULT_SYSTEM_BACKDROP_TYPE = SystemBackdropType.TransientWindow;

	protected void SetSystemBackdropType(SystemBackdropType systemBackdropType) {
		SetWindowAttribute(Handle, DwmWindowAttribute.SystemBackdropType, (uint)systemBackdropType);
	}

	partial void OnSystemBackdropTypeChanged(SystemBackdropType newValue) {
		SetSystemBackdropType(newValue);
		OnWindowAttributeSetting();
	}

	protected virtual void OnWindowAttributeSetting() { }

	private static readonly Color WindowsDefaultGlassColor = Color.FromRgb(0, 95, 184);
	private static Brush WindowsDefaultGlassBrush => new SolidColorBrush(WindowsDefaultGlassColor);
	#endregion

	#region Extends content into title bar
	partial void OnTitleBarTypeChanged(TitleBarType value) {
		switch (value) {
			case TitleBarType.WindowChrome:
				WindowChrome.SetWindowChrome(this, new() {
					CaptionHeight = 54, // Default: 20
					CornerRadius = new(0),
					GlassFrameThickness = new(-1),
					ResizeBorderThickness = ResizeMode is ResizeMode.NoResize or ResizeMode.CanMinimize ?
						new(0) : new(8, 0, 8, 8),
					NonClientFrameEdges = NonClientFrameEdges.Right,
					UseAeroCaptionButtons = true,
				});
				break;
			case TitleBarType.WindowChromeNoTitleBar:
				WindowChrome.SetWindowChrome(this, new() {
					CaptionHeight = 0,
					CornerRadius = new(0),
					GlassFrameThickness = new(-1),
					ResizeBorderThickness = new(0),
				});
				WindowStyle = WindowStyle.None;
				ResizeMode = ResizeMode.CanResize;
				break;
			case TitleBarType.Borderless:
				RemoveWindowChrome();
				AllowsTransparency = true;
				WindowStyle = WindowStyle.None;
				break;
			case TitleBarType.System:
			default:
				RemoveWindowChrome();
				break;
		}

		void RemoveWindowChrome() => WindowChrome.SetWindowChrome(this, null);
	}

	protected override void OnKeyDown(KeyEventArgs e) {
		if (TitleBarType == TitleBarType.WindowChromeNoTitleBar) {
			if (Keyboard.Modifiers == ModifierKeys.Alt && e.SystemKey == Key.Space) {
				e.Handled = true;
				return;
			}
		}
		if (e.Key == Key.Escape)
			this.Vanish();
		base.OnKeyDown(e);
	}
	#endregion

	#region Default fonts
	private void OnCultureChanged(CultureInfo culture) {
		FontFamily defaultFont = FontFamily, englishMonoFont = (FontFamily)Resources["EnglishMonoFont"];
		DefaultFont = defaultFont;
		MonoFont = new(new[] { englishMonoFont, defaultFont }.Select(font => font.Source).Join(", "));
	}
	#endregion
}

public enum TitleBarType {
	System,
	Borderless,
	WindowChrome,
	WindowChromeNoTitleBar,
}

[Flags]
public enum SetWidthType {
	Nothing = 0,
	Width = 1 << 0,
	MinWidth = 1 << 1,
	MaxWidth = 1 << 2,
}
