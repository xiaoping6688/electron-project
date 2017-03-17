# electron-project
> 基于[Electron](https://electron.atom.io)框架：提供了一个能通过 JavaScript 和 HTML 创建桌面应用的平台，同时集成 Node 来授予网页访问底层系统的权限。


- 本地构建、方便开发和调试
- 开发环境和应用分离，便于打包
- 软件依赖环境自动下载，Inno Setup 打包 exe（需要安装InnoSetup软件，项目build编译后运行build/setup-win.iss）
- 软件升级检查（将upgrade.json文件传至服务器）


## Build Setup

``` bash
# install dependencies
npm run installall

# start client for development
npm start

# build for production with win32
npm run win32

# build for production with win64
npm run win64

# build for production with mac
npm run mac

# check update for npm packages, please install 'npm install npm-check-updates -g' at first
npm run update
```
