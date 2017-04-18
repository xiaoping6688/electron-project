/**
 * 通信服务模块
 */
"use strict"

var ajax = require('./ajax')

var BASE_URL = require('../../env').BASE_URI
// API定义
var LOGIN_API = BASE_URL + "/login" // 登录接口

var service = {};

service.login = function (username, password, onSuccess, onError) {
  var args = {
    username: username,
    password: password
  }

  ajax.post(LOGIN_API, args, function (res) {
    if (res.rlt === 'true') {
      onSuccess(res.data)
    } else {
      alert(res.msg)
      if (typeof onError === 'function') {
        onError();
      }
    }
  }, onError)
}

module.exports = service;
