"use strict";

module.exports = [
  {
    name: 'COMMON_ERROR',
    httpStatus: 500,
    code: (process.env.APPID || 1001)*1e6+500001,
    message: '通用错误',
  },
];