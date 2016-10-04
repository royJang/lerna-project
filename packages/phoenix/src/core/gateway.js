import { Http } from './http';

let gatewayOrigin = {};

export default new Proxy( gatewayOrigin, {
    get ( target, name, receiver ) {

        //Phoenix return gateway maybe trigger 
        if( name === "__esModule" ) return;

        //未注册此接口
        if( !gatewayOrigin.hasOwnProperty( name ) ){
            Object.defineProperty( gatewayOrigin, name, {
                enumerable : false,
                configurable : false,
                writable : true,
                value : (() => {   
                    //return a Http Constructor
                    return new Http( name );
                })()
            });
        }

        return gatewayOrigin[ name ];
    },
    set () {
        return console.error('warning! api not allow manually registration!');
    }
});



























