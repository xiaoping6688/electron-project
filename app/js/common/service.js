/**
 * 通信服务模块
 */
"use strict"

var electron = require('electron')
var userInfo = electron.remote.getGlobal('sharedObject').account

const BASE_URL = 'http://ip/api'

// exports.LOGIN_API = BASE_URL + "/user/login" // 登录接口
exports.LOGIN_API = "../../api/login"

const REQUEST_TIMEOUT = 10000 // 请求超时时间（毫秒） TODO 出错重试

/**
 * 接口调用服务
 * @param {String} api 接口API（必填）
 * @param {Object} args 请求参数（必填）
 * @param {String} method 请求方法（必填）
 * @param {Function} onSuccess 成功时回调（可选）
 * @param {Function} onError 错误时回调（可选）
 * @return {jqXHR} 可用于Promise和XMLHttpRequest
 */
exports.call = function(api, args, method, onSuccess, onError) {
  console.log("[Request] " + api + " method: " + method + " args: " + JSON.stringify(args));

  return $.ajax({
    url: api,
    type: method,
    data: args ? JSON.stringify(args) : null,
    dataType: "json",
    async: true,
    headers: {
      'token': userInfo.token
    },
    contentType: "application/json",
    timeout: REQUEST_TIMEOUT,
    success: function(data){
      console.log("[Response] " + api + "\n" + JSON.stringify(data))
      if (typeof(onSuccess) === 'function'){
        onSuccess(data)
      }
    },
    error: function(xhr, status){
      console.log("[Error] " + api + ": " + xhr.status + " - " + status)
      if (typeof(onError) === 'function'){
        onError(xhr.status)
      }
    }
  })
}
