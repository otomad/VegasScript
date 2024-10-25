using ScriptPortal.Vegas;

using Timer = System.Windows.Forms.Timer;

namespace OtomadHelper.Services;

internal class VegasMediaSelectedChangeObserver : IDisposable {
	private readonly Vegas vegas;
	private readonly Timer timer = new() { Interval = 100 };
	private Media[] lastSelectedMedia = [];
	private bool initialized = false;

	public event EventHandler? MediaSelectedChanged;

	private void Timer_Tick(object sender, EventArgs e) {
		Media[] selectedMedia = vegas?.Project?.MediaPool?.GetSelectedMedia() ?? [];
		if (!selectedMedia.SequenceEqual(lastSelectedMedia)) {
			if (!initialized) {
				MediaSelectedChanged?.Invoke(this, EventArgs.Empty);
				initialized = true;
			}
			lastSelectedMedia = selectedMedia;
		}
		//PostWebMessage(new ConsoleLog($"Get: {sw1.ElapsedMilliseconds}; Sort: {sw2.ElapsedMilliseconds}; MediaChanged: {lastSelectedMedia.Length}; Changed: {changed}"));
	}

	public VegasMediaSelectedChangeObserver(Vegas vegas) {
		this.vegas = vegas;
		timer.Tick += Timer_Tick;
		timer.Start();
	}

	public void Dispose() {
		timer.Stop();
	}
}
