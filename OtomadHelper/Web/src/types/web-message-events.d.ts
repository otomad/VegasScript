declare global {
	namespace WebMessageEvents {
		export type DragOver = {
			extension: string;
			contentType: string;
			isDirectory: boolean;
			isDragging: true;
		} | {
			isDragging: false | null;
		};

		export interface ConsoleLog {
			severity: "log" | "error" | "warn";
			message: string;
		}

		export interface ContextMenuItemClickEventArgs {
			menuUuid: string;
			menuItemUuid: string;
		}

		export interface AccentPalette {
			colorization: string;
			lightAccentColor: string;
			darkAccentColor: string;
		}

		export interface TriggerKeybinding {
			event: VegasKeybindingEventType;
		}

		export interface GridSpanItem {
			sameLine: number;
			crossLine: number;
			sameLineSpan?: number;
			crossLineSpan?: number;
		}

		export interface GridColumnWidthRowHeightItem {
			index: number;
			value: number;
			type: GridUnitType;
		}

		type GridUnitType = "auto" | "pixel" | "star";
	}

	type VegasKeybindingEventType = "useTrackEventAsSource" | "useProjectMediaAsSource" | "enableYtp" | "startGenerating";
}

export default WebMessageEvents;
