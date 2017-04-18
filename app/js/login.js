var electron = require('electron')
var remote = electron.remote
var app = (remote && remote.app) || electron.app
var ipcRenderer = electron.ipcRenderer

var service = require('../js/common/service')
var sharedObject = remote.getGlobal('sharedObject')

$('.sys-version').html('v' + app.getVersion())
ipcRenderer.on('syslog', function (event, message) {
  $('.syslog').html(message)
})

$('form').on('submit', function(){
  var username = $('.username').val().trim()
  var password = $('.username').val()

  if (username && password) {
    service.login(username, password, function (data) {
      sharedObject.account = data
      ipcRenderer.send('loadMain')
    }, function() {
      alert('网络异常，请稍后再试！')
    })
  }

})
