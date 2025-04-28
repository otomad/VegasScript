export { };

declare global {
	interface CrowdinJipt {
		start(): void;
		stop(): void;
		target_language: string;
		set_draft_suggestion(translation_id: string, text: string): void;
		save_suggestions(suggestions, force_saving, callback): void;
		capture_screenshot(request, status): void;
	}

	declare var _jipt: [string, any][];

	declare var jipt: CrowdinJipt | undefined;
}
