var electron = require('electron')
var ipcRenderer = electron.ipcRenderer

var service = require('../js/common/service')
var sharedObject = electron.remote.getGlobal('sharedObject')

$('form').on('submit', function(){
  var username = $('.username').val().trim()
  var password = $('.password').val()

  // var args = {
  //   class_room_id: username,
  //   class_type: 2
  // }
  // service.call(service.LOGIN_API, args, 'POST', function (ret) {
  //   if (ret.rlt === 'true') {
  //     sharedObject.user = ret.data
  //     ipcRenderer.send('loadMain')
  //   } else {
  //     alert(ret.message)
  //   }
  // }, function(){
  //   alert('网络异常，请稍后再试！')
  // })
  ipcRenderer.send('loadMain')
})
