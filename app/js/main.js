// 全局变量
var electron = require('electron')
var ipcRenderer = electron.ipcRenderer
var path = require('path')
var template = require('art-template')
template.config('base', path.join(__dirname, '..', 'tpl'))
template.config('extname', '.html')

var service = require('../js/common/service')
var popup = require('../js/common/popup')

var sharedObject = electron.remote.getGlobal('sharedObject')
var userInfo = sharedObject.account

var page = null

$(function () {
  // TODO 初始化

  onTopMenuNav('home')
})

/**
 * 顶部菜单导航处理
 */
function onTopMenuNav (id) {
  switch (id) {
    case 'home': // 选择课件
      page = require('../js/home')
      page.init()
      break
    case 'quit': // 退出登录
      logout()
      break
  }
}

function logout() {
  ipcRenderer.send('logout')
}

ipcRenderer.on('syslog', function (event, message) {
  $('.syslog').html(message)
})

/**
 * JS 拦截/捕捉 全局错误
 * @param {String}  errorMessage   错误信息
 * @param {String}  scriptURI      出错的文件
 * @param {Long}    lineNumber     出错代码的行号
 * @param {Long}    columnNumber   出错代码的列号
 * @param {Object}  errorObj       错误的详细信息，Anything
 */
window.onerror = function (errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
    var info = "错误信息：" + errorMessage + "\n" +
      "出错文件：" + scriptURI + "\n" +
      "出错行号：" + lineNumber + "\n" +
      "出错列号：" + columnNumber + "\n" +
      "错误详情：" + errorObj + "\n\n";

    console.log(info);
    return true;
}