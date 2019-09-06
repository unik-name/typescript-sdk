const path = require("path");

module.exports = (babelOptions = {}) => ({
    mode: "production",

    entry: path.resolve(__dirname, "../src/index.ts"),

    devtool: "inline-source-map",

    context: __dirname,

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [{
                    loader: "ts-loader",
                    options:{
                        configFile: "../tsconfig/tsconfig.json"
                    }
                }],
                exclude: /node_modules/,
            },
        ],
    },

    resolve: {
        extensions: [".tsx", ".ts", ".js", ".json"],
    },
});
