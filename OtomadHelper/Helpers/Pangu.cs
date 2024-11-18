/// <see href="https://github.com/vinta/pangu.js/blob/master/src/shared/core.js">Convert from js to cs.</see>

namespace OtomadHelper.Helpers;

public static class Pangu {
	private static readonly string CJK = "\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30fa\u30fc-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff";
	private static readonly Regex
		ANY_CJK = new($@"[{CJK}]"),
		CONVERT_TO_FULLWIDTH_CJK_SYMBOLS_CJK = new($@"([{CJK}])[ ]*([\:]+|\.)[ ]*([{CJK}])"),
		CONVERT_TO_FULLWIDTH_CJK_SYMBOLS = new($@"([{CJK}])[ ]*([~\!;,\?]+)[ ]*"),
		DOTS_CJK = new($@"([\.]{{2,}}|\u2026)([{CJK}])"),
		FIX_CJK_COLON_ANS = new($@"([{CJK}])\:([A-Z0-9\(\)])"),
		CJK_QUOTE = new($@"([{CJK}])([`""\u05f4])"),
		QUOTE_CJK = new($@"([`""\u05f4])([{CJK}])"),
		FIX_QUOTE_ANY_QUOTE = new($@"([`""\u05f4]+)[ ]* (.+?)[ ]* ([`""\u05f4]+)"),
		CJK_SINGLE_QUOTE_BUT_POSSESSIVE = new($@"([{CJK}])('[^s])"),
		SINGLE_QUOTE_CJK = new($@"(')([{CJK}])"),
		FIX_POSSESSIVE_SINGLE_QUOTE = new($@"([A-Za-z0-9{CJK}])( )('s)"),
		HASH_ANS_CJK_HASH = new($@"([{CJK}])(#)([{CJK}]+)(#)([{CJK}])"),
		CJK_HASH = new($@"([{CJK}])(#([^ ]))"),
		HASH_CJK = new($@"(([^ ])#)([{CJK}])"),
		CJK_OPERATOR_ANS = new($@"([{CJK}])([\+\-\*\/=&\|<>])([A-Za-z0-9])"),
		ANS_OPERATOR_CJK = new($@"([A-Za-z0-9])([\+\-\*\/=&\|<>])([{CJK}])"),
		FIX_SLASH_AS = new(@"([/]) ([a-z\-_\./]+)"),
		FIX_SLASH_AS_SLASH = new(@"([/\.])([A-Za-z\-_\./]+) ([/])"),
		CJK_LEFT_BRACKET = new($@"([{CJK}])([\(\[\{{<>\u201c])"),
		RIGHT_BRACKET_CJK = new($@"([\)\]\}}<>\u201d])([{CJK}])"),
		FIX_LEFT_BRACKET_ANY_RIGHT_BRACKET = new(@"([\(\[\{<\u201c]+)[ ]*(.+?)[ ]*([\)\]\}>\u201d]+)"),
		ANS_CJK_LEFT_BRACKET_ANY_RIGHT_BRACKET = new($@"([A-Za-z0-9{CJK}])[ ]*([\u201c])([A-Za-z0-9{CJK}\-_ ]+)([\u201d])"),
		LEFT_BRACKET_ANY_RIGHT_BRACKET_ANS_CJK = new($@"([\u201c])([A-Za-z0-9{CJK}\-_ ]+)([\u201d])[ ]*([A-Za-z0-9{CJK}])"),
		AN_LEFT_BRACKET = new(@"([A-Za-z0-9])([\(\[\{])"),
		RIGHT_BRACKET_AN = new(@"([\)\]\}])([A-Za-z0-9])"),
		CJK_ANS = new($@"([{CJK}])([A-Za-z\u0370-\u03ff0-9@\$%\^&\*\-\+\\=\|/\u00a1-\u00ff\u2150-\u218f\u2700—\u27bf])"),
		ANS_CJK = new($@"([A-Za-z\u0370-\u03ff0-9~\$%\^&\*\-\+\\=\|/!;:,\.\?\u00a1-\u00ff\u2150-\u218f\u2700—\u27bf])([{CJK}])"),
		S_A = new(@"(%)([A-Za-z])"),
		MIDDLE_DOT = new(@"([ ]*)([\u00b7\u2022\u2027])([ ]*)");

	private const char PUNCSP = '\u2008';

	private static string ConvertToFullwidth(string symbols) => symbols
		.Replace('~', '～')
		.Replace('!', '！')
		.Replace(';', '；')
		.Replace(':', '：')
		.Replace(',', '，')
		.Replace('.', '。')
		.Replace('?', '？');

	public static string Spacing(string text) {
		if (text.Length <= 1 || !ANY_CJK.IsMatch(text))
			return text;

		string newText = text;

		newText = newText.Replace(CONVERT_TO_FULLWIDTH_CJK_SYMBOLS_CJK, match => {
			(_, string leftCjk, string symbols, string rightCjk, _) = match.Groups.Cast<string>().ToArray();
			string fullwidthSymbols = ConvertToFullwidth(symbols);
			return $"{leftCjk}{fullwidthSymbols}{rightCjk}";
		});

		newText = newText.Replace(CONVERT_TO_FULLWIDTH_CJK_SYMBOLS, match => {
			(_, string cjk, string symbols, _) = match.Groups.Cast<string>().ToArray();
			string fullwidthSymbols = ConvertToFullwidth(symbols);
			return $"{cjk}{fullwidthSymbols}";
		});

		newText = newText.Replace(DOTS_CJK, $"$1{PUNCSP}$2");
		newText = newText.Replace(FIX_CJK_COLON_ANS, "$1：$2");

		newText = newText.Replace(CJK_QUOTE, $"$1{PUNCSP}$2");
		newText = newText.Replace(QUOTE_CJK, $"$1{PUNCSP}$2");
		newText = newText.Replace(FIX_QUOTE_ANY_QUOTE, "$1$2$3");

		newText = newText.Replace(CJK_SINGLE_QUOTE_BUT_POSSESSIVE, $"$1{PUNCSP}$2");
		newText = newText.Replace(SINGLE_QUOTE_CJK, $"$1{PUNCSP}$2");
		newText = newText.Replace(FIX_POSSESSIVE_SINGLE_QUOTE, "$1's");

		newText = newText.Replace(HASH_ANS_CJK_HASH, $"$1{PUNCSP}$2$3$4{PUNCSP}$5");
		newText = newText.Replace(CJK_HASH, $"$1{PUNCSP}$2");
		newText = newText.Replace(HASH_CJK, $"$1{PUNCSP}$3");

		newText = newText.Replace(CJK_OPERATOR_ANS, $"$1{PUNCSP}$2{PUNCSP}$3");
		newText = newText.Replace(ANS_OPERATOR_CJK, $"$1{PUNCSP}$2{PUNCSP}$3");

		newText = newText.Replace(FIX_SLASH_AS, "$1$2");
		newText = newText.Replace(FIX_SLASH_AS_SLASH, "$1$2$3");

		newText = newText.Replace(CJK_LEFT_BRACKET, $"$1{PUNCSP}$2");
		newText = newText.Replace(RIGHT_BRACKET_CJK, $"$1{PUNCSP}$2");
		newText = newText.Replace(FIX_LEFT_BRACKET_ANY_RIGHT_BRACKET, "$1$2$3");
		newText = newText.Replace(ANS_CJK_LEFT_BRACKET_ANY_RIGHT_BRACKET, $"$1{PUNCSP}$2$3$4");
		newText = newText.Replace(LEFT_BRACKET_ANY_RIGHT_BRACKET_ANS_CJK, $"$1$2$3{PUNCSP}$4");

		newText = newText.Replace(AN_LEFT_BRACKET, "$1 $2");
		newText = newText.Replace(RIGHT_BRACKET_AN, "$1 $2");

		newText = newText.Replace(CJK_ANS, $"$1{PUNCSP}$2");
		newText = newText.Replace(ANS_CJK, $"$1{PUNCSP}$2");

		newText = newText.Replace(S_A, "$1 $2");

		newText = newText.Replace(MIDDLE_DOT, "・");

		return newText;
	}
}
