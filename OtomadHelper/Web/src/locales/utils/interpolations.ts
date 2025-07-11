import { IN_CONTEXT_LANGUAGE_CODE } from "helpers/jipt-activator_constants";
import type { FormatFunction } from "i18next";
import ordinal from "intl-ordinal";

const mapWordsIfNotAllUpper = (str: string, convert: (word: string) => string) => str.mapWords(word => word.areAllUpper() ? word : convert(word));

const formatInterpolation: FormatFunction = function format(value, format, lng) {
	if (isI18nItem(value))
		value = value.toString();
	if (lng === IN_CONTEXT_LANGUAGE_CODE) return value;
	switch (typeof value) {
		case "string":
			// If the letters are all capital, treated them as abbreviations without case conversion.
			if (!VariableName.areAllUpper(value)) // If the letters are all capital, treated them as abbreviations without case conversion.
				switch (format) {
					case "uppercase": return value.toLocaleUpperCase();
					case "lowercase": return mapWordsIfNotAllUpper(value, word => word.toLocaleLowerCase());
					case "capitalize": return mapWordsIfNotAllUpper(value, word => word.toCapitalized());
					case "titleCase": return value.toTitleCase();
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
