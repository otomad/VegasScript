export default css`
	/* stylelint-disable selector-id-pattern */
	/* stylelint-disable selector-class-pattern */

	// #region Crowdin JIPT
	#crowdin-jipt-mask {
		background-color: ${c("background-color")} !important;

		&,
		* {
			transition: none;
		}
	}

	#jipt-close-btn {
		color: ${c("foreground-color")} !important;
	}

	.crowdin_phrase {
		pointer-events: auto;
	}

	.jipt-loader {
		transition: scale 1s ${eases.easeOutElastic} !important;

		@starting-style {
			scale: 0;
		}
	}
	// #endregion
`;
