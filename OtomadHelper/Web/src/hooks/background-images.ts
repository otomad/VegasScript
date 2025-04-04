import IndexedDBStore from "classes/IndexedDBStore";
import { startCircleViewTransition } from "helpers/color-mode";
const DATABASE_VERSION = 1;

interface BackgroundImageRow {
	imageData: Blob;
	filename: string;
	displayIndex: number;
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
	const currentImage = useMemo(() => items.find(item => item.key === backgroundImage)?.url ?? "", [items, backgroundImage]);

	useAsyncMountEffect(async () => {
		store.current = new IndexedDBStore<BackgroundImageRow>("ImagesDB", DATABASE_VERSION, "backgroundImages", {
			imageData: null,
			filename: null,
			displayIndex: null,
		});
		await store.current.open();
		await updateItems();
	});

	async function updateItems() {
		if (!store.current?.isDatabaseOpen) return;
		const items = await store.current.sortedMap("displayIndex", async (value, key) => {
			key = +key;
			const url: string = await keyToUrl.getOrInsert(key, async () => await fileToBlob(value.imageData));
			return { ...value, url, key };
		});
		setItems([{ imageData: null!, filename: "", url: "", key: -1, displayIndex: -1 }, ...items]);
	}

	async function reorderItems() {
		if (!store.current?.isDatabaseOpen) return;
		const requests = [];
		let i = 0;
		for await (const cursor of store.current.sortedCursor("displayIndex")) {
			console.log(cursor.value.displayIndex);
			if (cursor.value.displayIndex !== i) {
				cursor.value.displayIndex = i;
				const request = cursor.update(cursor.value);
				requests.push(IndexedDBStore.getResult(request));
			}
			i++;
		}
		return Promise.all(requests);
	}

	async function add(image: File) {
		if (!store.current) return;
		const length = await store.current.length;
		await store.current.add({
			imageData: image,
			filename: image.name,
			displayIndex: length,
		});
		await updateItems();
	}

	async function delete_(key: number) {
		if (!store.current || +key < 0) return;
		setBackgroundImage(backgroundImage => backgroundImage === key ? -1 : backgroundImage);
		await nextAnimationTick();
		URL.revokeObjectURL(keyToUrl.get(key) ?? "");
		keyToUrl.delete(key);
		await store.current.delete(+key);
		await reorderItems();
		await updateItems();
	}

	async function reorder(key: number, newIndex: number) {
		if (!store.current || +key < 0) return;
		const length = await store.current.length;
		if (length === 0) return;
		newIndex = clamp(newIndex, 0, length - 1);
		const oldIndex = items.find(row => row.key === key)?.displayIndex ?? -1;
		if (oldIndex === newIndex || oldIndex === -1) return;
		await store.current.set("displayIndex", newIndex + (oldIndex <= newIndex ? -0.5 : 0.5), +key);
		await reorderItems();
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
	};
}
