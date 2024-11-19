const FROM_60FPS = 1000 / 60;
const WINDOW_SIZE = 100;

const store = createStore({
	lastTime: 0,
	intervalWindow: Array<number>(WINDOW_SIZE),
	i: 0,
	addInterval(value: number) { store.intervalWindow[store.i] = value; store.i = (store.i + 1) % WINDOW_SIZE; },
	get intervalWindowLength(): number { return store.intervalWindow.toTrimmed().length; },
});

export const getFrameInterval = () => store.intervalWindowLength === 0 ? FROM_60FPS :
	Math.min(store.intervalWindow.reduce((a, b) => a + b) / store.intervalWindowLength, FROM_60FPS);
export const getFrameInterval60 = () => getFrameInterval() / FROM_60FPS;

function get() {
	if (store.lastTime === 0)
		store.lastTime = performance.now();
	else {
		const nowTime = performance.now();
		const interval = nowTime - store.lastTime;
		store.lastTime = nowTime;
		store.addInterval(interval);
	}
}

function animationFrame() {
	get();
	requestAnimationFrame(animationFrame);
}
animationFrame();
