module.exports = {
  context: __dirname,
  entry: "./lib/missle_command.js",
  output: {
    filename: "./lib/bundle.js"
  },
  resolve: {
    extensions: ["", ".js"]
  },
  devtool: 'source-maps'
};
