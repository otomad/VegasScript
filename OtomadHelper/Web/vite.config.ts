/* eslint-disable @typescript-eslint/no-unused-vars */
// noinspection ES6PreferShortImport

import { resolve as _resolve } from "path";
import react from "@vitejs/plugin-react";
import license from "rollup-plugin-license";
import autoImport from "unplugin-auto-import/vite";
import turboConsole from "unplugin-turbo-console/vite";
import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import noBundlePlugin from "vite-plugin-no-bundle";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import svgr from "vite-plugin-svgr";
import { qrcode } from "vite-plugin-qrcode";
import tsconfigPaths from "vite-tsconfig-paths";
import autoImportConfig from "./auto-import.config";
import { author, displayName, github, homepage, project, version } from "./package.json";
import minifySvgMatrix from "./src/plugins/babel/minify-svg-matrix";
import fragmentFiltersVirtualFile from "./src/plugins/vite/fragment-filters";
import globalized from "./src/plugins/vite/globalized";
import midiKeyframes from "./src/plugins/vite/midi";
import minifyLottieJson from "./src/plugins/vite/minify-lottie-json";
import { svgCursor, svgDataset } from "./src/plugins/vite/svg-cursor";
import injectScript from "./src/plugins/vite/inject-script";
import moment from "moment";
import crowdinBadgeApiLink from "./src/helpers/crowdin-badge-api-link";

const ENABLE_MINIFY = true;
const NO_BUNDLE = false;
const ENABLE_QRCODE = false;

moment.updateLocale("en", {
	longDateFormat: {
		LT: "h:mm:ss A",
		LLLL: "dddd, MMMM Do, NNNN y LT Z",
	} as never,
});

const resolve = (...paths: string[]) => _resolve(__dirname, ...paths);

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
	const DEV = command === "serve", PROD = command === "build";
	return {
		plugins: [
			react({
				babel: {
					plugins: [
						["babel-plugin-react-compiler", { target: "19" }],
						[
							"babel-plugin-styled-components",
							{
								ssr: true,
								displayName: true,
								fileName: false,
								minify: true,
								pure: false,
							},
						],
						"babel-plugin-transform-jsx-classnames",
						minifySvgMatrix,
					],
				},
			}),
			autoImport({
				imports: autoImportConfig,
				dirs: [
					"./src/components/**",
					"./src/composables",
					"./src/utils",
					"./src/hooks",
					"./src/contexts",
					"./src/stores",
					"./src/hoc",
					"./src/classes",
					"./src/locales/.auto-import",
				],
				dts: "./src/types/auto-imports.d.ts",
				defaultExportByFilename: false,
				viteOptimizeDeps: true,
				// @ts-expect-error Please restore cache!!!
				cache: false,
			}),
			globalized(),
			createSvgIconsPlugin({
				iconDirs: [resolve("src/assets/icons")],
				symbolId: "icon-[dir]-[name]",
			}),
			svgr({
				include: "**/*.svg?react",
			}),
			tsconfigPaths(),
			injectScript([
				{ src: "./src/priors/init-system-config-fallback.ts", inline: true },
				{ src: "./src/priors/init-background-color.ts", inline: true },
				{ src: "./src/priors/dpi.ts", type: "iife" },
			]),
			glsl({
				compress: PROD,
			}),
			fragmentFiltersVirtualFile(),
			svgCursor(),
			svgDataset(),
			/* compression({
				skipIfLargerOrEqual: true,
				deleteOriginalAssets: true,
				include: [/\.(x?html?|mht(ml)?|hta|md|css|s[ca]ss|less|styl|[mc]?[jt]sx?|json[5c]?|ya?ml|xa?ml|toml|ini|config|map|(web)?manifest|appcache|[to]tf|ttc|vtt|svg|bmp|ico|cur|ani)$/iu],
			}), */
			turboConsole(),
			midiKeyframes(),
			ViteImageOptimizer({
				test: /\.(svg|gif)$/i, // test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,
			}),
			license({
				banner: {
					commentStyle: "ignored",
					content: {
						file: resolve("banner.template.ejs"),
					},
					data: {
						name: displayName,
						version,
						author,
						homepage,
						repository: github,
						project,
						projectStartDateIso: "2021-09-05 04:14:26+08:00",
					},
				},
			}),
			minifyLottieJson(),
			NO_BUNDLE && noBundlePlugin(),
			ENABLE_QRCODE && qrcode(),
		],
		base: "",
		publicDir: "src/public",
		build: {
			target: "ESNext",
			assetsInlineLimit: 200,
			rollupOptions: {
				output: {
					entryFileNames: "[name].js",
					chunkFileNames: "chunks/[name].js",
					assetFileNames: "assets/[name].[hash].[ext]",
					/* manualChunks(id) {
						if (id.endsWith(".js")) return "../" + id;
						if (id.includes("node_modules")) return "vendor";
						else if (id.includes("svg-icons-register")) return "svgs";
						else if (id.includes("assets/lotties")) return "lotties";
					}, */
				},
			},
			chunkSizeWarningLimit: 500_000, // 500MB
			minify: ENABLE_MINIFY && !NO_BUNDLE && "esbuild", // "terser", // When enable terser, smaller but slower.
			terserOptions: {
				keep_classnames: true,
			},
			lib: NO_BUNDLE ? {
				entry: "src/main.tsx",
				name: "OtomadHelper",
			} : undefined,
		},
		esbuild: {
			keepNames: true, // When enabled, not only keep the class names, but also unexpectedly keep the function names.
		},
		assetsInclude: [
			"**/*.ani",
			"**/*.mid",
		],
		define: {
			// SC_DISABLE_SPEEDY: false, // Enable to speed up styled component, but make debugging more difficult;
		},
		server: {
			proxy: {
				"/api/crowdin": {
					target: crowdinBadgeApiLink,
					changeOrigin: true,
					secure: false,
					rewrite: () => "",
				},
			},
		},
		// optimizeDeps: {
		// 	exclude: ["@dnd-kit/core"],
		// },
		experimental: {
			enableNativePlugin: true,
		},
	};
});
