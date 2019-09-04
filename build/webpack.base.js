const path = require("path");

module.exports = (babelOptions = {}) => ({
    mode: "production",

    entry: path.resolve(__dirname, "../src/index.ts"),

    devtool: "inline-source-map",

    context: __dirname,

    resolve: {
        extensions: [".tsx", ".ts", ".js", ".json"],
    },
});
