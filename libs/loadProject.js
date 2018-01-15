const ProjectModel = require('../definitions/models/Project.gen');

module.exports = async ()=>{
    let rows = await ProjectModel.raw('select * from project where 1 and id>:id limit 0,1000',{
        id:0
    });
    process.projectMap = {};
    for(let k in rows){
        process.projectMap[rows[k].name] = rows[k];
    }
    
    return true;
};