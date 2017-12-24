'use strict';
const {Field, Table, Migrate} = require('xiaolan-db');

module.exports = new Table('event', {
  id:Field.name('id').bigint(true).primary().AI().comment(' primary id'),
  project:Field.name('project').varchar(255).comment('project full name').uniq('project_branch_hash'),
  branch:Field.name('branch').varchar(64).comment('git branch').uniq('project_branch_hash'),
  hash:Field.name('hash').varchar(64).comment('git commit hash').uniq('project_branch_hash'),
  pusher:Field.name('pusher').varchar(32).comment(),
  gitRemote:Field.name('git_remote').varchar(255).comment('git remote ssh'),
  status:Field.name('status').tinyint(true).index().comment('0初始化,1处理中,2成功,3失败'),
  remark:Field.name('remark').varchar(255).allowNull().comment('处理结果原语'),
  createTime:Field.name('create_time').bigint(true).index(),
  updateTime:Field.name('update_time').bigint(true).index()
});