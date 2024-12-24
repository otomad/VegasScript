export interface Bridge {
	setIsDevMode(isDevMode: boolean): void;
	setCulture(culture: string): void;
	showMessageBox(title: string, body: string, buttons: ContentDialogButtonItem[]): string;
	showComboBox<T>(rect: DOMRect, selected: T, ids: T[], options: string[], icons?: string[]): T;
	showPitchPicker(rect: DOMRect, pitch: string): string;
	showColorPicker(hex: string): string;
	showConfirmDeleteFlyout(rect: DOMRect, message: string): boolean;
}

export interface ContentDialogButtonItem {
	text: string;
	dialogResult: string;
	isDefault?: boolean;
}
