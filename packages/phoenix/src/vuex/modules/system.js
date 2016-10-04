import * as type from '../mutations-type';

const state = {
	//应用是否处于空闲状态, 忙碌:true, 空闲:false
	status : false,
	//应用是否处于网络忙碌状态，忙碌:true, 空闲:false
	network : false
};

const mutations = {
	[ type.SYSTEM_BUSY ] (){
		state.status = true;
	},
	[ type.SYSTEM_IDLE ] () {
		state.status = false;
	},
	[ type.NETWORK_BUSY ] (){
		state.network = true;
	},
	[ type.NETWORK_IDLE ] (){
		state.network = false;
	}
};

export default {
	state,
	mutations
}