using System.Globalization;

namespace OtomadHelper.WPF.Common;

public abstract class TypeConverter<TDestination, TSource> : TypeConverter {
	public override bool CanConvertFrom(ITypeDescriptorContext context, Type sourceType) =>
		sourceType == typeof(TSource) || base.CanConvertFrom(context, sourceType);
	public override bool CanConvertTo(ITypeDescriptorContext context, Type destinationType) =>
		destinationType == typeof(TSource) || base.CanConvertTo(context, destinationType);

	/// <inheritdoc cref="TypeConverter.ConvertFrom(ITypeDescriptorContext, CultureInfo, object)" />
	public abstract TDestination? ConvertFrom(ITypeDescriptorContext context, CultureInfo culture, TSource value);
	/// <inheritdoc cref="TypeConverter.ConvertTo(ITypeDescriptorContext, CultureInfo, object, Type)" />
	public abstract TSource? ConvertTo(ITypeDescriptorContext context, CultureInfo culture, TDestination value);

	/// <summary>
	/// Is it acceptable for the source to be <see langword="null" />? Defaults to <see langword="false" />.
	/// </summary>
	/// <remarks>
	/// <list type="bullet">
	/// <item>If <see langword="false" />, an exception will be thrown when the source is <see langword="null" />;</item>
	/// <item>If <see langword="true" />, the implemented method <see cref="ConvertFrom(ITypeDescriptorContext, CultureInfo, TSource)" />
	/// may receive the source with a <see langword="null" /> value,
	/// and you need to handle the situation when the source is <see langword="null" /> by yourself.</item>
	/// </list>
	/// </remarks>
	protected bool CanConvertFromNullable { get; set; } = false;
	/// <summary>
	/// Is it allowed to fallback to the previous type converter when returning <see langword="null" /> in the implemented method
	/// <see cref="ConvertFrom(ITypeDescriptorContext, CultureInfo, TSource)" />? Defaults to <see langword="true" />.
	/// </summary>
	/// <remarks>
	/// <list type="bullet">
	/// <item>If <see langword="false" />, return <see langword="null" /> directly without any processing;</item>
	/// <item>If <see langword="true" />, it will fallback to the previous type converter (<see cref="TypeConverter" />)
	/// when <see langword="null" />.</item>
	/// </list>
	/// </remarks>
	protected bool CanConvertFromFallback { get; set; } = true;
	/// <summary>
	/// Is it allowed to fallback to the previous type converter when returning <see langword="null" /> in the implemented method
	/// <see cref="ConvertTo(ITypeDescriptorContext, CultureInfo, TDestination)" />? Defaults to <see langword="true" />.
	/// </summary>
	/// <remarks>
	/// <list type="bullet">
	/// <item>If <see langword="false" />, return <see langword="null" /> directly without any processing;</item>
	/// <item>If <see langword="true" />, it will fallback to the previous type converter (<see cref="TypeConverter" />)
	/// when <see langword="null" />.</item>
	/// </list>
	/// </remarks>
	protected bool CanConvertToFallback { get; set; } = true;

	public override object ConvertFrom(ITypeDescriptorContext context, CultureInfo culture, object value) {
		if (value is null && !CanConvertFromNullable)
			throw GetConvertFromException(value);
		else if (!(value is TSource) && value is not null) // I don't know why can't I use `value is not TSource and not null`.
			goto Fallback;
		else {
			TDestination? destination = ConvertFrom(context, culture, (TSource?)value!);
			if (destination is null && CanConvertFromFallback) goto Fallback;
			return destination!;
		}
	Fallback:
		return base.ConvertFrom(context, culture, value);
	}

	public override object ConvertTo(ITypeDescriptorContext context, CultureInfo culture, object value, Type destinationType) {
		if (!destinationType.Extends(typeof(TSource)) || !(value is TDestination destination) && value is not null)
			// I don't know why can't I use `value is not TDestination and not null`.
			goto Fallback;
		else {
			TSource? source = ConvertTo(context, culture, (TDestination?)value!);
			if (source is null && CanConvertToFallback) goto Fallback;
			return source!;
		}
	Fallback:
		return base.ConvertTo(context, culture, value, destinationType);
	}
}

public abstract class TypeConverter<TDestination> : TypeConverter<TDestination, string>;
