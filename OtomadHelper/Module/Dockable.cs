using System.Drawing;

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
	}

	private static bool isVegasAppInitialized = false;

	public override DockWindowStyle DefaultDockWindowStyle => DockWindowStyle.Docked;
	public override Size DefaultFloatingSize => new(800, 480);
	public bool Shown { get; private set; } = false;

	private VegasMediaSelectedChangeObserver? MediaSelectedChange;

	private bool DockableVisible { get; set { field = value; VisibleChanged?.Invoke(this, Visible); } } = true;
	private bool VegasVisible { get; set { field = value; VisibleChanged?.Invoke(this, Visible); } } = true;
	public new bool Visible => DockableVisible && VegasVisible;
	public new event EventHandler<bool>? VisibleChanged;
	private WindowVisibilityMonitor? dockableVisibleMonitor, vegasVisibleMonitor;

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
		MonitorDockableVisibleChange();
		vegas.AppInitialized += OnVegasAppInitialized;

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

		dockableVisibleMonitor?.Dispose();
		vegasVisibleMonitor?.Dispose();
		vegas.TrackEventStateChanged -= OnTrackEventChanged;
		vegas.TrackEventCountChanged -= OnTrackEventChanged;
		MediaSelectedChange?.Dispose();
		vegas.TrackSelectionChanged -= OnTrackChanged;
		vegas.AppInitialized -= OnVegasAppInitialized;

		base.OnClosed(e);
	}

	private void MonitorDockableVisibleChange() {
		dockableVisibleMonitor = new WindowVisibilityMonitor(ParentWindow.Handle);
		dockableVisibleMonitor.VisibilityChanged += (_, visibility) => DockableVisible = visibility;
		dockableVisibleMonitor.StartMonitoring();
		if (isVegasAppInitialized) MonitorVegasMinimizeChange();
	}

	private void MonitorVegasMinimizeChange() {
		vegasVisibleMonitor = new WindowVisibilityMonitor(vegas.MainWindow.Handle);
		vegasVisibleMonitor.VisibilityChanged += (_, visibility) => VegasVisible = visibility;
		vegasVisibleMonitor.StartMonitoring();
	}

	private void OnVegasAppInitialized(object sender, EventArgs e) {
		if (!isVegasAppInitialized) MonitorVegasMinimizeChange();
		isVegasAppInitialized = true;
	}

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
