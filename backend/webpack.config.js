const path = require('path');
const webpack = require('webpack');

const environment = process.env.ENVIRONMENT;

console.log('environment:::::', environment);

// let ENVIRONMENT_VARIABLES = {
//     'process.env.ENVIRONMENT': JSON.stringify('development'),
//     'process.env.PORT': JSON.stringify('5000'),
//     'process.env.MONGO_CONNECTION_STRING': JSON.stringify(db_string)
// };

// if (environment === 'test') {
//     ENVIRONMENT_VARIABLES = {
//         'process.env.ENVIRONMENT': JSON.stringify('test'),
//         'process.env.PORT': JSON.stringify('5000'),
//         'process.env.MONGO_CONNECTION_STRING': JSON.stringify(db_string)
//     };
// } else if (environment === 'production') {
let ENVIRONMENT_VARIABLES = {}
if (environment === 'production') {
    ENVIRONMENT_VARIABLES = {
        'process.env.ENVIRONMENT': JSON.stringify('production'),
        'process.env.PORT': JSON.stringify('5000'),
    };
}

module.exports = {
    entry: './server.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'api.bundle.js',
    },
    target: 'node',
    plugins: [
        new webpack.DefinePlugin(ENVIRONMENT_VARIABLES),
    ],
};