//创建构建项目
const ProjectModel = require('../definitions/models/Project.gen');

const Project = {
    //项目名 string:1,64 require in:body json:project
    name:'',
    //密码 string:1,64 require in:headers
    password:'default',
};

module.exports = async (Project)=>{
    if(Project.password !== process.env['APP_KEY']){
        return error.FORBIDDEN;
    }
    let model = ProjectModel.create(Project);
    model.status = 1;
    let date = new Date();
    model.updateTime = model.createTime = Number.parseInt(date.getTime()/1000);
    let saved = await model.save(true);
    if(saved){
        await require('../libs/loadProject')();
    }
    
    return model;
};