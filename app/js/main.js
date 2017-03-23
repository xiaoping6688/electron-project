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
