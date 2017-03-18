const gulp = require('gulp')
const inno = require('gulp-inno')
const exec = require('child_process').exec
// var argv = require('minimist')(process.argv.slice(2))

gulp.task('build64', function(cb){
  exec('electron-packager ./app client --platform=win32 --arch=x64 --out=dist/ --icon=./build/favicon.ico --overwrite --download.mirror=https://npm.taobao.org/mirrors/electron/ --asar', function(err) {
    if (err) return cb(err)
    gulp.src('./build/setup-win64.iss').pipe(inno())
  })
})

gulp.task('build32', function(cb){
  exec('electron-packager ./app client --platform=win32 --arch=ia32 --out=dist/ --icon=./build/favicon.ico --overwrite --download.mirror=https://npm.taobao.org/mirrors/electron/ --asar', function(err) {
    if (err) return cb(err)
    gulp.src('./build/setup-win32.iss').pipe(inno())
  })
})

gulp.task('default', ['build64'])
