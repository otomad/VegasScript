const FROM_60FPS = 1000 / 60;

const store = createStore({
	lastTime: 0,
	interval: 1,
	get interval60() { return store.interval / FROM_60FPS; },
});

function get() {
	if (store.lastTime === 0) {
		store.lastTime = performance.now();
		store.interval = FROM_60FPS;
	} else {
		const nowTime = performance.now();
		const interval = nowTime - store.lastTime;
		store.lastTime = nowTime;
		store.interval = interval;
	}
}

function animationFrame() {
	get();
	requestAnimationFrame(animationFrame);
}
animationFrame();

export const getFrameInterval = () => store.interval;
export const getFrameInterval60 = () => store.interval60;
