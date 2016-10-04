
export const sys_busy = ({ dispatch }) => dispatch('SYSTEM_BUSY');
export const sys_idle = ({ dispatch }) => dispatch('SYSTEM_IDLE');
export const network_busy = ({ dispatch }) => dispatch('NETWORK_BUSY');
export const network_idle = ({ dispatch }) => dispatch('NETWORK_IDLE');

export const dataset = ({ dispatch }, key, value ) => 
		dispatch('DATA_SET', { key : key, value : value });

