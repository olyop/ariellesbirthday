import path from "node:path"
import { readFileSync } from "node:fs"
import DotenvPlugin from "dotenv-webpack"
import ESLintPlugin from "eslint-webpack-plugin"
import webpack, { Configuration } from "webpack"
import CopyWebpackPlugin from "copy-webpack-plugin"
import HTMLWebpackPlugin from "html-webpack-plugin"
import StylelintPlugin from "stylelint-webpack-plugin"
import CompressionPlugin from "compression-webpack-plugin"
import MiniCSSExtractPlugin from "mini-css-extract-plugin"
import CSSMinimizerPlugin from "css-minimizer-webpack-plugin"
import { Configuration as DevServerConfiguration } from "webpack-dev-server"

import packageDotJSON from "./package.json" assert { type: "json" }

const IS_DEVELOPMENT =
	process.env.NODE_ENV === "development"

const ROOT_PATH = process.cwd()
const SRC_PATH = path.join(ROOT_PATH, "src")
const SRC_PUBLIC_PATH = path.join(SRC_PATH, "public")
const SRC_ROOT_PATH = path.join(SRC_PATH, "index.tsx")
const SRC_ENTRY_PATH = path.join(SRC_PATH, "index.html")

const BUILD_PATH = path.join(ROOT_PATH, "build")

const devServer: DevServerConfiguration = {
	host: process.env.HOST,
	port: process.env.PORT,
	historyApiFallback: true,
	client: {
		logging: "none",
	},
	static: {
		directory: SRC_PUBLIC_PATH,
	},
	server: process.env.HTTPS === "true" ? {
		type: "https",
		options: {
			cert: readFileSync(process.env.TLS_CERTIFICATE_PATH),
			key: readFileSync(process.env.TLS_CERTIFICATE_KEY_PATH),
		},
	} : undefined,
}

const firstCSSLoader =
	IS_DEVELOPMENT ?
		"style-loader" :
		MiniCSSExtractPlugin.loader

const config: Configuration = {
	devServer,
	devtool: false,
	stats: "errors-only",
	entry: SRC_ROOT_PATH,
	mode: process.env.NODE_ENV,
	output: {
		publicPath: "/",
		path: BUILD_PATH,
		filename: "index-[fullhash].js",
	},
	resolve: {
		symlinks: false,
		extensions: [".js", ".ts", ".tsx"],
	},
	watchOptions: {
		ignored: "/node_modules/",
	},
	experiments: {
		topLevelAwait: true,
	},
	module: {
		rules: [{
			test: /\.tsx?$/,
			loader: "ts-loader",
			options: {
				onlyCompileBundledFiles: true,
			},
		},{
			test: /\.css$/,
			use: [
				firstCSSLoader,
				"css-loader",
			],
		},{
			test: /\.scss$/,
			use: [
				firstCSSLoader,
				"css-loader",
				"sass-loader",
			],
		}],
	},
	plugins: [
		new DotenvPlugin(),
		new webpack.DefinePlugin({
			VERSION: JSON.stringify(packageDotJSON.version),
		}),
		new HTMLWebpackPlugin({
			minify: true,
			filename: "index.html",
			template: SRC_ENTRY_PATH,
		}),
		new StylelintPlugin({
			extensions: ["scss"],
		}),
		new ESLintPlugin({
			extensions: ["ts", "tsx"],
		}),
		...(IS_DEVELOPMENT ? [] : [
			new CompressionPlugin(),
			new CSSMinimizerPlugin(),
			new MiniCSSExtractPlugin({
				filename: "index-[fullhash].css",
			}),
			new CopyWebpackPlugin({
				patterns: [{
					to: BUILD_PATH,
					from: SRC_PUBLIC_PATH,
				}],
			}),
		]),
	],
}

export default config