var express = require('express')
var webpack = require('webpack')
var config = require('./webpack.dev.conf')
var Service = require('node-dubbo-comsumer');
var model = require("../server/model");   
var bodyParser = require('body-parser');

var app = express()
var compiler = webpack(config)
var port = process.argv[ 2 ] || 4000;
var host = process.argv[ 3 ] || 'localhost';

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})  

app.use(require('connect-history-api-fallback')())
app.use(devMiddleware)
app.use(hotMiddleware)  
app.use('/statics', express.static('./statics'))
app.use('/gateway',Service.gatway( model )); 

module.exports = app.listen(port, host, function (err) {
  if ( err ) return console.log( err );
  console.log('Listening at http://' + host + ':' + port);
});
  










