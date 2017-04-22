# electron-project
> 基于[Electron](https://electron.atom.io)框架：提供了一个能通过 JavaScript 和 HTML 创建桌面应用的平台，同时集成 Node 来授予网页访问底层系统的权限。


- 本地构建、方便开发和调试
- 开发环境和应用分离，便于打包
- 软件依赖环境自动下载，Inno Setup 打包 exe（build/setup-win.iss）
- 软件升级检查（将upgrade.json文件传至服务器）
- 支持Mac下打包和运行window软件（brew install wine --devel）

## Build Setup  @see package.json#scripts

``` bash
# install dependencies (npm install -g cnpm --registry=https://registry.npm.taobao.org)
npm run installall

# start client for development
npm start

# build for production with win32
npm run win32:dev/simu/prod

# build for production with win64
npm run win64:dev/simu/prod

# build for production with mac
npm run mac:dev/simu/prod

# check update for npm packages, please install 'npm install npm-check-updates -g' at first
npm run update
```

For OS X Users: If you get `Failed to start Cocoa app main loop`, you need to upgrade wine to the latest devel

```brew install wine --devel```

注：目前通过‘npm run win64’等自动编译的软件不支持中文名（setup-win.iss -> MyAppName），可通过‘npm run pack64’等先打包再运行dist/iss文件启动InnoSetup-Unicode手动编译。