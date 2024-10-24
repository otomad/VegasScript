using OtomadHelper.Assets;

using ScriptPortal.Vegas;

namespace OtomadHelper.Module;

public class Keybindings(Module module) {
	private Module Module => module;

	internal CustomCommand Parent { get; } = new(Module.COMMAND_CATEGORY, $"{Module.DisplayName}.Commands");
	internal readonly Dictionary<VegasKeybindingEventType, CustomCommand> Commands = [];

	public void Initialize() {
		SetCommandName(Parent, () => Module.DisplayName);
		foreach (VegasKeybindingEventType type in EnumerateEnum<VegasKeybindingEventType>())
			AddKeybinding(type);
	}

	public delegate void KeybindingEventHandler(object sender, VegasKeybindingEventArgs e);
	public event KeybindingEventHandler? TriggerKeybinding;

	private void AddKeybinding(VegasKeybindingEventType type) {
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
		set => SetCommandName(Commands[VegasKeybindingEventType.EnableYtp], () => t.Keybindings.Commands[value ? "DisableYtp" : "EnableYtp"], false);
	}

	private static string? GetIconName(VegasKeybindingEventType type) => type switch {
		VegasKeybindingEventType.UseTrackEventAsSource => nameof(ToolbarIcons.TrackEvent),
		VegasKeybindingEventType.UseProjectMediaAsSource => nameof(ToolbarIcons.Media),
		VegasKeybindingEventType.EnableYtp => nameof(ToolbarIcons.YTP),
		VegasKeybindingEventType.StartGenerating => nameof(ToolbarIcons.CheckmarkCircle),
		_ => null,
	};
}

public class VegasKeybindingEventArgs(VegasKeybindingEventType type) : EventArgs {
	public VegasKeybindingEventType Type => type;
}

public enum VegasKeybindingEventType {
	UseTrackEventAsSource = 1,
	UseProjectMediaAsSource,
	EnableYtp,
	StartGenerating,
}
