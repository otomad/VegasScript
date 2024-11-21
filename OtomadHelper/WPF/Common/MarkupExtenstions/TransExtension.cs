using System.Windows;
using System.Windows.Markup;

namespace OtomadHelper.WPF.Common;

[AttachedDependencyProperty<bool>("EnablePangu", DefaultValue = true)]
public partial class TransExtension(string key) : MarkupExtension {
	public override object ProvideValue(IServiceProvider serviceProvider) {
		I18n trans = t;
		if (serviceProvider.GetService(typeof(IProvideValueTarget)) is IProvideValueTarget targetProvider &&
			targetProvider.TargetObject is FrameworkElement targetObject &&
			!GetEnablePangu(targetObject))
			trans = t_disablePangu;
		return trans.Translate(key);
	}
}
