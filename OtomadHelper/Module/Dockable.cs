using System.Drawing;
using System.Web.UI.WebControls;

using OtomadHelper.Interop;
using OtomadHelper.Models;
using OtomadHelper.Services;

using ScriptPortal.Vegas;

namespace OtomadHelper.Module;

[DesignerCategory("Code")]
public sealed class Dockable : DockableControl {
	private Host? host;
	internal Module Module { get; }

	public Dockable(Module module) : base(Module.InternalName) {
		DisplayName = Module.DisplayName;
		Module = module;
		//visibleChangeTimer = new ITimer.WinForm(() => {
		//	Visible = IsWindowVisible(ParentWindow.Handle);
		//}, 1000);
	}

	public override DockWindowStyle DefaultDockWindowStyle => DockWindowStyle.Docked;
	public override Size DefaultFloatingSize => new(800, 480);
	public bool Shown { get; private set; } = false;
	private VegasMediaSelectedChangeObserver? MediaSelectedChange;
	//private readonly ITimer visibleChangeTimer;
	public new bool Visible {
		get => field;
		set {
			if (field == value) return;
			field = value;
			s = value;
			VisibleChanged?.Invoke(this, value);
		}
	}
	public new event EventHandler<bool>? VisibleChanged;
	private WindowSubclasser? visibleChangeSubclasser;

	public void Reload() {
		DisposeHost();
		host = new(this);
		Controls.Add(host);
	}

	protected override void OnLoad(EventArgs e) {
		Reload();
		Shown = true;

		vegas.TrackEventStateChanged += OnTrackEventChanged;
		vegas.TrackEventCountChanged += OnTrackEventChanged;
		MediaSelectedChange = new(myVegas);
		MediaSelectedChange.MediaSelectedChanged += OnMediaChanged;
		vegas.TrackSelectionChanged += OnTrackChanged;
		//visibleChangeTimer.Start();
		ListenVisibleChange();

		base.OnLoad(e);
	}

	private void DisposeHost() {
		if (host is { }) {
			Controls.Remove(host);
			host.Dispose();
			host = null;
			MessageSender.Host = null!;
		}
	}

	protected override void OnClosed(EventArgs e) {
		DisposeHost();
		Shown = false;

		vegas.TrackEventStateChanged -= OnTrackEventChanged;
		vegas.TrackEventCountChanged -= OnTrackEventChanged;
		MediaSelectedChange?.Dispose();
		vegas.TrackSelectionChanged -= OnTrackChanged;

		base.OnClosed(e);
	}

	private void ListenVisibleChange() {
		visibleChangeSubclasser = new(ParentWindow.Handle, (IntPtr hwnd, int msg, IntPtr wParam, IntPtr lParam, ref bool handled) => {
			UpdateVisible();
			return IntPtr.Zero;
		});
		visibleChangeSubclasser.SubclassWindow();
	}

	internal void UpdateVisible() => Visible = IsWindowVisible(ParentWindow.Handle);

	private void OnTrackEventChanged(object sender, EventArgs e) {
		PostWebMessage(new ConsoleLog("TrackEventChanged"));
	}

	private void OnMediaChanged(object sender, EventArgs e) {
		PostWebMessage(new ConsoleLog($"MediaChanged: {vegas.Project.MediaPool.GetSelectedMedia().Length}"));
	}

	private void OnTrackChanged(object sender, EventArgs e) {
		PostWebMessage(new ConsoleLog("TrackChanged"));
	}
}
