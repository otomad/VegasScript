using System.Collections.ObjectModel;
using System.Windows.Input;

namespace OtomadHelper.WPF.Controls;

public partial class ComboBoxViewModel<T> : ObservableObject<ComboBoxFlyout> {
	public ObservableCollection<string> Options { get; } = [];

	public ObservableCollection<T> Ids { get; } = [];

	public ObservableCollection<IconTemplate> Icons { get; } = [];

	[ObservableProperty]
	private T selected = DEFAULT_SELECTED;
	internal T originalSelected = DEFAULT_SELECTED;
	private static readonly T DEFAULT_SELECTED = typeof(T).Extends(typeof(string)) ? (T)(object)string.Empty : default!;

	public int SelectedIndex => Ids.ToList().IndexOf(Selected);

	public void Close() => View?.Close();

	public void CloseWithoutSaving() {
		Selected = originalSelected;
		View?.Close();
	}

	[RelayCommand]
	private void CheckRadioButton(T id) {
		Selected = id;
		Close();
	}

	[RelayCommand]
	private void ArrowMove(FocusMoveDirection direction) {
		if (Ids.Count == 0) return;
		if (direction is FocusMoveDirection.Previous or FocusMoveDirection.Next)
			Selected = Ids[MathEx.FloorMod(SelectedIndex + direction.ToDelta(), Ids.Count)];
		else if (direction is FocusMoveDirection.First)
			Selected = Ids.First();
		else if (direction is FocusMoveDirection.Last)
			Selected = Ids.Last();
	}

	[RelayCommand]
	private void PageMove(FocusMoveDirection direction) {
		if (direction is FocusMoveDirection.PageBackward) View?.ScrollViewer.PageUp();
		else if (direction is FocusMoveDirection.PageForward) View?.ScrollViewer.PageDown();
	}
}

public class ComboBoxViewModel : ComboBoxViewModel<object> { }
