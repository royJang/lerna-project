import _ from 'lodash/util';
import pool from './httpPool';

//发送请求
function fetchTo ( u, options ){

	let key = _.uniqueId('http_');

	//加入http pool, 表示其正在运行
	pool.add( key );

	let request = new Request( u, options );

	return fetch( request )	
    	.then( res => {

    		//保留, 收集请求错误信息
    		if( res && res.ok === false ){
    			//res => status, statusText, url, ...res.headers.entries()
				pool.remove( key );
    			throw new Error( 0 );
    		}	

    		let contentType = res.headers.get("content-type"),
    			result = null;

    		//返回结果为application解析为json
			if( contentType && contentType.indexOf("application/json") > -1 ) {
			    result = res.json();
			} 
			//否则当作TEXT处理	
			else {
			    result = res.text();
			}

			pool.remove( key );
			return result;
    	});
}
	
export class Http {
	constructor ( name ){
		
		this.url = '/gateway';
		this.options = {};
		this.headers = new Headers();

		//default headers
		this._set_content_type();
		this.options.headers = this.headers;

		//method name
		this.name = name;

		return this;
	}
	//由于constructor 中写死了url,
	//可能会有特殊如上传让需走node server,
	//预留一个setURL方法
	setURL ( url ){
		this.url = url;
		return this;
	}
	_set_content_type (){
		this.headers.set('content-type', 'application/json');
	}
	setHeaders ( _headers ){

		this._set_content_type();

		Object.keys( _headers ).forEach( h => {
			this.headers.set( h.toLowerCase(), _headers[ h ] );
		});	

		this.options.headers = this.headers;
		return this;
	}	
	post (){

		//设置时间戳
		this.options.method = "post";
		this.options.body = JSON.stringify({	
			timestamp : Date.now(),
			arguments: JSON.stringify( [].slice.apply( arguments ) ),
			api_name : this.name
		});

		return fetchTo( this.url, this.options );
	}
	get (){

		//拼装请求URL
		this.url += "?arguments=" + JSON.stringify( [].slice.apply( arguments ) );
		this.url += "&timestamp=" + Date.now();
		this.url += "&api_name=" + this.name;

		//设置为GET请求
		this.options.method = "get";

		return fetchTo( this.url, this.options );
	}
}















