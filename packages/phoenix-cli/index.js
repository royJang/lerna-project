#!/usr/bin/env node
	
var root = "https://raw.githubusercontent.com/royJang/phoenix-cli/master";
var fs = require("fs-extra");
var request = require("superagent");
var chalk = require("chalk");
var program = require('commander');
var pkg = require("./package.json");
var changesets = require('diff-json');
var shelljs = require("shelljs/global");
var path = require("path");
var beautify = require("json-beautify");

program
  .version( pkg.version )

program
  .command('init')
  .description('project\'s template initialize')
  .action( install );

program
  .command('update')
  .description('update project\'s build config')
  .action( update );

program
  .command('component')
  .description('component\'s template initialize')
  .action( component );	

program.parse( process.argv );	

function install (){
	request.get( root + "/dir.json" )
		.end(function ( err, data ){

			if( err ) return console.log( err );
			var dirs = JSON.parse( data.text ).dirs;

			console.log('Download Template...')
			dirs.forEach(function ( d ){

				request.get( root + d )
					.end(function ( err, data ){
						if( err ) return;

						if( data.text && data.text.length > 0 ){
							// "templates" + 1 = 10
							var p =  d.slice( 10 );
							
							fs.outputFile( process.env.PWD + p, data.text, function ( err, data ){
								console.log(chalk.green('success ') + p);
							});
						}
					});
			});
		});
}

function update (){
	request.get( root + '/dir.json' )
		.end(function ( err, data ){
			if( err ) return console.log( err );
			var dirs = JSON.parse( data.text ).dirs;

			console.log('Update Template...');

			//过滤文件, 只覆盖项目中的配置文件
			dirs = dirs.filter(function ( d ){
				return ensureFile( d );
			});

			//下载并更新文件
			var dFiles = function ( d ){
				return new Promise(function ( resolve, reject ){
					//下载文件并更新	
					request
						.get( root + d )
						.end(function ( err, data ){
							if( err ) return;

							if( data.text && data.text.length > 0 ){
								// "templates" + 1 = 10
								var p = d.slice( 10 );
									
								fs.removeSync( process.env.PWD + p );
								fs.outputFile( process.env.PWD + p, data.text, function ( err, data ){
									console.log(chalk.green('update ') + p);
									return resolve( true );
								});
							}	
						});	
				});
			}

			//遍历下载所有线上模板文件
			var update_step_1 = new Promise(function ( resolve, reject ){
				Promise.all(dirs.map( dFiles )).then(function ( data ){
					return resolve( data );
				}).catch(function ( err ){
					return reject( err );
				});
			});		

			//读取线上package.json文件
			var update_step_2 = new Promise(function ( resolve, reject ){
				//load package.json
				request.get( root + '/templates/package.json' )
					   .end(function ( err, data ){
					   		if( err ) return console.log(chalk.red('error ') + err);
					   		if( data.text && data.text.length > 0 ){
						   		return resolve(JSON.parse(data.text));
					   		} else{
								return console.log(chalk.red('error ') + 'source origin broken');					   			
					   		}	
					   });
			});	

			//读取本地package.json文件
			var update_step_3 = new Promise(function ( resolve, reject ){
				fs.readFile( process.env.PWD + '/package.json', function ( err, data ){
					if( err ){
						console.log(chalk.red('not found package.json'));
						return reject( err );
					}	
					return resolve(JSON.parse( data ));
				});
			});

			Promise.all([ update_step_1, update_step_2, update_step_3 ]).then(function ( data ){
		 		//确认更新内容
		 		//1.新加的包
		 		var newDeps = [];
		 		//devDependencies下的包
		 		var newDepss = [];
		 		//2.删除的包
		 		var removeDeps = [];
		 		//2.查看更新版本
		 		var newVersion = '';

		 		//对比本地与线上package.json的差异
		 		//data[ 2 ] 本地package.json，旧的 update_step_3
		 		//data[ 1 ] 线上package.json，新的 update_step_2
		 		
		 		var localPackage = data[ 2 ];
		 		var onlinePackage = data[ 1 ];

			 	changesets.diff(localPackage, onlinePackage).forEach(function ( item ){

			 		//版本差异对比
			 		if( item.type === 'update' && item.key === 'version' ){
			 			newVersion = item.oldValue + ' => ' +  item.value;
			 		}
			 		//区分安装，否则会--save的装进--save-dev
			 		//再次运行pastor update,会发现仍有差异, 导致无限循环
			 		//dependencies --save
			 		if( item.type === 'update' 
			 			&& item.key === 'dependencies' ){
			 			add( item, newDeps );	
			 		}
			 		//devDependencies --save-dev
			 		if( item.type === 'update'
			 			&& item.key === 'devDependencies' ){
			 			add( item, newDepss );
			 		}

			 		function add ( el, inc ){
			 			el.changes.forEach(function ( f ){
			 				//package version
			 				var pv = f.value.replace(/\^?/, "");

			 				if( f.type === 'add' ){
			 					inc.push( f.key + '@' + pv );
			 				}
			 				else if( f.type === 'remove' ){
			 					removeDeps.push( f.key );
			 				}
			 				else if( f.type === 'update' ){
			 					//删除
			 					removeDeps.push( f.key );
			 					inc.push( f.key + '@' + pv );
			 				}
			 			});	
			 		}
			 	});	

	 			//生成命令	
	 			var cmd_add = 'npm i ' + a2s(newDeps) + ' --save';
	 			var cmd_add_d = 'npm i ' + a2s(newDepss) + ' --save-dev';
	 			var cmd_remove = 'npm uninstall ' + a2s(removeDeps) + ' --save';

	 			//可执行命令
	 			var cmd_exec = [];

				if( removeDeps && removeDeps.length > 0 ){
	 				cmd_exec.push( cmd_remove );
	 			}
	 			if( newDeps && newDeps.length > 0 ){
	 				cmd_exec.push( cmd_add );
	 			}
	 			if( newDepss && newDepss.length > 0 ){
	 				cmd_exec.push( cmd_add_d );
	 			}
 				
 				//执行npm命令, 先删后加
	 			if( cmd_exec.length > 0 ){
	 				console.log(chalk.green('update ') + 'package dependencies');
	 				//循环执行所有curd命令
	 				Promise.all(cmd_exec.map( cmd_run )).then(function (){
	 					//所有命令执行成功
	 					//覆盖package.json版本信息	
	 					overrideVersion();
	 				}).catch(function ( err ){
	 					console.log( err );
	 				});	
	 			}
	 			else {
	 				//覆盖package.json版本信息
	 				overrideVersion();	
	 			}
			 	function cmd_run ( cmd ){
			 		console.log('cmd:',cmd);
			 		return new Promise(function ( resolve, reject ){
			 			exec( cmd, function ( err, data ){
			 				if( err ) return reject( err );
			 				return resolve( true );
			 			});
			 		});
			 	}
			 	function overrideVersion (){
			 		//由于依赖版本会有更新,所以重新读取本地package.json
			 		update_step_3.then(function ( local ){
			 			local.version = onlinePackage.version;
			 			fs.writeFile( process.env.PWD + '/package.json', beautify(localPackage, null, 2, 100), function (){
					 		console.log(chalk.green( 'success ' + newVersion ));
				 		});	
			 		});	
			 	}
			}).catch(function ( e ){	
			});
		});
}

function a2s ( arr ){
	return arr.join(" ");
}

//只覆盖这些目录的文件
function ensureFile ( dir ){
	
	var p = path.parse( dir ),
		overridePath = [
			'.eslintignore', 
			'.babelrc',
			'.eslintrc.js'		
		];

	return ( p.dir === "/templates/build" )
		|| overridePath.indexOf( p.base ) > -1;
}

function component (){
}














