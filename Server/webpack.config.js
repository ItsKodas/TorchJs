const path = require('path')

module.exports = {
    mode: 'none',
    entry: './public/js/index.js',
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: 'bundle.js',
        library: 'editor'
    }
}