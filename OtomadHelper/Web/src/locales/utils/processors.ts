import { enableSvsQuotes } from "fullwidth-quotes";
import type { PostProcessorModule } from "i18next";
import { spacing } from "pangu";

export const panguProcessor: PostProcessorModule = {
	type: "postProcessor",
	name: "pangu",
	process: (value: string) => spacing(value),
};

export const fullwidthQuotesProcessor: PostProcessorModule = {
	type: "postProcessor",
	name: "fullwidth-quotes",
	process: (value: string) => enableSvsQuotes(value),
};
