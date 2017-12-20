//获取任务状态
'use strict';
const EventModel = require('../definitions/models/Event.gen');

const Params = {
    //任务ID number:0,100 in:query key:eventID require
    eventID: 0,
};

module.exports = async (Params)=>{
     let model = EventModel.fetchById(Params.eventID);
    
     return model;
    //return 1;
};