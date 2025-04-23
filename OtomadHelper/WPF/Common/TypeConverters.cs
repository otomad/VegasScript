using System.Globalization;
using System.Runtime.CompilerServices;

namespace OtomadHelper.WPF.Common;

public class CollectionConverter<T> : TypeConverter<T> where T : IEnumerable {
	private static readonly Regex removeParenthesisRegex = new(@"^(\((?<content>.*)\)|\[(?<content>.*)\]|\{(?<content>.*)\})$");
	public static string RemoveParenthesis(ref string source) {
		source = source.Trim();
		Match match = source.Match(removeParenthesisRegex);
		if (match.Success) source = match.Groups["content"].Value;
		return source;
	}

	public override T ConvertFrom(ITypeDescriptorContext context, CultureInfo culture, string source) {
		RemoveParenthesis(ref source);
		if (!typeof(T).TryGetIEnumerableType(out Type enumerable, out Type itemType)) goto UnknownType;
		string[] items = source.Split(',', ';');
		int length = items.Length;
		if (typeof(T).Extends(typeof(Array))) {
			IList array = Array.CreateInstance(itemType, length);
			for (int i = 0; i < length; i++)
				array[i] = Convert.ChangeType(items[i], itemType);
			return (T)array;
		} else if (typeof(T).IsGenericType && typeof(T).GetGenericTypeDefinition() == typeof(List<>)) {
			IList list = (IList)Activator.CreateInstance(typeof(List<>).MakeGenericType(itemType), length);
			foreach (string item in items)
				list.Add(Convert.ChangeType(item, itemType));
			return (T)list;
		} else // Lazy to implement Dictionary and HashSet
			goto UnknownType;
	UnknownType:
		throw new ArgumentException($"The argument type `{typeof(T)}` is not supported");
	}

	public override string ConvertTo(ITypeDescriptorContext context, CultureInfo culture, T value) => value.ToString();
}

public class TupleConverter<T> : TypeConverter<T> where T : ITuple {
	public override T ConvertFrom(ITypeDescriptorContext context, CultureInfo culture, string source) {
		CollectionConverter<IEnumerable>.RemoveParenthesis(ref source);
		if (!typeof(T).Extends(typeof(ITuple)) || !typeof(T).IsGenericType) goto UnknownType;
		IEnumerable<object> items = source.Split(',', ';').Select((item, index) => Convert.ChangeType(item, typeof(T).GenericTypeArguments[index]));
		return items.ToTuple<T>();
	UnknownType:
		throw new ArgumentException($"The argument type `{typeof(T)}` is not supported");
	}

	public override string ConvertTo(ITypeDescriptorContext context, CultureInfo culture, T value) => value.ToString();
}
