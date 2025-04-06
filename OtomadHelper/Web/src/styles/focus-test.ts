// Focus testing

const twinkling = keyframes`
	0% {
		filter: invert(1);
		backdrop-filter: invert(1);
	}

	50% {
		filter: none;
		backdrop-filter: none;
	}
`;

const animationStyle = css`animation: ${twinkling} 1s step-end infinite !important;`;

export default animationStyle;
