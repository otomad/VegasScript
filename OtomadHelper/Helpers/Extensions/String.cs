namespace OtomadHelper.Helpers;

public static partial class Extensions {
	/// <inheritdoc cref="Regex.Replace(string, string, string)"/>
	public static string Replace(this string input, Regex pattern, string replacement) =>
		pattern.Replace(input, replacement);

	/// <inheritdoc cref="Regex.Replace(string, string, MatchEvaluator)"/>
	public static string Replace(this string input, Regex pattern, MatchEvaluator evaluator) =>
		pattern.Replace(input, evaluator);

	/// <inheritdoc cref="Regex.Match(string, string)"/>
	public static Match Match(this string input, Regex pattern) =>
		pattern.Match(input);

	/// <inheritdoc cref="Regex.Matches(string, string)"/>
	public static MatchCollection Matches(this string input, Regex pattern) =>
		pattern.Matches(input);

	/// <inheritdoc cref="Regex.IsMatch(string, string)"/>
	public static bool IsMatch(this string input, Regex pattern) =>
		pattern.IsMatch(input);

	/// <inheritdoc cref="string.Join(string, IEnumerable{string})"/>
	public static string Join(this IEnumerable<string> values, string separator) =>
		string.Join(separator, values);

	/// <inheritdoc cref="string.Join(string, IEnumerable{string})"/>
	public static string Join(this IEnumerable<string> values, char separator) =>
		string.Join(separator.ToString(), values);

	/// <summary>
	/// Repeat the <paramref name="input" /> string <paramref name="count" /> times.
	/// </summary>
	/// <param name="input">The string to repeat.</param>
	/// <param name="count">Repeat count.</param>
	/// <returns>The repeated new string.</returns>
	public static string Repeat(this string input, int count) =>
		string.Concat(Enumerable.Repeat(input, count));

	/// <summary>
	/// Repeat the <paramref name="input" /> char <paramref name="count" /> times.
	/// </summary>
	/// <param name="input">The char to repeat.</param>
	/// <param name="count">Repeat count.</param>
	/// <returns>The repeated new string.</returns>
	public static string Repeat(this char input, int count) =>
		new(input, count);

	/// <summary>
	/// Generate stream from string.
	/// </summary>
	/// <returns><see cref="MemoryStream" /></returns>
	public static MemoryStream ToStream(this string input) {
		byte[] bytes = Encoding.UTF8.GetBytes(input);
		MemoryStream stream = new(bytes);
		return stream;
	}
}
