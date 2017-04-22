const gulp = require('gulp')
const inno = require('gulp-inno')
const rename = require("gulp-rename")
const replace = require('gulp-replace')
const bom = require('gulp-bom')
const exec = require('child_process').exec
const config = require('./app/package.json')
// var argv = process.argv.slice(2)
// console.log('argv:' + argv)

gulp.task('env', function(){
  gulp
    .src('./config/' + process.env.NODE_ENV + '.js')
    .pipe(rename('env.js'))
    .pipe(gulp.dest('./app'))
})

gulp.task('dev', ['env'], function(cb){
  exec('electron app', function(err) {
    if (err) return cb(err)
    cb()
  })
})

gulp.task('mac', ['env'], function(cb){
  exec('electron-packager ./app client --platform darwin --arch x64 --out dist/ --icon ./build/favicon.icns --overwrite --download.mirror https://npm.taobao.org/mirrors/electron/ --asar', function(err) {
    if (err) return cb(err)
    cb()
  })
})

gulp.task('pack64', ['env'], function(cb){
  exec('electron-packager ./app client --platform=win32 --arch=x64 --out=dist/ --icon=./build/favicon.ico --overwrite --download.mirror=https://npm.taobao.org/mirrors/electron/ --asar', function(err) {
    if (err) return cb(err)

    gulp
      .src('./build/setup-win.iss')
      .pipe(bom())
      .pipe(replace('${version}', config.version))
      .pipe(replace('${sourcePath}', 'client-win32-x64'))
      .pipe(replace('${outputName}', 'client-win64-' + config.version + '-' + getShortName(process.env.NODE_ENV)))
      .pipe(rename('client-win64-' + process.env.NODE_ENV + '.iss'))
      .pipe(gulp.dest('./dist'))
      .on('end', function(){
        // console.log('pack win64 complete.')
        cb()
      })
  })
})

gulp.task('build64', ['pack64'], function(){
  gulp
    .src('./dist/client-win64-' + process.env.NODE_ENV + '.iss')
    .pipe(inno())
})

gulp.task('pack32', ['env'], function(cb){
  exec('electron-packager ./app client --platform=win32 --arch=ia32 --out=dist/ --icon=./build/favicon.ico --overwrite --download.mirror=https://npm.taobao.org/mirrors/electron/ --asar', function(err) {
    if (err) return cb(err)

    gulp
      .src('./build/setup-win.iss')
      .pipe(bom())
      .pipe(replace('${version}', config.version))
      .pipe(replace('${sourcePath}', 'client-win32-ia32'))
      .pipe(replace('${outputName}', 'client-win32-' + config.version + '-' + getShortName(process.env.NODE_ENV)))
      .pipe(rename('client-win32-' + process.env.NODE_ENV + '.iss'))
      .pipe(gulp.dest('./dist'))
      .on('end', function(){
        // console.log('pack win32 complete.')
        cb()
      })
  })
})

gulp.task('build32', ['pack32'], function(){
  gulp
    .src('./dist/client-win32-' + process.env.NODE_ENV + '.iss')
    .pipe(inno())
})

gulp.task('default', ['build64'])

function getShortName (env) {
  switch (env) {
    case 'development':
      return 'dev'
    case 'simulation':
      return 'simu'
    case 'production':
      return 'prod'
  }

  return env
}
