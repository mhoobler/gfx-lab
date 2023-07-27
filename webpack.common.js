const path = require("path");
const Html = require("html-webpack-plugin");
const RefreshWebpack = require("@pmmmwh/react-refresh-webpack-plugin");
const RefreshTypescript = require("react-refresh-typescript");
const Copy = require("copy-webpack-plugin");
const CircularDependencyPlugin = require('circular-dependency-plugin')

const isDevelopment = process.env.NODE_ENV !== "production";
console.log("NODE_ENV: " + process.env.NODE_ENV);

module.exports = {
  mode: isDevelopment ? "development" : "production",
  entry: {
    app: "./src/index.tsx",
  },
  plugins: [
    new Html({
      title: "Development",
      template: "./src/index.html",
    }),
    new Copy({
      patterns: [{ from: "**/*", to: "[file]", context: "src/assets" }],
    }),
    isDevelopment && new RefreshWebpack(),
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /a\.js|node_modules/,
      // add errors to webpack instead of warnings
      failOnError: true,
      // allow import cycles that include an asyncronous import,
      // e.g. via import(/* webpackMode: "weak" */ './file.js')
      allowAsyncCycles: false,
      // set the current working directory for displaying module paths
      cwd: process.cwd(),
    })
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              getCustomTransformers: () => ({
                before: [isDevelopment && RefreshTypescript()].filter(Boolean),
              }),
              transpileOnly: isDevelopment,
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
    ],
  },
  resolve: {
    modules: [
      path.resolve(__dirname, "src"),
      path.resolve(__dirname, "node_modules"),
    ],
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      Components: path.resolve(__dirname, "src/components")
    }
  },
};
