'use strict';
const {Field, Table, Migrate} = require('xiaolan-db');

module.exports = new Table('project',{
    id:Field.name('id').bigint(true).primary().AI().comment(' primary id'),
    name:Field.name('project_name').varchar(64).uniq().comment('project uniq name'),
    status:Field.name('status').tinyint(true).index().comment('0未激活,1已激活'),
    https:Field.name('https').tinyint(true).default(0).comment('是否https'),
    internal:Field.name('internal').tinyint(true).default(0).comment('是否内部服务'),
    lastBuild:Field.name('last_build').bigint(true).index(),
    createTime:Field.name('create_time').bigint(true).index(),
    updateTime:Field.name('update_time').bigint(true).index()
});