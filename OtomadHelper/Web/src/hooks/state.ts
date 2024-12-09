type Options = Partial<{
	delay: number;
	keep: number;
	allowInterrupt: boolean;
}>;

export function useDelayState<T>(): [T | undefined, (value: React.SetStateAction<T | undefined>, options?: Options) => Promise<void>];
export function useDelayState<T>(initialState: T): [T, (value: React.SetStateAction<T>, options?: Options) => Promise<void>];
export function useDelayState<T>(initialState?: T) {
	const [state, setStateInternal] = useState(initialState);
	const delayTimeoutId = useRef<Timeout>(undefined);
	const keepTimeoutId = useRef<Timeout>(undefined);
	const setState = async (value: React.SetStateAction<T>, options: Options = {}) => {
		if (keepTimeoutId.current && !options.allowInterrupt) return;
		clearTimeout(delayTimeoutId.current);
		clearTimeout(keepTimeoutId.current);
		if (options.delay)
			await delay(options.delay, delayTimeoutId);
		delayTimeoutId.current = undefined;
		setStateInternal(value as T);
		if (options.keep)
			await delay(options.keep, keepTimeoutId);
		keepTimeoutId.current = undefined;
	};

	return [state, setState];
}
