import type { FormatFunction } from "i18next";
import ordinal from "intl-ordinal";

const formatInterpolation: FormatFunction = function format(value, format, lng) {
	if (isI18nItem(value))
		value = value.toString();
	switch (typeof value) {
		case "string":
			if (!VariableName.areAllUpper(value)) // If the letters are all capital, treated them as abbreviations without case conversion.
				switch (format) {
					case "uppercase": return value.toUpperCase();
					case "lowercase": return value.toLowerCase();
					case "capitalize": return value.toCapitalized();
					case "nowrapPerWord": return value.nowrapPerWord();
					case "nowrapPerChar": return value.nowrapPerChar();
					default: break;
				}
			break;
		case "number":
			switch (format) {
				case "ordinal": return ordinal(lng!).format(value);
				default: break;
			}
			break;
		default:
			break;
	}
	return value;
};

export default formatInterpolation;
