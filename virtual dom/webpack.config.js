module.exports = {
    entry: './src/main.js', // 入口文件
    output: {
        path: __dirname,
        filename: './bin/bundle.js'
    },
    module: {
        loaders: [{
            test: '/\.js$/',
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    }
}