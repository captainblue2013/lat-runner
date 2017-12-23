//查看当前项目状态
const ProjectModel = require('../definitions/models/Project.gen');

const Query = {
    //按项目名搜索 string:0,64 in:query
    name: ''
};

module.exports = async (Query) => {
    if (Query.name != '') {
        return ProjectModel.fetchByAttr({'name':Query.name});
    } else {
        return ProjectModel.raw('select * from project where 1 and id>:id limit 0,1000', {
            id: 0
        });
    }
};