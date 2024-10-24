using ScriptPortal.Vegas;

namespace OtomadHelper.Services;

public static class ErrorHandleService {
	private static AssemblyFileVersions? assemblyFileVersions;
	/// <inheritdoc cref="AssemblyFileVersions" />
	public static AssemblyFileVersions OtomadHelperAssemblyFileVersions {
		get {
			if (assemblyFileVersions is null)
				assemblyFileVersions = new() {
					AssemblyVersion = Assembly.GetExecutingAssembly().GetName().Version,
					FileVersion = FileVersionInfo.GetVersionInfo(Assembly.GetExecutingAssembly().Location).FileVersion,
					ProductVersion = FileVersionInfo.GetVersionInfo(Assembly.GetExecutingAssembly().Location).ProductVersion,
				};
			return assemblyFileVersions.Value;
		}
	}
	/// <summary><c>v8.x.x</c></summary>
	public static string OtomadHelperVersionTag => "v" + OtomadHelperAssemblyFileVersions.FileVersion;
	/// <summary><c>new Version(8, x, x, x)</c></summary>
	public static Version OtomadHelperVersionObject => OtomadHelperAssemblyFileVersions.AssemblyVersion;

	/// <inheritdoc cref="Vegas.ShowError(Exception)" />
	public static void ShowError(Exception e) {
		try {
			WPF.Controls.ContentDialog.ShowError(e);
		} catch (Exception) { // When OtomadHelper.dll hasn't been loaded yet.
			vegas.ShowError(e);
		}
	}

	/// <summary>
	/// Invoke a action which may cause an exception, but we do not want it crash the whole Vegas.
	/// </summary>
	/// <returns>Is the action run properly with no any error?</returns>
	public static Exception? Undoable(Action? action) {
		try {
			action?.Invoke();
			return null;
		} catch (Exception e) {
			ShowError(e);
			return e;
		}
	}

	/// <inheritdoc cref="Undoable(Action?)" />
	/// <remarks>
	/// With an undo label, user can undo the unwanted action directly by the menu option or Ctrl + Z.
	/// </remarks>
	/// <param name="label">The undo label will be shown on the Undo menu item.</param>
	public static Exception? Undoable(string label, Action? action) {
		if (vegas is null || vegas.Project is null)
			return Undoable(action);
		using UndoBlock undoBlock = new(vegas.Project, label);
		return Undoable(action);
	}

	[SuppressMessage("Style", "IDE1006")] // It names "vegas" instead of "Vegas" because conflict with the class Vegas.
	public static
#if VEGAS_ENV
		Vegas
#else
		Vegas?
#endif
		vegas { get; internal set; } = null!;
}

/// <summary>
/// There are three versions: assembly, file, and product (aka Assembly Informational Version).
/// They are used by different features and take on different default values if you don't explicit specify them.
/// </summary>
/// <remarks>
/// <code>
///	(AssemblyVersion, 7.9.0.0)
///	(FileVersion, 7.9.0)
/// (ProductVersion, 7.9.0+2b8b4c7f50aa25d0fc8e8827b2c35aa1a7c0a5e3)
/// </code>
/// </remarks>
public readonly struct AssemblyFileVersions {
	/// <inheritdoc cref="AssemblyName.Version" />
	public Version AssemblyVersion { get; init; }
	/// <inheritdoc cref="FileVersionInfo.FileVersion" />
	public string FileVersion { get; init; }
	/// <inheritdoc cref="FileVersionInfo.ProductVersion" />
	public string ProductVersion { get; init; }
}
