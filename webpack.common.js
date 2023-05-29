const path = require("path");
const Html = require("html-webpack-plugin");
const RefreshWebpack = require("@pmmmwh/react-refresh-webpack-plugin");
const RefreshTypescript = require("react-refresh-typescript");

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
    isDevelopment && new RefreshWebpack(),
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
  },
};
