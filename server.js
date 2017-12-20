/**
 * Created by lanhao on 15/5/17.
 */

//引入配置文件
const config = require('./config/config');

//引入小蓝框架
const Xiaolan = require('xiaolan');


//启动监听服务
const app = new Xiaolan(config);

app.createServer();


const child_process = require('child_process');
child_process.exec('node ./cmd/job.js 1',null,(err,stdo,stde)=>{
console.log(stdo);
});
console.log('waiting');