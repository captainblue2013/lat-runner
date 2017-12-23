//创建push event
const EventModel = require('../definitions/models/Event.gen');

const Event = {
  //项目名 string:1,64 in:body.repository json:full_name
  project:'',
  //用户名字 string:1,64 in:body.pusher json:name
  pusher: '',
  //分支 string:1,64, in:body json:ref
  branch:'',
  //哈希值 string:1,64 in:body.head_commit json:id
  hash:'',
  //项目git string:0,128 in:body.repository json:ssh_url
  git_remote:'',
};

module.exports = async (Event) => {
  if((process.projectMap[Event.project] !== undefined)&&(process.projectMap[Event.project].status==1)){
    //pass
  }else{
    return error.NOT_ALLOW;
  }
  Event.branch = Event.branch.split('/').pop();
  let exists = await EventModel.fetchByProjectBranchHash(Event.project, Event.branch, Event.hash);
  
  if(exists && exists.status === 0){
    return error.UNFINISHED_TASK;
  }else{
    let model = EventModel.create(Event);
    let date = new Date();
    model.updateTime = model.createTime = Number.parseInt(date.getTime()/1000);
    let saved = await model.save(true);
    return model;
  }

};