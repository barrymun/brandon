const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
    return {
        mode: argv.mode === 'development' ? 'development' : 'production',
        devtool: argv.mode === 'development' ? 'cheap-module-source-map' : 'source-map',
        entry: {
            main: [
                './src/index.ts',
                './src/game/index.ts',
                './src/utils/index.ts',
            ],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader'],
                },
            ],
        },
        resolve: {
            extensions: ['.ts', '.js'],
            modules: ['node_modules', path.join(__dirname, 'src')],
        },
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'dist'),
        },
        plugins: [
            new CleanWebpackPlugin(),
            new CopyWebpackPlugin({
                patterns: [
                    { from: 'src/index.html', to: 'index.html' },
                    { from: 'src/assets/img', to: 'assets/img' },
                ],
            }),
            new MiniCssExtractPlugin({
                filename: 'index.css',
            }),
        ],
    };
};
