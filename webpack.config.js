const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: {
    app: "./src/demo/demo.js",
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist",
  },
  resolve: {
    modules: ["node_modules", "src"],
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: "ts-loader" },
      { test: /\.svg$/, loader: "file-loader" },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Development",
      template: "src/demo/index.html",
    }),
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
}
