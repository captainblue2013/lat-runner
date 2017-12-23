"use strict";



class Query {
  constructor(options={}){
    this.name = options.name || '';
    this.validate();
  }

  static fromRequest(req){
    let options={};
    options.name = this.pick(req, 'query.name', 'string', '');
    return new Query(options);
  }

  validate(){
    if(!((typeof this.name === 'string') && (this.name.length>=0) && (this.name.length<=64))){
      throw new Error('type validate failed: [name]: String length must between 0 to 64');
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

module.exports = Query;