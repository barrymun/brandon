const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
    return {
        mode: argv.mode === 'development' ? 'development' : 'production',
        devtool: argv.mode === 'development' ? 'cheap-module-source-map' : 'source-map',
        entry: {
            main: [
                './src/index.ts',
                './src/game/index.ts',
            ],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: ['.ts', '.js'],
            alias: {
                src: path.resolve(__dirname, 'src'),
            },
        },
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'dist'),
        },
        devtool: 'source-map',
        plugins: [
            new CleanWebpackPlugin(),
            new CopyPlugin({
                patterns: [{ from: 'src/index.html', to: 'index.html' }],
            }),
        ],
    };
};
