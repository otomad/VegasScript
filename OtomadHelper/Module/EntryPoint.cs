using ScriptPortal.Vegas;

namespace OtomadHelper.Module;

/// <summary>
/// This class is only called if the user accidentally puts this extension into the scripts directory.
/// </summary>
public class EntryPoint {
	public async void FromVegas(Vegas myVegas) {
		vegas = myVegas;
		Prior.Initialize();

		await ShowWrongOpeningMethodError();
	}

	/// <remarks>
	/// <code>C:\ProgramData\VEGAS Pro\Application Extensions</code>
	/// </remarks>
	public static Path CorrectExtensionPath {
		get {
			string programDataFolder = Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData);
			return new Path(programDataFolder, @"VEGAS Pro\Application Extensions");
		}
	}

	private async Task ShowWrongOpeningMethodError() {
		string? result = await WPF.Controls.ContentDialog.ShowDialog<string>(
			(string)t.WrongOpeningMethod.Script.Title,
			(string)t.WrongOpeningMethod.Script.Content + "\n" + CorrectExtensionPath, // TODO: \C:\ProgramData\VEGAS Pro\Application Extensions
			[
				new(t.ContentDialog.Button.Ok, "ok"),
				new(t.ContentDialog.Button.OpenPath, "openPath"),
				new(t.ContentDialog.Button.LearnMore, "learnMore", true),
			]
		);
		if (result == "learnMore")
			OpenLink("https://otomad.github.io/otomad/link/OtomadHelper.html#documentation");
		else if (result == "openPath") {
			Exception? e = CorrectExtensionPath.CreateDirectory();
			if (e is not null) ShowError(e);
			else OpenLink(CorrectExtensionPath);
		}
	}
}
