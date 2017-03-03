/**
 * 通信服务模块
 */
"use strict"

var electron = require('electron')
var md5 = require('blueimp-md5')
var userInfo = electron.remote.getGlobal('sharedObject').userInfo

const SECRET_KEY = 'yoursecretkey'

const BASE_URL = 'http://ip/api'

exports.LOGIN_API = BASE_URL + "/user/login" // 登录接口
exports.LOGOUT_API = BASE_URL + "/user/logout" // 退出登录接口

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

  var timestamp = new Date().getTime()
  var signature = generateSig(method.split('/').pop(), timestamp)

  return $.ajax({
    url: api,
    type: method,
    data: args ? JSON.stringify(args) : null,
    dataType: "json",
    async: true,
    headers: {
      'timestamp': timestamp,
      'signature': signature,
      'token': userInfo.token
    },
    // contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    contentType: "application/json",
    timeout: REQUEST_TIMEOUT,
    beforeSend: function(request) {
      //request.setRequestHeader("key", "value");
    },
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

function generateSig (method, timestamp) {
  var str = SECRET_KEY + method + timestamp
  return md5(str)
}
