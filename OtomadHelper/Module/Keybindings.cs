using OtomadHelper.Assets;

using ScriptPortal.Vegas;

namespace OtomadHelper.Module;

public class Keybindings(Module module) {
	private Module Module => module;

	internal CustomCommand Parent { get; } = new(Module.COMMAND_CATEGORY, $"{Module.DisplayName}.Commands");
	internal readonly Dictionary<VegasCommandType, CustomCommand> Commands = [];

	public void Initialize() {
		SetCommandName(Parent, () => Module.DisplayName);
		foreach (VegasCommandType type in EnumerateEnum<VegasCommandType>())
			if ((int)type < 10000)
				AddKeybinding(type);
	}

	public delegate void KeybindingEventHandler(object sender, VegasKeybindingEventArgs e);
	public event KeybindingEventHandler? TriggerKeybinding;

	private void AddKeybinding(VegasCommandType type) {
		string typeName = type.ToString();
		string? iconName = GetIconName(type);
		CustomCommand command = new(Module.COMMAND_CATEGORY, $"{Module.DisplayName}.{typeName}") {
			//CanAddToMenu = false, // TODO: Uncomment it after debug.
			Enabled = false,
		};
		if (iconName is not null)
			command.IconFile = Module.SaveAndGetIconPath(iconName);
		SetCommandName(command, () => t.Keybindings.Commands[typeName]);
		command.Invoked += (sender, e) => TriggerKeybinding?.Invoke(command, new(type));
		Parent.AddChild(command);
		Commands.Add(type, command);
	}

	private static void SetCommandName(CustomCommand command, Func<string> GetName, bool listenCultureChange = true) {
		command.MenuItemName = command.DisplayName = GetName();
		if (listenCultureChange)
			CultureChanged += culture => command.MenuItemName = command.DisplayName = GetName();
	}

	public bool Enabled {
		set => Commands.Values.ForEach(command => command.Enabled = value);
	}

	public bool YtpEnabled {
		set => SetCommandName(Commands[VegasCommandType.EnableYtp], () => t.Keybindings.Commands[value ? "DisableYtp" : "EnableYtp"], false);
	}

	private static string? GetIconName(VegasCommandType type) => type switch {
		VegasCommandType.UseTrackEventAsSource => nameof(ToolbarIcons.TrackEvent),
		VegasCommandType.UseProjectMediaAsSource => nameof(ToolbarIcons.Media),
		VegasCommandType.EnableYtp => nameof(ToolbarIcons.YTP),
		VegasCommandType.StartGenerating => nameof(ToolbarIcons.CheckmarkCircle),
		_ => null,
	};
}

public class VegasKeybindingEventArgs(VegasCommandType type) : EventArgs {
	public VegasCommandType Type => type;
}
