"use strict";

module.exports = [
  {
    name: 'COMMON_ERROR',
    httpStatus: 500,
    code: (process.env.APPID || 1001)*1e6+500001,
    message: '通用错误',
  },
  {
    name: 'RANDOM_ERROR',
    httpStatus: 500,
    code: (process.env.APPID || 1001)*1e6+500002,
    message: '随机错误',
  },
  {
    name: 'UNFINISHED_TASK',
    httpStatus: 409,
    code: (process.env.APPID || 1001)*1e6+409001,
    message: '还有未完成发布任务',
  },
  {
    name: 'UNHAPPY_ERROR',
    httpStatus: 500,
    code: (process.env.APPID || 1001)*1e6+500003,
    message: '管理员不高兴',
  },
  {
    name: 'FORBIDDEN',
    httpStatus: 403,
    code: (process.env.APPID || 1001)*1e6+403001,
    message: '没有权限',
  },
  {
    name: 'NOT_ALLOW',
    httpStatus: 403,
    code: (process.env.APPID || 1001)*1e6+403002,
    message: '不被允许的项目',
  },
];