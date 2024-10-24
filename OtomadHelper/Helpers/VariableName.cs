namespace OtomadHelper.Helpers;

/// <summary>
/// Variable name helper class.<br />
/// Used to easily convert a variable name into camelCase, kebab-case, and so on.
/// </summary>
public class VariableName {
	private string[] words = null!;
	public bool KeepCase { get; set; } = false;

	public VariableName(string value, bool keepCase = false) {
		Value = value;
		KeepCase = keepCase;
	}

	/// <summary>
	/// Reset the value with any form of the variable name.
	/// </summary>
	public string Value {
		set {
			value = value.Trim();
			words =
				value.Contains("_") ? value.Split('_') :
				value.Contains('-') ? value.Split('-') :
				value
					.Replace(new Regex(@"(\d+)"), " $1 ")
					.Replace(new Regex(@"([A-Z]+)"), " $1")
					.Replace(new Regex(@"([A-Z][a-z])"), " $1")
					.Replace(new Regex(@"^\s+|\s+$|\s+(?=\s)"), "")
					.Split(' ');
		}
	}

	/// <summary>
	/// Convert to kebab-case.
	/// </summary>
	public string Kebab => ToLowerIfNotKeepCase(words.Join("-"));

	/// <summary>
	/// Convert to snake_case.
	/// </summary>
	public string Snake => ToLowerIfNotKeepCase(words.Join("_"));

	/// <summary>
	/// Convert to CONSTANT_CASE.
	/// </summary>
	public string Const => words.Join("_").ToUpperInvariant();

	/// <summary>
	/// Convert to PascalCase.
	/// </summary>
	public string Pascal => words.Select(Capitalize).Join("");

	/// <summary>
	/// Convert to camelCase.
	/// </summary>
	public string Camel =>
		words.Select((word, i) =>
			i != 0 ? Capitalize(word) :
			KeepCase ?
				AreAllUpper(word) ? word : word.ToLowerInvariant() :
				word.ToLowerInvariant()
		).Join("");

	/// <summary>
	/// Convert to lowercase without any separators.
	/// </summary>
	public string Lower => words.Join("").ToLowerInvariant();

	/// <summary>
	/// Convert to UPPERCASE without any separators.
	/// </summary>
	public string Upper => words.Join("").ToUpperInvariant();

	/// <summary>
	/// Convert to word case, separated by spaces, all in lowercase.
	/// </summary>
	public string Words => ToLowerIfNotKeepCase(words.Join(" "));

	/// <summary>
	/// Convert to Sentence case, separated by spaces, with only the first letter of the sentence capitalized.
	/// </summary>
	public string Sentence => words.Select((word, i) => i == 0 ? Capitalize(word) : ToLowerIfNotKeepCase(word)).Join(" ");

	/// <summary>
	/// Convert to Title Case, separated by spaces, with all first letters of words capitalized.
	/// </summary>
	public string Title => words.Select(Capitalize).Join(" ");

	/// <summary>
	/// Convert a word to uppercase the first letter and lowercase other letters.
	/// </summary>
	/// <param name="str">Word.</param>
	/// <param name="keepCase">Do not modify other letters case?</param>
	/// <returns>Capitalize the first letter and lowercase other letters.</returns>
	private string Capitalize(string str) =>
		string.IsNullOrEmpty(str) ? "" :
			char.ToUpperInvariant(str[0]) + ToLowerIfNotKeepCase(str.Substring(1));

	/// <summary>
	/// Check if all letters in the string are uppercase (ignoring numbers, punctuation, etc.).
	/// </summary>
	/// <param name="str">String.</param>
	/// <returns>Are all letters uppercase?</returns>
	private static bool AreAllUpper(string str) =>
		str.ToUpperInvariant() == str;

	private string ToLowerIfNotKeepCase(string str) =>
		KeepCase ? str : str.ToLowerInvariant();

	public override string ToString() => string.Join(" ", words);

	public string this[int index] {
		get => words[index];
		set => words[index] = value;
	}
}
