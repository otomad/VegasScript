import grab from "assets/cursors/grab.svg?cursor";
import grabbing from "assets/cursors/grabbing.svg?cursor";
import Point from "classes/Point"; // FIXME: Expect auto import, but won't work now.

const faces = ["front", "back", "left", "right", "top", "bottom"] as const;
const SIDE_LENGTH = 200;
const DEFAULT_ROTATION = Object.freeze(new Point(-27, -36));

const StyledCube = styled.div`
	${styles.mixins.flexCenter()};
	cursor: ${grab};

	&:active {
		cursor: ${grabbing};
	}

	.container-outer {
		align-content: center;
		align-self: center;
		block-size: 400px;
		perspective: 750px;

		.container {
			${styles.mixins.square(SIDE_LENGTH + "px")};
			position: relative;
			transform: rotateX(var(--rotate-x, ${DEFAULT_ROTATION.x})) rotateY(var(--rotate-y, ${DEFAULT_ROTATION.y}));
			transform-style: preserve-3d;
			user-select: none;

			@starting-style {
				transform: none;
			}

			main.page.exit-done &,
			main.page.enter:not(.enter-active) & {
				transform: none;
			}

			* {
				${styles.mixins.square(SIDE_LENGTH + "px")};
				position: absolute;
				align-content: center;
				text-align: center;
				background-color: blue;
				border: 2px solid black;
				border-radius: 8px;
				opacity: 0.875;

				&:hover {
					background-color: skyblue;
				}

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

	const [position, setPosition] = useState(Point.zero);
	const [rotation, setRotation] = useState<Point>(DEFAULT_ROTATION);
	const rotationCss = useMemo(() => ({ "--rotate-x": rotation.x + "deg", "--rotate-y": rotation.y + "deg" }), [rotation]);

	const onDragStart: PointerEventHandler<HTMLDivElement> = e => {
		setPosition(new Point(Math.round(e.clientX), Math.round(e.clientY)));
		e.currentTarget.setPointerCapture(e.pointerId);
	};

	const onDrag: PointerEventHandler<HTMLDivElement> = e => {
		if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
		const rx = PNMod(rotation.x, 360),
			ryDir = rx > 90 && rx < 270 ? 1 : -1;
		setRotation(({ x, y }) => new Point(
			x - (Math.round(e.clientY) - position.y),
			y - ryDir * (Math.round(e.clientX) - position.x) % 360,
		));
		setPosition(new Point(Math.round(e.clientX), Math.round(e.clientY)));
	};

	const onDragEnd: PointerEventHandler<HTMLDivElement> = e => {
		setPosition(Point.zero);
		e.currentTarget.releasePointerCapture(e.pointerId);
	};

	const reset = () => {
		setPosition(Point.zero);
		setRotation(DEFAULT_ROTATION);
	};

	return (
		<div className="container">
			<StyledCube onPointerDown={onDragStart} onPointerMove={onDrag} onPointerUp={onDragEnd} onAuxClick={reset}>
				<div className="container-outer">
					<div className="container" style={rotationCss}>
						{faces.map(face => <div key={face} className={face}>{face}</div>)}
					</div>
				</div>
			</StyledCube>
		</div>
	);
}
