import path from "node:path";
import { load } from "js-yaml";
import { readFileSync } from "node:fs";
import DotenvPlugin from "dotenv-webpack";
import { readFile } from "node:fs/promises";
import ESLintPlugin from "eslint-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import HTMLWebpackPlugin from "html-webpack-plugin";
import { Options as TSLoaderOptions } from "ts-loader";
import StylelintPlugin from "stylelint-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin";
import MiniCSSExtractPlugin from "mini-css-extract-plugin";
import CSSMinimizerPlugin from "css-minimizer-webpack-plugin";
import webpack, { Configuration, WebpackPluginInstance } from "webpack";
import { Configuration as DevelopmentServerConfiguration } from "webpack-dev-server";

import { Config } from "./src/config-type";

import packageDotJSON from "./package.json" assert { type: "json" };

const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

const ROOT_PATH = process.cwd();
const SRC_PATH = path.join(ROOT_PATH, "src");
const SRC_PUBLIC_PATH = path.join(SRC_PATH, "public");
const SRC_ROOT_PATH = path.join(SRC_PATH, "index.tsx");
const SRC_ENTRY_PATH = path.join(SRC_PATH, "index.html");
const TSCONFIG_PATH = path.join(ROOT_PATH, "tsconfig.json");
const SRC_CONFIG_PATH = path.join(SRC_PUBLIC_PATH, "config.yaml");

const BUILD_PATH = path.join(ROOT_PATH, "build");

const configFile = await readFile(SRC_CONFIG_PATH);
const config = (await load(configFile.toString())) as Config;

const HTTPS_OPTIONS = {
	type: "https",
	options: {
		cert: readFileSync(process.env.TLS_CERTIFICATE_PATH),
		key: readFileSync(process.env.TLS_CERTIFICATE_KEY_PATH),
	},
};

// eslint-disable-next-line unicorn/prevent-abbreviations
const devServer: DevelopmentServerConfiguration = {
	host: process.env.HOST,
	port: process.env.PORT,
	historyApiFallback: true,
	client: {
		logging: "none",
	},
	static: {
		directory: SRC_PUBLIC_PATH,
	},
	server: process.env.HTTPS === "true" ? HTTPS_OPTIONS : undefined,
};

const firstCSSLoader = IS_DEVELOPMENT ? "style-loader" : MiniCSSExtractPlugin.loader;

const tsLoaderOptions: Partial<TSLoaderOptions> = {
	configFile: TSCONFIG_PATH,
	onlyCompileBundledFiles: true,
};

const developmentPlugins: WebpackPluginInstance[] = [
	new CompressionPlugin(),
	new CSSMinimizerPlugin(),
	new MiniCSSExtractPlugin({
		filename: "index-[fullhash].css",
	}),
	new CopyWebpackPlugin({
		patterns: [
			{
				to: BUILD_PATH,
				from: SRC_PUBLIC_PATH,
			},
		],
	}),
];

const webpackConfiguration: Configuration = {
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
		fullySpecified: false,
		extensions: [".js", ".ts", ".tsx", ".css"],
	},
	watchOptions: {
		ignored: "/node_modules/",
	},
	experiments: {
		topLevelAwait: true,
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: "ts-loader",
				options: tsLoaderOptions,
			},
			{
				test: /\.css$/,
				use: [
					firstCSSLoader,
					{
						loader: "css-loader",
						options: {
							url: false,
						},
					},
				],
			},
			{
				test: /\.scss$/,
				use: [
					firstCSSLoader,
					{
						loader: "css-loader",
						options: {
							url: false,
						},
					},
					"sass-loader",
				],
			},
		],
	},
	plugins: [
		new DotenvPlugin(),
		new webpack.DefinePlugin({
			VERSION: JSON.stringify(packageDotJSON.version),
		}),
		new HTMLWebpackPlugin({
			minify: true,
			title: config.title,
			filename: "index.html",
			template: SRC_ENTRY_PATH,
		}),
		new StylelintPlugin({
			extensions: ["scss"],
		}),
		new ESLintPlugin({
			extensions: ["ts", "tsx"],
		}),
		...(IS_DEVELOPMENT ? [] : developmentPlugins),
	],
};

export default webpackConfiguration;
