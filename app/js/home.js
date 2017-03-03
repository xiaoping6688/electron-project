/**
 * 首页
 */

function init () {
  var args = {
    list: [
      { id:'id1', name:'1' },
      { id:'id2', name:'2' },
      { id:'id3', name:'3' }
    ]
  }
  var content = template('home', args)
  $('#page').html(content)

  $('.home .quit').click(function(){
    $('#page').html('')
  })
}

exports.init = init
