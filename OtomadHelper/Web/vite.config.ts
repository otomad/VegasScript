/* eslint-disable @typescript-eslint/no-unused-vars */
// noinspection ES6PreferShortImport

import { resolve as _resolve } from "path";
import react from "@vitejs/plugin-react";
import { transform as transformCSS } from "lightningcss";
import license from "rollup-plugin-license";
import autoImport from "unplugin-auto-import/vite";
import turboConsole from "unplugin-turbo-console/vite";
import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import htmlMinifier from "vite-plugin-html-minifier";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import noBundlePlugin from "vite-plugin-no-bundle";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import autoImportConfig from "./auto-import.config";
import { author, displayName, github, homepage, project, version } from "./package.json";
import minifySvgMatrix from "./src/plugins/babel/minify-svg-matrix";
import fragmentFiltersVirtualFile from "./src/plugins/vite/fragment-filters";
import globalized from "./src/plugins/vite/globalized";
import midiKeyframes from "./src/plugins/vite/midi";
import minifyLottieJson from "./src/plugins/vite/minify-lottie-json";
import queryNoContent from "./src/plugins/vite/query-nocontent";
import { svgCursor, svgDataset } from "./src/plugins/vite/svg-cursor";

const ENABLE_MINIFY = true;
const NO_BUNDLE = false;

const resolve = (...paths: string[]) => _resolve(__dirname, ...paths);

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
	const DEV = command === "serve", PROD = command === "build";
	return {
		plugins: [
			react({
				babel: {
					plugins: [
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
			htmlMinifier({
				minify: {
					collapseWhitespace: true,
					keepClosingSlash: false,
					removeComments: true,
					removeRedundantAttributes: true,
					removeScriptTypeAttributes: true,
					removeStyleLinkTypeAttributes: true,
					removeEmptyAttributes: true,
					useShortDoctype: true,
					minifyCSS: (text: string) => transformCSS({ minify: true, code: Buffer.from(text), filename: "index.html" }).code.toString(),
					minifyJS: true,
					minifyURLs: true,
				},
			}),
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
			queryNoContent(),
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
					},
				},
			}),
			minifyLottieJson(),
			NO_BUNDLE && noBundlePlugin(),
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
			"**/*.cur",
			"**/*.ani",
		],
		define: {
			// SC_DISABLE_SPEEDY: false, // Enable to speed up styled component, but make debugging more difficult;
		},
		server: {
			proxy: {
				"/api/crowdin": {
					target: "https://badges.awesome-crowdin.com/stats-16002405-661336.json",
					changeOrigin: true,
					secure: false,
					rewrite: () => "",
				},
			},
		},
	};
});
