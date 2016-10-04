var fs = require("fs-extra");
var shelljs = require("shelljs/global");
var path = require("path");

var dirs = [];

fs.walk('./templates/')
  .on('data', function (item) {
  	if(!(item.path.indexOf("node_modules") > -1)){
	    dirs.push(item.path.slice(__dirname.length));
  	}
  })
  .on('end', function (){

  	var _ignore = fs.readFileSync('.gitignore'),
  		ignore = _ignore.toString().split("\n")

  	dirs = dirs.filter(function ( _p ){
		var p = path.parse( _p )
		//base不为template且不处于ignore文件中
  		return p.base != 'templates' && ignore.indexOf( p.base );
  	});
	fs.writeJson('./dir.json', {
		'dirs' : dirs
	}, function ( err ){
		exec('av auto; npm publish; git add .; git commit -m "update"; git push origin master;');
		console.log('over');
	});
  });

