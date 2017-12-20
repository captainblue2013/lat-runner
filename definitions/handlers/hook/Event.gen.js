"use strict";



class Event {
  constructor(options={}){
    this.project = options.project || '';
    this.pusher = options.pusher || '';
    this.branch = options.branch || '';
    this.hash = options.hash || '';
    this.git_remote = options.git_remote || '';
    this.validate();
  }

  static fromRequest(req){
    let options={};
    options.project = this.pick(req, 'body.repository.full_name', 'string', '');
    options.pusher = this.pick(req, 'body.pusher.name', 'string', '');
    options.branch = this.pick(req, 'body.ref', 'string', '');
    options.hash = this.pick(req, 'body.head_commit.id', 'string', '');
    options.git_remote = this.pick(req, 'body.repository.ssh_url', 'string', '');
    return new Event(options);
  }

  validate(){
    if(!((typeof this.project === 'string') && (this.project.length>=1) && (this.project.length<=64))){
      throw new Error('type validate failed: [project]: String length must between 1 to 64');
    }

    if(!((typeof this.pusher === 'string') && (this.pusher.length>=1) && (this.pusher.length<=64))){
      throw new Error('type validate failed: [pusher]: String length must between 1 to 64');
    }

    if(!((typeof this.branch === 'string') && (this.branch.length>=1) && (this.branch.length<=64))){
      throw new Error('type validate failed: [branch]: String length must between 1 to 64');
    }

    if(!((typeof this.hash === 'string') && (this.hash.length>=1) && (this.hash.length<=64))){
      throw new Error('type validate failed: [hash]: String length must between 1 to 64');
    }

    if(!((typeof this.git_remote === 'string') && (this.git_remote.length>=0) && (this.git_remote.length<=128))){
      throw new Error('type validate failed: [git_remote]: String length must between 0 to 128');
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

module.exports = Event;