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

	public override DockWindowStyle DefaultDockWindowStyle => DockWindowStyle.Docked;
	public override Size DefaultFloatingSize => new(800, 480);
	public bool Shown { get; private set; } = false;
	private VegasMediaSelectedChangeObserver? MediaSelectedChange;

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
