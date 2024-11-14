import prvePingpongImage from "assets/images/effects/prve_pingpong.gif";
import prveWhirlImage from "assets/images/effects/prve_whirl.webp";
import { freezeframes } from "helpers/freezeframe";
import { initWebgl2, type WebGLFilter } from "hooks/webgl/render";
import { getStepChangeHueStep } from "views/visual/prve";
const prvePingpongStaticImage = freezeframes["effects/prve_pingpong.gif"];
const prveWhirlStaticImage = freezeframes["effects/prve_whirl.webp"];

export /* @internal */ const MILLISECONDS_PER_FRAME = 375;

const StyledPreviewPrve = styled.div<{
	/** Effect identifier. */
	$effect: string;
	/** Frame count. */
	$frames?: number;
}>`
	${styles.mixins.square("100%")};
	container: preview-prve / size;

	img {
		position: absolute;
		object-fit: cover;
		animation-duration: calc(var(--frames) * ${MILLISECONDS_PER_FRAME}ms);
		animation-timing-function: step-start;
		animation-iteration-count: infinite;
	}

	canvas {
		${styles.mixins.square("100%")};
		object-fit: cover;
	}

	@layer base {
		--frames: 1;
		--i: 0;
		--adjust-order: 0;
		--adjust-rate: 1;

		img {
			${styles.mixins.square("100%")};
		}
	}

	.animated-image {
		${useLottieStatus.animation("Hover")};
	}

	.items-view-item:not(:hover, :focus-visible, .initial-value-item) & img {
		animation: none;
	}

	.initial-value & img {
		animation-play-state: paused;
		animation-delay: calc((var(--i) + var(--adjust-order)) * -${MILLISECONDS_PER_FRAME}ms / var(--adjust-rate) + 1ms);
	}

	@layer components {
		${({ $frames }) => $frames !== undefined && css`--frames: ${$frames};`};

		${({ $effect }) => {
			const stepChangeHueStep = getStepChangeHueStep($effect);
			if (stepChangeHueStep !== null)
				return css`
					img {
						filter: hue-rotate(${360 / stepChangeHueStep}deg);
						animation: ${keyframes`
							${forMapFromTo(1, stepChangeHueStep, i => {
								const offset = 100 / stepChangeHueStep * (i - 1);
								return `${offset === 0 ? "0%, 100%" : offset + "%"} { filter: hue-rotate(${360 / stepChangeHueStep * i}deg); }`;
							})}
						`};
					}
				`;
			return {
				hFlip: css`
					img {
						scale: -1 1;
						animation: ${keyframes`
							0%, 100% { scale: -1 1; }
							50% { scale: 1; }
						`};
					}
				`,
				vFlip: css`
					img {
						scale: 1 -1;
						animation: ${keyframes`
							0%, 100% { scale: 1 -1; }
							50% { scale: 1; }
						`};
					}
				`,
				ccwFlip: css`
					img {
						scale: 1 -1;
						animation: ${keyframes`
							0%, 100% { scale: 1 -1; }
							25% { scale: -1 -1; }
							50% { scale: -1 1; }
							75% { scale: 1; }
						`};
					}
				`,
				cwFlip: css`
					img {
						scale: -1 1;
						animation: ${keyframes`
							0%, 100% { scale: -1 1; }
							25% { scale: -1 -1; }
							50% { scale: 1 -1; }
							75% { scale: 1; }
						`};
					}
				`,
				ccwRotate: css`
					img {
						width: 100cqh;
						height: 100cqw;
						transform: translate(calc((100cqw - 100cqh) / 2), calc((100cqw - 100cqh) / -2)) rotate(-90deg);
						animation: ${keyframes`
							0%, 100% { transform: translate(calc((100cqw - 100cqh) / 2), calc((100cqw - 100cqh) / -2)) rotate(-90deg); width: 100cqh; height: 100cqw; }
							25% { transform: rotate(-180deg); width: 100%; height: 100%; }
							50% { transform: translate(calc((100cqw - 100cqh) / 2), calc((100cqw - 100cqh) / -2)) rotate(-270deg); width: 100cqh; height: 100cqw; }
							75% { transform: rotate(0deg); width: 100%; height: 100%; }
						`};
					}
				`,
				cwRotate: css`
					img {
						width: 100cqh;
						height: 100cqw;
						transform: translate(calc((100cqw - 100cqh) / 2), calc((100cqw - 100cqh) / -2)) rotate(90deg);
						animation: ${keyframes`
							0%, 100% { transform: translate(calc((100cqw - 100cqh) / 2), calc((100cqw - 100cqh) / -2)) rotate(90deg); width: 100cqh; height: 100cqw; }
							25% { transform: rotate(180deg); width: 100%; height: 100%; }
							50% { transform: translate(calc((100cqw - 100cqh) / 2), calc((100cqw - 100cqh) / -2)) rotate(270deg); width: 100cqh; height: 100cqw; }
							75% { transform: rotate(0deg); width: 100%; height: 100%; }
						`};
					}
				`,
				turned: css`
					img {
						rotate: 180deg;
						animation: ${keyframes`
							0%, 100% { rotate: 180deg; }
							50% { rotate: 0deg; }
						`};
					}
				`,
				zoomOutIn: css`
					img {
						scale: 10;
						animation: ${keyframes`
							from { scale: 10; }
							to { scale: 1; }
						`} alternate;
						animation-timing-function: ${eases.easeOutMax} !important;
					}
				`,
				hMirror: css`
					--adjust-order: 1;
					img:nth-child(2) {
						scale: -1 1;
						clip-path: inset(0 50% 0 0);
						animation: ${keyframes`
							0%, 100% { clip-path: inset(0 50% 0 0); scale: -1 1; }
							50% { clip-path: inset(0 0 0 50%); }
						`};
					}
				`,
				vMirror: css`
					--adjust-order: 1;
					img:nth-child(2) {
						scale: 1 -1;
						clip-path: inset(0 0 50% 0);
						animation: ${keyframes`
							0%, 100% { clip-path: inset(0 0 50% 0); scale: 1 -1; }
							50% { clip-path: inset(50% 0 0 0); }
						`};
					}
				`,
				ccwMirror: css`
					img:nth-child(2) {
						scale: -1 1;
						clip-path: inset(0 50% 0 0);
						animation: ${keyframes`
							0%, 75%, 100% { clip-path: inset(0 50% 0 0); }
							25%, 50% { clip-path: inset(0 0 0 50%); }
						`};
					}
					img:nth-child(3) {
						scale: 1 -1;
						clip-path: inset(50% 0 0 0);
						animation: ${keyframes`
							0%, 25%, 100% { clip-path: inset(50% 0 0 0); }
							50%, 75% { clip-path: inset(0 0 50% 0); }
						`};
					}
					img:nth-child(4) {
						scale: -1;
						clip-path: inset(50% 50% 0 0);
						animation: ${keyframes`
							0%, 100% { clip-path: inset(50% 50% 0 0); }
							25% { clip-path: inset(50% 0 0 50%); }
							50% { clip-path: inset(0 0 50% 50%); }
							75% { clip-path: inset(0 50% 50% 0); }
						`};
					}
				`,
				cwMirror: css`
					img:nth-child(2) {
						scale: -1 1;
						clip-path: inset(0 0 0 50%);
						animation: ${keyframes`
							0%, 25%, 100% { clip-path: inset(0 0 0 50%); }
							50%, 75% { clip-path: inset(0 50% 0 0); }
						`};
					}
					img:nth-child(3) {
						scale: 1 -1;
						clip-path: inset(0 0 50% 0);
						animation: ${keyframes`
							0%, 75%, 100% { clip-path: inset(0 0 50% 0); }
							25%, 50% { clip-path: inset(50% 0 0 0); }
						`};
					}
					img:nth-child(4) {
						scale: -1;
						clip-path: inset(0 0 50% 50%);
						animation: ${keyframes`
							0%, 100% { clip-path: inset(0 0 50% 50%); }
							25% { clip-path: inset(50% 0 0 50%); }
							50% { clip-path: inset(50% 50% 0 0); }
							75% { clip-path: inset(0 50% 50% 0); }
						`};
					}
				`,
				negative: css`
					img {
						filter: invert(1);
						animation: ${keyframes`
							0%, 100% { filter: invert(1); }
							50% { filter: none; }
						`};
					}
				`,
				luminInvert: css`
					img {
						filter: invert(1) hue-rotate(180deg);
						animation: ${keyframes`
							0%, 100% { filter: invert(1) hue-rotate(180deg); }
							50% { filter: none; }
						`};
					}
				`,
				negativeFade: css`
					--frames: 1;
					img:nth-child(1) {
						opacity: 0;
						animation: ${keyframes`
							0% { opacity: 0; animation-timing-function: ${eases.easeInMax}; }
							50% { opacity: 1; animation-timing-function: ${eases.easeOutMax}; }
							100% { opacity: 1; }
						`} alternate;
					}
					img:nth-child(2) {
						filter: invert(1);
						mix-blend-mode: difference;
						animation: ${keyframes`
							0% { opacity: 1; animation-timing-function: ${eases.easeInMax}; }
							50% { opacity: 1; animation-timing-function: ${eases.easeOutMax}; }
							100% { opacity: 0; }
						`} alternate;
					}
				`,
				hueInvert: css`
					img {
						filter: hue-rotate(180deg);
						animation: ${keyframes`
							0%, 100% { filter: hue-rotate(180deg); }
							50% { filter: none; }
						`};
					}
				`,
				chromatic: css`
					img {
						filter: grayscale(1);
						animation: ${keyframes`
							0%, 100% { filter: grayscale(1); }
							50% { filter: none; }
						`};
					}
				`,
				chromaticFade: css`
					img {
						filter: grayscale(1);
						animation: ${keyframes`
							0%, 100% { filter: grayscale(1); }
							50% { filter: none; }
						`};
						animation-timing-function: ${eases.easeOutMax} !important;
					}
				`,
				vExpansion: css`
					img {
						transform-origin: center bottom;
						scale: 1 0.75;
						animation: ${keyframes`
							from { scale: 1 0.75; }
							to { scale: 1; }
						`};
						animation-timing-function: ${eases.easeOutMax} !important;
					}
				`,
				vExpansionBounce: css`
					img {
						transform-origin: center bottom;
						scale: 1 0.75;
						animation: ${keyframes`
							from { scale: 1 0.75; }
							to { scale: 1; }
						`} alternate;
						animation-timing-function: ${eases.easeOutMax} !important;
					}
				`,
				vCompression: css`
					img {
						transform-origin: center bottom;
						animation: ${keyframes`
							from { scale: 1; }
							to { scale: 1 0.75; }
						`};
						animation-timing-function: ${eases.easeOutMax} !important;
					}
				`,
				vCompressionBounce: css`
					img {
						transform-origin: center bottom;
						animation: ${keyframes`
							from { scale: 1; }
							to { scale: 1 0.75; }
						`} alternate;
						animation-timing-function: ${eases.easeOutMax} !important;
					}
				`,
				vBounce: css`
					img {
						scale: 1 0.5;
						animation: ${keyframes`
							from { scale: 1 0.5; }
							to { scale: 1; }
						`};
						animation-timing-function: ${eases.easeOutMax} !important;
					}
				`,
				slantDown: css`
					--adjust-order: 1;
					--adjust-rate: 0.5;
					img {
						transform: skewX(25deg) scaleX(0.5);
						transform-origin: center bottom;
						animation: ${keyframes`
							0% { transform: skewX(25deg) scaleX(0.5); }
							50% { transform: scale(0.5); animation-timing-function: ${eases.easeOutMax}; }
							100% { transform: skewX(-25deg) scaleX(0.5); }
						`} alternate;
						animation-timing-function: ${eases.easeInMax} !important;
					}
				`,
				slantUp: css`
					--adjust-order: 1;
					--adjust-rate: 0.5;
					img {
						transform: skewX(25deg) scale(0.5);
						transform-origin: center bottom;
						animation: ${keyframes`
							0%, { transform: skewX(25deg) scale(0.5); }
							50% { transform: scaleX(0.5); animation-timing-function: ${eases.easeInMax}; }
							100% { transform: skewX(-25deg) scale(0.5); }
						`} alternate;
						animation-timing-function: ${eases.easeOutMax} !important;
					}
				`,
				puyo: css`
					--adjust-order: 1;
					img {
						scale: 1 0.75;
						animation: ${keyframes`
							0%, 100% { scale: 1 0.75; }
							50% { scale: 0.75 1; }
						`};
						animation-timing-function: ${eases.easeOutMax} !important;
					}
				`,
				pendulum: css`
					--adjust-order: 1;
					img {
						scale: 0.5;
						rotate: -25deg;
						animation: ${keyframes`
							0%, 100% { rotate: -25deg; }
							50% { rotate: 25deg; }
						`};
						animation-timing-function: ${eases.easeOutMax} !important;
					}
				`,
				gaussianBlur: css`
					img {
						scale: 1.05;
						filter: blur(5px);
						animation: ${keyframes`
							from { filter: blur(5px); scale: 1.05; }
							to { filter: blur(0); }
						`};
						animation-timing-function: ${eases.easeOutMax} !important;
					}
				`,
				wipeRight: css`
					--adjust-order: 1;
					img {
						clip-path: inset(0 75% 0 0);
						animation: ${keyframes`
							0% { clip-path: inset(0 100% 0 0); }
							50% { clip-path: inset(0 0 0 0); }
							100% { clip-path: inset(0 0 0 100%); }
						`};
						animation-timing-function: ${eases.easeOutMax} !important;
					}
				`,
				wipeRight1: css`
					--adjust-order: 1;
					img {
						clip-path: inset(0 75% 0 0);
						animation: ${keyframes`
							0% { clip-path: inset(0 100% 0 0); }
							50% { clip-path: inset(0 0 0 0); }
							100% { clip-path: inset(0 0 0 100%); }
						`};
						animation-timing-function: ${eases.easeOutMax} !important;
					}
				`,
				splitVOut: css`
					img {
						clip-path: inset(25% 0 25% 0);
						animation: ${keyframes`
							from { clip-path: inset(25% 0 25% 0); }
							to { clip-path: inset(0 0 0 0); }
						`};
						animation-timing-function: ${eases.easeOutMax} !important;
					}
				`,
			}[$effect];
		}}
	}
`;

export default function PreviewPrve({ thumbnail, effect, frames, ...htmlAttrs }: FCP<{
	/** Thumbnail. */
	thumbnail: string;
	/** Effect identifier. */
	effect: string;
	/** Frame count. */
	frames?: number;
}, "div">) {
	const imageCount = {
		hMirror: 2,
		vMirror: 2,
		ccwMirror: 4,
		cwMirror: 4,
		radialBlur: 2,
		negativeFade: 2,
	}[effect] ?? 1;

	// const canvasFilters = useCanvasFilters(thumbnail);
	// const webglFilters = useWebglFilters(thumbnail);

	/* const alterImage = {
		negativeLuma: webglFilters?.negativeLuma,
		radialBlur: webglFilters?.radialBlur,
	}[effect]; */

	const webglFilters = ["negativeLuma", "radialBlur"];

	const animatedImage = {
		pingpong: Tuple(prvePingpongImage, prvePingpongStaticImage),
		whirl: Tuple(prveWhirlImage, prveWhirlStaticImage),
	}[effect];

	return (
		<StyledPreviewPrve $effect={effect} $frames={frames} {...htmlAttrs}>
			{webglFilters.includes(effect) ? <WebglFilter src={thumbnail} effect={effect} /> :
			forMap(imageCount, i => animatedImage !== undefined ?
				<HoverToChangeImg key={i} animatedSrc={animatedImage[0]} staticSrc={animatedImage[1]} /> :
				<img key={i} src={thumbnail} />)}
		</StyledPreviewPrve>
	);
}

function HoverToChangeImg({ staticSrc, animatedSrc }: FCP<{
	/** Static image source path. */
	staticSrc: string;
	/** Animated picture source path. */
	animatedSrc: string;
}>) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<EventInjector onAnimationStart={() => setIsHovered(true)} onAnimationCancel={() => setIsHovered(false)}>
			<img src={isHovered ? animatedSrc : staticSrc} className="animated-image" />
		</EventInjector>
	);
}

function WebglFilter({ src, effect }: {
	/** Image source path. */
	src: string;
	/** Effect identifier. */
	effect: string;
}) {
	const canvas = useDomRef<"canvas">();
	const filter = useRef<WebGLFilter>();
	const [isHovered, setIsHovered] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	const [uniform, setUniform] = useState<Parameters<WebGLFilter["uniform"]>>();

	useAsyncMountEffect(async () => {
		if (!canvas.current) return;
		filter.current = initWebgl2(canvas.current);
		const image = await createImageFromUrl(src);
		filter.current.changeImage(image);
		filter.current.changeFilter(effect);
		setIsMounted(true);
	});

	useEffect(() => {
		if (!isMounted) return;
		switch (effect) {
			case "radialBlur":
				setUniform(["1f", "strength", 0.15]);
				break;
			case "negativeLuma":
				setUniform(["1f", "progress", 0.5]);
				break;
			default:
				break;
		}
	}, [isMounted, isHovered]);

	useEffect(() => {
		if (!isMounted || !filter.current || !uniform) return;
		filter.current.uniform(...uniform);
		filter.current.apply();
	}, [uniform]);

	return <canvas ref={canvas} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} />;
}
