const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  devtool: "source-map",
  devServer: {
    static: "./dist",
    port: "3000",
    hot: false,
    compress: false,
    //proxy: {
    //  context: () => true,
    //  target: "http://localhost:3001",
    //},
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
});
