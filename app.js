//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // if (wx.getStorageSync("openId") == "" && wx.getStorageSync("userToken") == "") {
    //   wx.login({
    //     success: function (res) {
    //       console.log(res)
    //       if (res.code) {
    //         wx.setStorageSync('usercode', res.code);
    //       } else {
    //         console.log("获取信息失败");
    //       }
    //     }
    //   })
    // }
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res){
              wx.setStorageSync('userInfo', res.userInfo);
            }
          })
        }
      }
    })
  },

  navigateTo: function (e) {
    var path = e.currentTarget.dataset.path;
    // 点击获取formId后跳转
    setTimeout(function () {
      wx.redirectTo({
        url: path,
      });
    }, 300)
    
  },
  globalData:
  {
    site_url: 'https://safe.wyxke.com/xk_mini',
    // theme:{},
    // formids:[],
    // api_host: '',
  },


})