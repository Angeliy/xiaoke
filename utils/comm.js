var app = getApp();

/**
 * 时间戳装换
 */
function js_date_time(unixtime) {
  var dateTime = new Date(parseInt(unixtime))
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth() + 1;
  var day = dateTime.getDate();
  var hour = dateTime.getHours();
  var minute = dateTime.getMinutes();
  var second = dateTime.getSeconds();

  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }
  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }

  var now = new Date();
  var now_new = Date.parse(now.toDateString());  //typescript转换写法
  var milliseconds = now_new - dateTime;
  var timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
  return timeSpanStr;
}

/**
 * 封装Post网络请求
 */
 function requestPost(name, data, successCallback, failCallback, completeCallback) {
    wx.request({
        url: app.globalData.site_url + name,
        data: data,
        method: 'POST',
        header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            // 'Accept': 'application/json'
            // 'content-type': 'application/json'
        },
        success: successCallback,
        fail: failCallback,
        complete: completeCallback
    })
}

/**
 * 封装Get网络请求
 */
 function requestGet(name, data, successCallback, failCallback, completeCallback) {
    wx.request({
        url: app.globalData.site_url + name,
        data: data,
        method: 'Get',
        header: {
            'Content-Type': 'application/json'
        },
        success: successCallback,
        fail: failCallback,
        complete: completeCallback
    })
}

module.exports = {
   requestPost: requestPost,
   requestGet: requestGet,
   js_date_time: js_date_time
}