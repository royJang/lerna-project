var config = require('./webpack.config.js')

config.entry = {
  'phoenix-ui': './src/index.js',
}

config.output = {
  filename: './dist/[name].js',
  library: 'phoenix-ui',
  libraryTarget: 'umd'
}

module.exports = config