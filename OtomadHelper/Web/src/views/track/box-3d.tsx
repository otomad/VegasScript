const faces = ["front", "back", "left", "right", "top", "bottom"] as const;
const SIDE_LENGTH = 200;
const DEFAULT_ROTATION = [-27, -36] as TwoD;

const StyledCube = styled.div`
	${styles.mixins.flexCenter()};
	cursor: grab;

	&:active {
		cursor: grabbing;
	}

	.container-2 {
		align-content: center;
		align-self: center;
		block-size: 400px;
		perspective: 750px;

		.container {
			${styles.mixins.square(SIDE_LENGTH + "px")};
			position: relative;
			transform: rotateX(var(--rotate-x, ${DEFAULT_ROTATION[0]})) rotateY(var(--rotate-y, ${DEFAULT_ROTATION[1]}));
			transform-style: preserve-3d;
			user-select: none;

			* {
				${styles.mixins.square(SIDE_LENGTH + "px")};
				position: absolute;
				align-content: center;
				text-align: center;
				background: blue;
				border: 2px solid black;
				border-radius: 8px;
				opacity: 0.5;

				&.front {
					transform: translateZ(${SIDE_LENGTH / 2}px);
				}

				&.back {
					transform: translateZ(${-SIDE_LENGTH / 2}px) rotateY(180deg);
				}

				&.left {
					transform: translateX(${-SIDE_LENGTH / 2}px) rotateY(-90deg);
				}

				&.right {
					transform: translateX(${SIDE_LENGTH / 2}px) rotateY(90deg);
				}

				&.top {
					transform: translateY(${-SIDE_LENGTH / 2}px) rotateX(90deg);
				}

				&.bottom {
					transform: translateY(${SIDE_LENGTH / 2}px) rotateX(-90deg);
				}
			}
		}
	}
`;

export default function Box3d() {
	pageStore.useOnSave(() => configStore.track.box3d.enabled = true);

	const defaultRotation = { x: DEFAULT_ROTATION[0], y: DEFAULT_ROTATION[1] };
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [rotation, setRotation] = useState(defaultRotation);
	const rotationCss = useMemo(() => ({ "--rotate-x": rotation.x + "deg", "--rotate-y": rotation.y + "deg" }), [rotation]);

	const onDragStart: PointerEventHandler<HTMLDivElement> = e => {
		setPosition({ x: Math.round(e.clientX), y: Math.round(e.clientY) });
		e.currentTarget.setPointerCapture(e.pointerId);
	};

	const onDrag: PointerEventHandler<HTMLDivElement> = e => {
		if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
		const ry = Math.abs(rotation.y % 360),
			rxDir = ry > 90 && ry < 270 ? 1 : -1;
		setRotation(({ x, y }) => ({
			x: x + rxDir * (Math.round(e.clientY) - position.y),
			y: y + (Math.round(e.clientX) - position.x) % 360,
		}));
		setPosition({ x: Math.round(e.clientX), y: Math.round(e.clientY) });
	};

	const onDragEnd: PointerEventHandler<HTMLDivElement> = e => {
		setPosition({ x: 0, y: 0 });
		e.currentTarget.releasePointerCapture(e.pointerId);
	};

	const reset = () => {
		setPosition({ x: 0, y: 0 });
		setRotation(defaultRotation);
	};

	return (
		<div className="container">
			<StyledCube onPointerDown={onDragStart} onPointerMove={onDrag} onPointerUp={onDragEnd} onAuxClick={reset}>
				<div className="container-2">
					<div className="container" style={rotationCss}>
						{faces.map(face => <div key={face} className={face}>{face}</div>)}
					</div>
				</div>
			</StyledCube>
		</div>
	);
}
