"use strict";



class Project {
  constructor(options={}){
    this.name = options.name;
    this.password = options.password;
    this.validate();
  }

  static fromRequest(req){
    let options={};
    if(!this.pick(req, 'body.project')){
      throw new Error("Requirement : [project]");
    }
    options.name = this.pick(req, 'body.project', 'string', '');
    if(!this.pick(req, 'headers.password')){
      throw new Error("Requirement : [password]");
    }
    options.password = this.pick(req, 'headers.password', 'string', 'default');
    return new Project(options);
  }

  validate(){
    if(!((typeof this.name === 'string') && (this.name.length>=1) && (this.name.length<=64))){
      throw new Error('type validate failed: [name]: String length must between 1 to 64');
    }

    if(!((typeof this.password === 'string') && (this.password.length>=1) && (this.password.length<=64))){
      throw new Error('type validate failed: [password]: String length must between 1 to 64');
    }

  }

  static pick(source, path, type=null, defaultValue=null, memberType=null){
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
        if(typeof tmp === 'object'){
          tmp = JSON.stringify(tmp);
        }else{
          tmp = decodeURIComponent(tmp.toString());
        }
        break;
      case 'number':
      case 'enum':
        tmp = 1*tmp;
        break;
      case 'array':
        if(typeof tmp === 'string'){
          tmp = tmp.split(',');
        }
        if (memberType === 'number') {
          let len = tmp.length;
          for (let i = 0; i < len; i++) {
            tmp[i] = 1 * tmp[i];
          }
        }
        break;
    }
    return (defaultValue && (undefined===tmp)) ? defaultValue: tmp;
  }
}

module.exports = Project;