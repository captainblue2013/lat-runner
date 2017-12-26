//获取任务状态
'use strict';
const EventModel = require('../definitions/models/Event.gen');

const Params = {
  //项目名 string:1,64 in:query require key:projectName
  project: '',
  //分支 string:0,64 in:query key:branch
  branch: '',
  //哈希值 string:0,64 in:query key:hash
  hash: '',
};

module.exports = async (Params) => {
  let arg = {};
  for(let k in Params){
    if(Params[k]!=''){
      arg[k] = Params[k];
    }
  }
  let model = EventModel.fetchByAttr(arg);

  return model;
};