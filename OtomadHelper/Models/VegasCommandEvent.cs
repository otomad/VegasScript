using OtomadHelper.Module;

namespace OtomadHelper.Models;

public class VegasCommandEvent() : BaseWebMessageEvent {
	public VegasCommandType @event;
}
