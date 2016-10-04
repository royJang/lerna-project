import store from '../vuex/store';
import * as type from '../vuex/mutations-type';

class HttpPool {
	constructor (){
		this.pool = {};
	}
	add ( key ){
		this.pool[ key ] = true;
		store.dispatch( type.NETWORK_BUSY );
	}
	remove ( key ){
		delete this.pool[ key ];
		this._isFinish() && store.dispatch( type.NETWORK_IDLE );
	}
	_isFinish (){
		return Object.keys( this.pool ).length === 0;
	}
}

export default new HttpPool();