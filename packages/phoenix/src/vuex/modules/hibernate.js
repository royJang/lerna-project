import Vue from 'vue';
import * as type from '../mutations-type';

const state = {
};

const mutations = {
	[ type.DATA_SET ] ( event, { key, value }){
		
		if( state[ key ] ){	
			//store中存在此key, 
			//且store中存的data是一个object且更新的数据也是一个object则更新
			if( value && typeof value === "object" 
					  && typeof state[ key ] === "object" ){
				state[ key ] = Object.assign({}, state[ key ], value );
			}	
			else {
				state[ key ] = value;
			}	
		}	
		else {
			Vue.set( state, key, value );
		}
	}
};

export default {
	state,
	mutations
}