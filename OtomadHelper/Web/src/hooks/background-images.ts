import IndexedDBStore from "classes/IndexedDBStore";
import { FastAverageColor } from "fast-average-color";
import { startCircleViewTransition } from "helpers/color-mode";

const DATABASE_VERSION = 1;
const fac = new FastAverageColor();

interface BackgroundImageRow {
	imageData: Blob;
	filename: string;
	displayIndex: number;
	color: string;
}

export interface BackgroundImageRowWithMore extends BackgroundImageRow {
	url: string;
	key: number;
}

const keyToUrl = proxyMap<number, string>();
const itemsAtom = atom<BackgroundImageRowWithMore[]>([]);

export function useBackgroundImages() {
	type Store = IndexedDBStore<BackgroundImageRow>;
	const store = useRef<Store>(undefined);
	const [items, setItems] = useAtom(itemsAtom);
	const { backgroundImage } = useSnapshot(configStore.settings);
	const setBackgroundImage: SetStateNarrow<typeof backgroundImage> = value => {
		const previous = configStore.settings.backgroundImage;
		const current = typeof value === "function" ? value(previous) : value;
		if (current !== previous)
			startCircleViewTransition(current !== -1, () => configStore.settings.backgroundImage = current);
	};
	const currentItem = useMemo(() => items.find(item => item.key === backgroundImage), [items, backgroundImage]);
	const currentImage = useMemo(() => currentItem?.url ?? "", [currentItem]);
	const currentDominantColor = useMemo(() => currentItem?.color || undefined, [currentItem]);

	useAsyncMountEffect(async () => {
		store.current = new IndexedDBStore<BackgroundImageRow>("ImagesDB", DATABASE_VERSION, "backgroundImages", {
			imageData: null,
			filename: null,
			displayIndex: null,
			color: null,
		});
		await store.current.open();
		await updateItems();
	});

	async function updateItems() {
		if (!store.current?.isDatabaseOpen) return;
		const items = await store.current.sortedMap("displayIndex", async (value, key) => {
			key = +key;
			const url: string = await keyToUrl.emplace(key, async () => await fileToBlob(value.imageData));
			return { ...value, url, key };
		});
		setItems([{ imageData: null!, filename: "", url: "", key: -1, displayIndex: -1, color: "" }, ...items]);
	}

	async function reorderItems(getIndex: (oldIndex: number) => number | undefined) {
		if (!store.current?.isDatabaseOpen) return;
		const requests = [];
		for await (const cursor of store.current.cursor()) {
			const oldIndex = cursor.value.displayIndex, newIndex = getIndex(oldIndex);
			if (newIndex === undefined || newIndex === oldIndex) continue;
			cursor.value.displayIndex = newIndex;
			const request = cursor.update(cursor.value);
			requests.push(IndexedDBStore.getResult(request));
		}
		return Promise.all(requests);
	}

	async function add(image: File) {
		if (!store.current) return;
		const length = await store.current.length;
		const imgResource = new Image();
		imgResource.src = await fileToData(image);
		const color = await fac.getColorAsync(imgResource);
		await store.current.add({
			imageData: image,
			filename: image.name,
			displayIndex: length,
			color: color.hex,
		});
		await updateItems();
	}

	async function delete_(key: number) {
		if (!store.current || +key < 0) return;
		const currentIndex = items.find(row => row.key === key)?.displayIndex ?? NaN;
		setBackgroundImage(backgroundImage => backgroundImage === key ? -1 : backgroundImage);
		await nextAnimationTick();
		URL.revokeObjectURL(keyToUrl.get(key) ?? "");
		keyToUrl.delete(key);
		await store.current.delete(+key);
		if (Number.isFinite(currentIndex))
			await reorderItems(index => { if (index > currentIndex) return index - 1; });
		await updateItems();
	}

	async function reorder(key: number, newIndex: number) {
		if (!store.current || +key < 0) return;
		const length = await store.current.length;
		if (length === 0) return;
		newIndex = clamp(newIndex, 0, length - 1);
		const oldIndex = items.find(row => row.key === key)?.displayIndex ?? -1;
		if (oldIndex === newIndex || oldIndex === -1) return;
		const min = Math.min(oldIndex, newIndex), max = Math.max(oldIndex, newIndex);
		await reorderItems(index => {
			if (index < min || index > max) return;
			else if (index === oldIndex) return newIndex;
			else return index + (oldIndex <= newIndex ? -1 : 1);
		});
		await updateItems();
	}

	return {
		items,
		update: updateItems,
		add,
		map: (...args: Parameters<Store["map"]>) => store.current?.map(...args),
		delete: delete_,
		reorder,
		backgroundImage: [backgroundImage, setBackgroundImage] as const,
		currentImage,
		currentDominantColor,
	};
}
