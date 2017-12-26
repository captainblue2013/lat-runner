"use strict";
const Connection = require('xiaolan-db').Connection('default').conn;
const TableName = "event";

class Event {

  constructor(data={}){
    this.id = (data.id||data.id)||0;
    this.project = (data.project||data.project)||'';
    this.branch = (data.branch||data.branch)||'';
    this.hash = (data.hash||data.hash)||'';
    this.pusher = (data.pusher||data.pusher)||'';
    this.gitRemote = (data.gitRemote||data.git_remote)||'';
    this.status = (data.status||data.status)||0;
    this.remark = (data.remark||data.remark)||'';
    this.createTime = (data.createTime||data.create_time)||0;
    this.updateTime = (data.updateTime||data.update_time)||0;
  }

  static fetchById(v){
    let sql = 'select * from event where id=:v limit 1';
    //@row
    return new Promise((resolved, rejected) => {
      Connection.query({sql:sql, params:{v:v}}, (e ,r)=>{
        if(e){
          rejected(e);
        }else{
          if(r[0]){
            resolved(new Event(r[0]));
          }else{
            resolved(null);
          }
        }
      });
    });
  }

  static fetchByStatus(status, page=1, pageSize=10){
    let sql = 'select * from event where status=:status order by id desc limit '+((page-1)*pageSize)+','+pageSize+'';
    //@list
    return new Promise((resolved, rejected) => {
      Connection.query({sql:sql, params:{status: status}}, (e ,r)=>{
        if(e){
          rejected(e);
        }else{
          let result = [];
          for(let k in r) {
            result.push(new Event(r[k]));
          }
          resolved(result);
        }
      });
    });
  }

  static fetchByCreateTime(createTime, page=1, pageSize=10){
    let sql = 'select * from event where create_time=:createTime order by id desc limit '+((page-1)*pageSize)+','+pageSize+'';
    //@list
    return new Promise((resolved, rejected) => {
      Connection.query({sql:sql, params:{createTime: createTime}}, (e ,r)=>{
        if(e){
          rejected(e);
        }else{
          let result = [];
          for(let k in r) {
            result.push(new Event(r[k]));
          }
          resolved(result);
        }
      });
    });
  }

  static fetchByUpdateTime(updateTime, page=1, pageSize=10){
    let sql = 'select * from event where update_time=:updateTime order by id desc limit '+((page-1)*pageSize)+','+pageSize+'';
    //@list
    return new Promise((resolved, rejected) => {
      Connection.query({sql:sql, params:{updateTime: updateTime}}, (e ,r)=>{
        if(e){
          rejected(e);
        }else{
          let result = [];
          for(let k in r) {
            result.push(new Event(r[k]));
          }
          resolved(result);
        }
      });
    });
  }

  static fetchByProjectBranchHash(project, branch, hash, page=1, pageSize=10){
    let sql = 'select * from event where project=:project and branch=:branch and hash=:hash order by id desc limit '+((page-1)*pageSize)+','+pageSize+'';
    //@row
    return new Promise((resolved, rejected) => {
      Connection.query({sql:sql, params:{project: project, branch: branch, hash: hash}}, (e ,r)=>{
        if(e){
          rejected(e);
        }else{
          if(r[0]){
            resolved(new Event(r[0]));
          }else{
            resolved(null);
          }
        }
      });
    });
  }

  static fetchByAttr(data={}, page=1, pageSize=10){
    let allowKey = ['id','status','create_time','update_time','project','branch','hash'];
    let sql = 'select * from event where 1 ';
    if(Object.keys(data).length===0){
      throw new Error('data param required');
    }
    for(let k in data){
      let field = '';
      if(allowKey.includes(k)){
        field = k;
      }else if(allowKey.includes(KeyMap[k])){
        field = KeyMap[k];
      }else{
        throw new Error('Not Allow Fetching By [ "'+k+'" ]');
      }
      sql += ' and '+field+'=:'+k+'';
    }
    sql += ' order by id desc limit '+((page-1)*pageSize)+','+pageSize;
    //@list
    return new Promise((resolved, rejected)=>{
      Connection.query({sql:sql,params:data}, (e, r)=>{
        if(e){
          rejected(e);
        }else{
          let result = [];
          for(let k in r) {
            result.push(new Event(r[k]));
          }
          resolved(result);
        }
      });
    });
  }

  static raw(sql='',params={}){
    if(!sql.includes('limit')){
      throw new Error('raw sql must with paging');
    }
    //@list
    return new Promise((resolved, rejected)=>{
      Connection.query({sql:sql,params:params}, (e, r)=>{
        if(e){
          rejected(e);
        }else{
          let result = [];
          for(let k in r) {
            result.push(new Event(r[k]));
          }
          resolved(result);
        }
      });
    });
  }
    
  data(){
    let obj = {};
    for(let k in FieldMap){
      obj[FieldMap[k]] = this[FieldMap[k]];
    }
    return obj;
  }

  row(){
    let row = {};
    for(let k in FieldMap){
      row[k] = this[FieldMap[k]];
    }
    return row;
  }

  validate(){
    if(this.project !== null && !(typeof this.project==='string' && this.project.length>=0 && this.project.length<=255)){
      throw new Error('attribute project(project) must be a string length in [0,255]');
    }
    if(this.branch !== null && !(typeof this.branch==='string' && this.branch.length>=0 && this.branch.length<=64)){
      throw new Error('attribute branch(branch) must be a string length in [0,64]');
    }
    if(this.hash !== null && !(typeof this.hash==='string' && this.hash.length>=0 && this.hash.length<=64)){
      throw new Error('attribute hash(hash) must be a string length in [0,64]');
    }
    if(this.pusher !== null && !(typeof this.pusher==='string' && this.pusher.length>=0 && this.pusher.length<=32)){
      throw new Error('attribute pusher(pusher) must be a string length in [0,32]');
    }
    if(this.gitRemote !== null && !(typeof this.gitRemote==='string' && this.gitRemote.length>=0 && this.gitRemote.length<=255)){
      throw new Error('attribute gitRemote(git_remote) must be a string length in [0,255]');
    }
    if(this.status !== null && !(typeof this.status==='number' && this.status>=0 && this.status<=255)){
      throw new Error('attribute status(status) must be a number in [0,255]');
    }
    if(this.remark !== null && !(typeof this.remark==='string' && this.remark.length>=0 && this.remark.length<=255)){
      throw new Error('attribute remark(remark) must be a string length in [0,255]');
    }
    if(this.createTime !== null && !(typeof this.createTime==='number' && this.createTime>=0 && this.createTime<=18014398509481982)){
      throw new Error('attribute createTime(create_time) must be a number in [0,18014398509481982]');
    }
    if(this.updateTime !== null && !(typeof this.updateTime==='number' && this.updateTime>=0 && this.updateTime<=18014398509481982)){
      throw new Error('attribute updateTime(update_time) must be a number in [0,18014398509481982]');
    }
  }

  save(force=false){
    if(force){
      try{
        this.validate();
      }catch(e){
        return Promise.resolve(Object.assign(error.BAD_REQUEST, {message: error.BAD_REQUEST.message+':'+e.message}));
      }
    }
    //@true
    return new Promise((resolved, rejected) => {
      let data = this.data();
      let sql = `insert into ${TableName} set `;
      let fields = [];
      for(let k in data){
        if(k==='id' || data[k]===null){
          continue;
        }
        fields.push(`${KeyMap[k]}=:${k}`);
      }
      sql += fields.join(',');
      Connection.query({sql: sql,params:this.data()},(e, r) => {
        if(e) {
          rejected(e);
        }else{
          this.id = r.insertId;
          resolved(true);
        }
      });
    });
  }

  update(force=false){
    if(force){
      this.validate();
    }
    //@true
    return new Promise((resolved, rejected) => {
      let sql = `update ${TableName} set `;
      let data = this.data();
      let fields = [];
      for(let k in data){
        if(k==='id' || data[k]===null){
          continue;
        }
        fields.push(`${KeyMap[k]}=:${k}`);
      }
      sql += fields.join(',');
      sql += ` where id=:id`;
      Connection.query({sql: sql,params:data},(e, r) => {
        if(e) {
          rejected(e);
        }else{
          resolved(true);
        }
      });
    });
  }

  static create(data){
    //@this
    return new Event(data);
  }

}

const FieldMap = {
  id: 'id',
  project: 'project',
  branch: 'branch',
  hash: 'hash',
  pusher: 'pusher',
  git_remote: 'gitRemote',
  status: 'status',
  remark: 'remark',
  create_time: 'createTime',
  update_time: 'updateTime',
};

const KeyMap = {
  id: 'id',
  project: 'project',
  branch: 'branch',
  hash: 'hash',
  pusher: 'pusher',
  gitRemote: 'git_remote',
  status: 'status',
  remark: 'remark',
  createTime: 'create_time',
  updateTime: 'update_time',
};


module.exports = Event;
