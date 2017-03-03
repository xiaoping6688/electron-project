/**
 * 弹框封装
 */

/**
 * 打开弹窗
 * @param content 要展现的页面内容
 * @param anim 打开时是否有动画效果
 * @param fullscreen 是否全屏
 */
function open (content, anim = true, fullscreen = false) {
  var win = layer.open({
    type: 1,
    title: false,
    closeBtn: 0,
    shade: 0.6,
    shadeClose: true,
    anim: anim ? 0 : -1,
    area: [ fullscreen ? '100%' : '62%', fullscreen ? '100%' : '83%' ],
    skin: 'popup',
    content: content
  })

  if (fullscreen === true) {
    layer.full(win)
  }

  return win
}

/**
 * 打开弹窗（背景透明）
 * @param content 要展现的页面内容
 * @param anim 打开时是否有动画效果
 */
function openTransparent (content, anim = true) {
  var win = layer.open({
    type: 1,
    title: false,
    closeBtn: 0,
    shade: [ 0.6, '#000' ],
    anim: anim ? 0 : -1,
    area: 'auto',
    skin: 'popup-transparency',
    content: content
  })

  return win
}

function close (win) {
  layer.close(win)
}

function closeAll () {
  layer.closeAll('page')
}

exports.open = open
exports.openTransparent = openTransparent
exports.close = close
exports.closeAll = closeAll
