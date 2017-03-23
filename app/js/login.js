var electron = require('electron')
var ipcRenderer = electron.ipcRenderer

var service = require('../js/common/service')
var sharedObject = electron.remote.getGlobal('sharedObject')

$('form').on('submit', function(){
  var username = $('.username').val().trim()
  var password = $('.username').val()

  if (username && password) {
    var args = {
      username: username,
      password: password
    }

    service.call(service.LOGIN_API, args, 'POST', function (ret) {
      if (ret.rlt === 'true') {
        if (!ret.data) {
          alert('数据异常！')
          return
        }

        sharedObject.account = ret.data
        ipcRenderer.send('loadMain')
      } else {
        alert(ret.msg)
      }
    }, function() {
      alert('网络异常，请稍后再试！')
    })
  }

})
