using System.Runtime.CompilerServices;

public static class Prior {
	[MethodImpl(MethodImplOptions.NoOptimization)]
	public static void Initialize() {
		OtomadHelper.WPF.Controls.BackdropWindow.EnableTextSelectionVisuals();
	}
}
