// DELETE: Deprecated.

import type { PostProcessorModule } from "i18next";

/** @deprecated */
const backspaceDeleteCharProcessor: PostProcessorModule = {
	type: "postProcessor",
	name: "backspace-delete-char",
	process: (value: string) => value.replaceAll(/.?\x08/g, "").replaceAll(/\x7f.?/g, ""),
};

export default backspaceDeleteCharProcessor;
