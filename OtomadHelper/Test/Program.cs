#define TEST0
using System.Resources;
using System.Windows.Forms;

namespace OtomadHelper.Test;

internal static class Program {
	/// <summary>
	/// The main entry point for the application.
	/// </summary>
	[STAThread]
	public static void Main() {
		//CosturaUtility.Initialize();
		Application.EnableVisualStyles();
		Application.SetCompatibleTextRenderingDefault(false);
		//SetCulture = "en-US";
#if TEST0
		Application.Run(new AppDebugForm());
#endif

#if TEST1
		Application.Run(new TestControlsWinForm());
#endif
#if TEST2
		s = WPF.Controls.ContentDialog.ShowDialog<string>("幸福倒计时", "Windows 11 即将更新！", [new(t.ContentDialog.Button.Ok, "ok", true), new(t.ContentDialog.Button.Cancel, "cancel")]);
#endif
#if TEST3
		try {
			WPF.Controls.ContentDialog.errorFooter = "VEGAS Pro: v21.0;\nOtomad Helper: v8.0.0";
			TestError();
		} catch (Exception e) {
			WPF.Controls.ContentDialog.ShowError(e);
		}
		static int TestError() => 0 / Math.Abs(0);
#endif
#if TEST4
		new TestControlsWPF().ShowDialog();
#endif
#if TEST5
		_ = WPF.Controls.ColorPicker.ShowDialog("000").Then(color => s = color);
#endif
	}
}
