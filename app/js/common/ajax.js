/**
 * Ajax请求封装
 */
var ajax = {
  logger: null,

  /**
   * 发送GET请求
   * @param {String} api 接口URL
   * @param {Object} args 参数
   * @param {Function} onSuccess 成功回调函数
   * @param {Function} onError 失败回调函数
   * @return {jqXHR}
   */
  get: function (api, args, onSuccess, onError) {
    return this.call(api, args, 'GET', onSuccess, onError);
  },

  /**
   * 发送POST请求
   * @param {String} api
   * @param {Object} args
   * @param {Function} onSuccess
   * @param {Function} onError
   * @return {jqXHR}
   */
  post: function (api, args, onSuccess, onError) {
    return this.call(api, args, 'POST', onSuccess, onError);
  },

  call: function (api, args, method, onSuccess, onError) {
    ajax.trace('[Request] ' + api + ' method: ' + method + ' args: ' + JSON.stringify(args));

    return $.ajax({
      url: api,
      type: method,
      data: args ? JSON.stringify(args) : null,
      dataType: 'json',
      async: true,
      headers: {},
      contentType: 'application/json',
      timeout: 10000,
      success: function(data){
        ajax.trace('[Response] ' + api + "\n" + JSON.stringify(data));

        if (typeof(onSuccess) === 'function'){
          onSuccess(data);
        }
      },
      error: function(xhr, status){
        ajax.trace('[Error] ' + api + ': ' + xhr.status + ' - ' + status);

        if (typeof(onError) === 'function'){
          onError();
        }
      }
    });
  },

  trace: function (log) {
    typeof this.logger === 'function' ? this.logger(log) : console.log(log);
  }
};

module.exports = ajax;
