"use strict";



class Params {
  constructor(options={}){
    this.eventID = options.eventID;
    this.validate();
  }

  static fromRequest(req){
    let options={};
    if(!this.pick(req, 'query.eventID')){
      throw new Error("Requirement : [eventID]");
    }
    options.eventID = this.pick(req, 'query.eventID', 'number', 0);
    return new Params(options);
  }

  validate(){
    if(!(Number.isInteger(this.eventID) && (this.eventID>=0) && (this.eventID<=100))){
      throw new Error('type validate failed: [eventID]: Number must in range 0 to 100');
    }

  }

  static pick(source, path, type=null, defaultValue=null){
    let paths = path.split('.');
    let tmp = source;
    for(let k in paths){
      if(tmp[paths[k]]){
        tmp = tmp[paths[k]];
      }else{
        tmp = tmp[paths[k]];
        break;
      }
    }
    if(tmp===undefined){
      return defaultValue;
    }
    switch (type){
      case 'string':
      case 'enum':
        if(typeof tmp === 'object'){
          tmp = JSON.stringify(tmp);
        }else{
          tmp = tmp.toString();
        }
        break;
      case 'number':
        tmp = 1*tmp;
        break;
    }
    return (defaultValue && (undefined===tmp)) ? defaultValue: tmp;
  }
}

module.exports = Params;