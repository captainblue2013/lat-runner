"use strict";



class Params {
  constructor(options={}){
    this.project = options.project;
    this.branch = options.branch || '';
    this.hash = options.hash || '';
    this.validate();
  }

  static fromRequest(req){
    let options={};
    if(!this.pick(req, 'query.project')){
      throw new Error("Requirement : [project]");
    }
    options.project = this.pick(req, 'query.project', 'string', '');
    options.branch = this.pick(req, 'query.branch', 'string', '');
    options.hash = this.pick(req, 'query.hash', 'string', '');
    return new Params(options);
  }

  validate(){
    if(!((typeof this.project === 'string') && (this.project.length>=1) && (this.project.length<=64))){
      throw new Error('type validate failed: [project]: String length must between 1 to 64');
    }

    if(!((typeof this.branch === 'string') && (this.branch.length>=0) && (this.branch.length<=64))){
      throw new Error('type validate failed: [branch]: String length must between 0 to 64');
    }

    if(!((typeof this.hash === 'string') && (this.hash.length>=0) && (this.hash.length<=64))){
      throw new Error('type validate failed: [hash]: String length must between 0 to 64');
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