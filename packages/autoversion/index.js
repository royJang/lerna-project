#!/usr/bin/env node

var git = require("git");
var fs = require("fs-extra");
var chalk = require("chalk");
var path = require("path");
var program = require('commander');
var root = process.env.PWD;	

var package_key = './package.json';
var pkg = require( package_key );	//autoversion local package.json
var package_path = path.resolve( root, package_key ); //user package.json
var config = require( package_path );
var pkgVersion = config.version;	
var stage = [ "alpha", "beta", "rc", "release" ];

if( !pkgVersion ) return console.error('not found `version` key');

program
  .version( pkg.version );

program
  .command('ap')
  .description('publish appoint version')
  .action( ap );

program
  .command('auto')
  .description('publish package with auto version')
  .action( auto );

program
  .command('alpha')
  .description('publish alpha version')
  .action( alpha );

program
  .command('beta')
  .description('publish beta version')
  .action( beta );

program
  .command('rc')
  .description('publish rc version')
  .action( rc );

program
  .command('release')
  .description('publish release version')
  .action( release );

program.parse( process.argv );	

function setVersion ( version ){
	config.version = version;

	fs.writeFile( package_path, JSON.stringify(config, null, 4), function ( err, data ){
		if( err ) return console.error(chalk.red( err ));
		return console.log(chalk.green( pkgVersion + ' => ' + version ));	
	});	
}	

function parseVersion (){

	//has version stage?
	var t = config.version.split("-");
	var v = t[ 0 ];
	var s = t[ 1 ];

	//if stage => stage + 1
	//else version + 1
	if( s ){
		var _s = s.split(".");
		_s[ 1 ] = 0 | _s[ 1 ];
		_s[ 1 ] += 1;
		return v + "-" + _s.join(".")
	}
	else {
		//version + 1
		var v = v.split(".");
		v[ 2 ] = 0 | v[ 2 ];
		v[ 2 ] += 1;
		return v.join(".");
	}	
}

function ap ( version, stage ){
	var _v = version;
	if( stage && typeof stage === "string" ) version += stage;

	//1.0.0
	//1.0.0-rc
	//1.0.0-rc.2
	if(!/^\d+\.\d+\.\d+(-(alpha|beta|rc|release)(\.\d+)?)?$/.test( version )){
		return console.error(chalk.red('invalid version: ', _v));
	}
	return setVersion( version );
}

function auto (){
	setVersion( parseVersion() );
}

function alpha ( version ){
	return ap( version, '-alpha' );	
}
	
function beta ( version ){
	return ap( version, '-beta' );
}

function rc ( version ){
	return ap( version, '-rc' );
}

function release ( version ){
	return ap( version, '-release' );
}



	





















