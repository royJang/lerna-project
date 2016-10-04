import Vue from 'vue';
import VueRouter from 'vue-router';
import gateway from './core/gateway';
import store from './vuex/store';
import * as actions from './vuex/actions';

if( !window.Promise ) require('es6-promise').polyfill();

Vue.use( VueRouter );

let App = {};
let router = new VueRouter({
  	history : true
});	

class Phoenix {
	constructor (){

		this.created = false;
	}
	createView ( options ){

		let o = Object.assign( {}, options );

		o.data = () => {
			return Object.assign( options.data(), {
				//load api proxy
				api : gateway
			});
		}

		//这里不给添加自定义的store的考虑是统一收口,
		//避免混乱的全局应用状态
		//添加全局状态使用dataset方法	
		//@ex
		//this.dataset('any-status', false);		
		if( options.store || options.vuex ){
			console.error('not allow override vuex & store!');
		}

		o.store = store;

		o.vuex = {
			getters : {	
				system : state => state.system,
				hibernate : state => state.hibernate
			},
			actions
		};

		return o;
	}
	createRouter ( options ){

		//createRouter only call once
		if( this.created ) return;
		this.created = true;
		
		//mapping router
		router.map( options );
		router.start(App, 'body');
	}
}

module.exports = new Phoenix();

