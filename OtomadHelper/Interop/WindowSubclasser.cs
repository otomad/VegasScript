using System.Windows.Interop;

namespace OtomadHelper.Interop;

internal class WindowSubclasser(IntPtr hwnd, HwndSourceHook handler) {
	private long originalWndProc;
	private readonly HwndSourceHook newWndProcDelegate = handler;
	private readonly IntPtr targetHwnd = hwnd;

	public void SubclassWindow() {
		originalWndProc = GetWindowLongPtr(targetHwnd, WindowLongFlags.WndProc);
		IntPtr newProcPtr = Marshal.GetFunctionPointerForDelegate(CustomWndProc);
		SetWindowLongPtr(targetHwnd, WindowLongFlags.WndProc, newProcPtr);
	}

	public void RestoreOriginal() {
		SetWindowLongPtr(targetHwnd, WindowLongFlags.WndProc, originalWndProc);
	}

	private IntPtr CustomWndProc(IntPtr hwnd, uint msg, IntPtr wParam, IntPtr lParam) {
		bool handled = false;
		IntPtr result = newWndProcDelegate(hwnd, (int)msg, wParam, lParam, ref handled);
		return handled ? result : CallWindowProc(originalWndProc, hwnd, msg, wParam, lParam);
	}
}
