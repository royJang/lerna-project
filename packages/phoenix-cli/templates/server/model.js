var Service = require('node-dubbo-comsumer');

module.exports = {
    gateway : new Service({
      env:'magellan_develop_1.0.0', // dubbo service version
      gruop:'dubbo', // dubbo group default by 'dubbo',optional
      conn:'174.3.4.251:2181', // zookeeper url
      path:'com.shining3d.magellan.client.UserApiService', // service url
      version:'2.8' // dubbo version
    })
};