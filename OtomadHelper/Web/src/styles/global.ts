import { globalColors } from "./colors";
import eases from "./eases";
import fakeAnimations from "./fake-animations";
import reset from "./reset";

const GlobalStyle = createGlobalStyle<{
	/** Has the page loaded completely? */
	$ready?: boolean;
}>`
	/* stylelint-disable selector-id-pattern */
	/* stylelint-disable selector-class-pattern */

	${globalColors()};
	${fakeAnimations};

	*,
	::before,
	::after {
		--cjk-font-family: "Microsoft YaHei UI";
		box-sizing: border-box;
		scroll-behavior: smooth;
		// Kick out the \`system-ui\`.
		font-family: "Yozora Sans", Inter, "Segoe UI Variable", "Segoe UI", var(--cjk-font-family), "Microsoft YaHei UI", sans-serif;
		font-optical-sizing: auto;
		hyphens: auto;
		hyphenate-limit-chars: 10;
		user-select: none;
		transition: ${fallbackTransitions};
		forced-color-adjust: none;
		-webkit-tap-highlight-color: transparent;

		:where(&) {
			/* color: var(--foreground-color); */
			text-wrap: pretty;
		}

		${({ $ready }) => !$ready && css`
			transition: all ${eases.easeOutMax} 250ms, color 0s, fill 0s, font-size 0s, tab-size 0s;
		`}
	}

	:lang(zh-Hant) {
		&,
		&::before,
		&::after {
			--cjk-font-family: "Microsoft JhengHei UI";
		}
	}

	:lang(ja) {
		&,
		&::before,
		&::after {
			--cjk-font-family: "Yu Gothic UI", "Meiryo UI", "MS UI Gothic";
		}
	}

	:lang(ko) {
		&,
		&::before,
		&::after {
			--cjk-font-family: "Malgun Gothic";
		}
	}

	.no-yozora {
		&,
		* {
			&,
			&::before,
			&::after {
				font-family: "Segoe UI Variable", "Segoe UI", sans-serif;
			}
		}
	}

	code,
	pre,
	kbd,
	samp,
	tt,
	xmp {
		&,
		* {
			&,
			&::before,
			&::after {
				font-family: "Cascadia Code", "Cascadia Mono", "JetBrains Mono", "Segoe UI Mono", Consolas, "SF Mono", monospace;
			}
		}
	}

	math {
		&,
		* {
			font-family: "Lete Sans Math", math;
		}
	}

	:focus,
	:focus-visible {
		outline: none;
	}

	:focus-visible {
		${styles.effects.focus()};
	}

	html {
		${styles.effects.text.body};
		line-height: normal;
		interpolate-size: allow-keywords;
	}

	html,
	body {
		overflow: clip;
	}

	body {
		height: 100dvh;
		margin: 0;
		padding: 0;
		color: var(--foreground-color);
		font-feature-settings: "halt";
		font-kerning: normal;
		font-synthesis: none;
		font-variant-ligatures: common-ligatures historical-ligatures contextual;
		font-variant-numeric: proportional-nums;
		text-rendering: optimizeLegibility;
		tab-size: 4;
		background-color: var(--background-color);
		transition: ${fallbackTransitions}, width 0s, height 0s;
		color-scheme: dark;
		accent-color: var(--accent-color);
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;

		&:where(:lang(zh), :lang(ja), :lang(ko)) {
			text-align: justify;
		}

		${ifColorScheme.light} & {
			color-scheme: only light;
		}

		${({ $ready }) => !$ready && css`
			transition: background-color 0s;
		`}
	}

	#root {
		display: contents;
	}

	.enter:not(.enter-active),
	.appear:not(.appear-active),
	.enter-from,
	.appear-from {
		&,
		* {
			&,
			&::before,
			&::after {
				transition: none !important;
			}
		}
	}

	.calc-size {
		position: fixed;
		opacity: 0;
		visibility: hidden;
		transition: none;
	}

	svg,
	svg * {
		transition: ${fallbackTransitions}, color 0s;
	}

	// Additional calculated colors
	:root {
		--fill-color-system-accent-background: rgb(from var(--accent-color) r g b / 15%);
		--fallback-transitions-for-contrast-scheme: content 0s; // Placeholder for a invalid property.
	}

	// Color mode transition
	::view-transition-old(root),
	::view-transition-new(root) {
		mix-blend-mode: normal;
		animation: none;
	}

	body[style*="--cursor"] {
		&,
		* {
			&,
			::before,
			::after {
				cursor: var(--cursor) !important;
			}
		}
	}

	// User requested to reduce dynamic effects
	@media (prefers-reduced-motion: reduce) {
		${important(2)} {
			&,
			&::before,
			&::after {
				scroll-behavior: auto;
				transition-duration: 0s !important;
				transition-delay: 0s !important;
				animation-duration: 0s !important;
				animation-delay: 0s !important;
			}
		}
	}

	// System requested high contrast theme.
	${ifColorScheme.contrast} {
		*,
		::before,
		::after {
			backdrop-filter: none !important;
		}

		:root& {
			--fallback-transitions-for-contrast-scheme: color 0s, background-color 0s, border-color 0s;
		}
	}

	@media (prefers-reduced-transparency: reduce) {
		*,
		::before,
		::after {
			backdrop-filter: none !important;
		}
	}

	${reset}
`;

export default GlobalStyle;
