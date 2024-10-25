using ScriptPortal.Vegas;

namespace OtomadHelper.Module;

/// <summary>
/// This class is only called if the user accidentally puts this extension into the scripts directory.
/// </summary>
public class EntryPoint {
	internal Vegas vegas = null!;

	public async void FromVegas(Vegas myVegas) {
		vegas = myVegas;

		if (await WPF.Controls.ContentDialog.ShowDialog<string>(
			(string)t.WrongOpeningMethod.Script.Title,
			(string)t.WrongOpeningMethod.Script.Content + "\nC:\\ProgramData\\VEGAS Pro\\Application Extensions",
			[
				new(t.ContentDialog.Button.Ok, "ok"),
				new(t.ContentDialog.Button.LearnMore, "learnMore", true),
			]
		) == "learnMore")
			OpenLink("https://otomad.github.io/otomad/link/OtomadHelper.html#documentation");
	}
}
