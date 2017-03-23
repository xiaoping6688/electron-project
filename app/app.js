const electron = require('electron')
// Module to control application life.
const app = electron.app
// global shortcut
const globalShortcut = electron.globalShortcut
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
// Module to create native dialog window.
const dialog = electron.dialog
// Communicate asynchronously from the main process to renderer processes
const ipcMain = electron.ipcMain
// upgrade client
const autoupdater = require('./lib/inno-updater')

const path = require('path')
const url = require('url')

const UPGRADE_CHECK_URL = 'http://ip/client/release.json'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// 初始化共享数据
function initStore () {
  global.sharedObject = {
    account: {}
  }
}

initStore()

// 使应用在同一时刻最多只会有一个实例
const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore()
    }

    mainWindow.focus()
  }
})

if (shouldQuit) {
  app.quit()
}

// 创建窗口
function createWindow () {
  // Create the main browser window.
  var electronScreen = electron.screen
  var size = electronScreen.getPrimaryDisplay().size

  mainWindow = new BrowserWindow({
    width: size.width,
    height: size.height,
    // alwaysOnTop: true,
    // fullscreen: true,
    // frame: false,
    // transparent: true,
    // backgroundColor: '#FFFFFF'
  })

  // and load the login.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'html/login.html'),
    protocol: 'file',
    slashes: true
  }))

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    // mainWindow = null
    app.quit()
  })

  // Mac系统下，默认的快捷键Redo、Undo、复制粘贴等不能使用，需要通过创建应用菜单的方式做一个映射。
  if (process.platform === 'darwin') {
    const Menu = electron.Menu
    // Create the Application's main menu
    let template = [{
        label: "Application",
        submenu: [
          { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
          { type: "separator" },
          { label: "Quit", accelerator: "Command+Q", click: function() { app.quit() }}
        ]
      }, {
        label: "Edit",
        submenu: [
          { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
          { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
          { type: "separator" },
          { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
          { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
          { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
          { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]
      }, {
        label: 'View',
        submenu: [
          { role: 'reload' },
          { role: 'toggledevtools', accelerator: 'Ctrl+Alt+I'},
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      }, {
        label: 'Window',
        role: 'window',
        submenu: [
          { label: 'Minimize', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
          { label: 'Hide ', accelerator: 'Command+H', role: 'hide' },
          { label: 'Close', accelerator: 'CmdOrCtrl+W', role: 'close' }
        ]
      }
    ]

    //注册菜单
    let menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  } else {
    // windows不显示菜单
    mainWindow.setMenu(null)

    // Open the DevTools.
    globalShortcut.register('control+alt+i', function() {
      let win = BrowserWindow.getFocusedWindow()
      if (!(win && win.webContents)) return

      if (win.webContents.isDevToolsOpened()) {
        win.webContents.closeDevTools()
      } else {
        win.webContents.openDevTools()
      }
    })
  }
}

app.on('will-quit', function () {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})


// listen child process events
ipcMain.on('loadMain', function (event, args) {
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'html/main.html'),
    protocol: 'file',
    slashes: true
  }))
})

function showMain () {
  // mainWindow.show()
  mainWindow.restore()
}
ipcMain.on('showMain', showMain)

function hideMain () {
  // mainWindow.hide()
  mainWindow.minimize()
}
ipcMain.on('hideMain', hideMain)

ipcMain.on('logout', function (event, args) {
  initStore()
  showMain()

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'html/login.html'),
    protocol: 'file',
    slashes: true
  }))
})


// check update for windows system
if (process.platform === 'win32') {
  autoupdater.setFeedURL(UPGRADE_CHECK_URL)
  autoupdater.checkForUpdates()
}

autoupdater.on('update-downloaded', function(releasefileJSON, fullpath){
  autoupdater.quitAndInstall()
})

autoupdater.on('update-not-available', function(){
  console.log('INFO: Update not available')
})

autoupdater.on('update-available', function(releasefileJSON, next){
  console.log('INFO: Update available', releasefileJSON.version)
  dialog.showMessageBox({
    type: 'question',
    icon: null,
    buttons: ['确定', '取消'],
    defaultId: 0,
    title: '',
    message: '发现新版本:' + releasefileJSON.version + '，是否立即升级？'
  }, function(response){
    if (response === 0) {
      console.log('INFO: Update begin...')
      next()
    } else {
      console.log('INFO: Update canceled!')
    }
  })
})

autoupdater.on('progress',function(progress){
  console.log("INFO: Loading " + progress.percentage * 100 + "%")
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.