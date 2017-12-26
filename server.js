/**
 * Created by lanhao on 15/5/17.
 */

//引入配置文件
const config = require('./config/config');

//引入小蓝框架
const Xiaolan = require('xiaolan');


//启动监听服务
const app = new Xiaolan(config);

require('./libs/loadProject')().then((v)=>{
    app.createServer();
}).catch((e)=>{
    console.log('Load Project Error:'+e);process.exit(0);
});
