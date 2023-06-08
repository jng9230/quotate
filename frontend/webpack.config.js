const path = require('path');
const webpack = require('webpack');

console.log('environment:::::', environment);
const environment = process.env.ENVIRONMENT;

let ENVIRONMENT_VARIABLES = {}
if (environment === 'production') {
    ENVIRONMENT_VARIABLES = {
        'process.env.API_BASE': JSON.stringify('https://june-iiugnbm54q-uc.a.run.app'),
    };
}

module.exports = {
    entry: './src/index.tsx',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    watch: true,
    plugins: [
        new webpack.DefinePlugin(ENVIRONMENT_VARIABLES),
    ],
};