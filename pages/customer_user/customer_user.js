var comm = require('../../utils/comm.js');
var app = getApp();
Page({

  /**
  * 页面的初始数据
  */
  data: {
    userinfo: [],
    showModalStatus: false,
    rootshow: false,            //是否授权的标致
    nums:[],
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    // 该页面不允许分享
    wx.hideShareMenu();
    
  },
  navigateTo: function (e) {
    app.navigateTo(e);
  },

  onPullDownRefresh: function () {
    //检测用户身份
    this.checkUser();
    // 获取用户消息，订单数量
    this.getNum();
    wx.stopPullDownRefresh();
  },

   getNum:function() {
     var that = this;
     var token = wx.getStorageSync("userToken");
     comm.requestPost("/service/customer/viewCustomerMe.do", { token: token }, function (res) {
       if (res.data.result == "200") {
         that.setData({
           nums: res.data.data
         });
       }
     }, function (res) {
       console.log(res);
     });
   },

  //关闭授权窗口
  // bindGetUserInfo: function (e) {
  //   this.setData({
  //     showModalStatus: false
  //   })
  // },

  // 点击授权按钮的回调
  // getUserInfo: function (e) {
  //   console.log(e)
  //   var that = this;
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userinfo: e.detail.userInfo,
  //     rootshow: true,
  //     showModalStatus: false
  //   });
  //   this.checkUser();
  //   // 更新用户的头像，昵称
  //   var data2 = {
  //     token: wx.getStorageSync("userToken"),
  //     nickName: e.detail.userInfo.nickName,
  //     head: e.detail.userInfo.avatarUrl
  //   }
  //   comm.requestPost("/service/customer/updateUserInfo.do", data2, function (res) {
  //   }, function (res) {
  //     console.log(res);
  //   });
  // },

  //检测用户是否用户信息授权
  // checkUserInfo: function () {
  //   var that = this;
  //   wx.getSetting({
  //     success: function (res) {
  //       if (!res.authSetting['scope.userInfo']) {
  //         // 已经授权，可以直接调用 getUserInfo 获取头像昵称
  //         wx.getUserInfo({
  //           success: function (res) {
  //             that.setData({
  //               rootshow: true,
  //               userinfo: res.userInfo,
  //               showModalStatus: true
  //             });
  //             that.checkUser();
  //           }
  //         })
  //       } else {
  //         // that.checkUser();
  //       }
  //     }
  //   })
  // },

  /**
   * 存储用户信息
   */
   checkUser: function () {
    var that = this;
    var userToken = wx.getStorageSync("userToken");
    if (typeof (userToken) == "undefined" || typeof (userToken) == "undefined" || userToken == null || userToken == "") {
      wx.login({
        success: function (res) {
          if (res.code) {
            var usercode = res.code;
            comm.requestPost("/service/customer/getOpenID.do", { code: usercode }, function (res) {
              if (res.data.result == 200) {
                var userToken = res.data.data.token;
                var openId = res.data.data.openId;
                var privilege = res.data.data.privilege;
                wx.setStorageSync("usershuxing", privilege);
                wx.setStorageSync("userToken", userToken);
                wx.setStorageSync("openId", openId);
                that.go();
              } 
            });
          } else {
            that.go();
          }
        }
      })
    } else {
      that.go();
    }

    
  },

  go:function() {
    var that = this;
    //用户登录之后 判断什么然后跳转
    var token = wx.getStorageSync("userToken");
    comm.requestPost("/service/account/getUserInfo.do", { token: token }, function (res) {
      if (res.data.result == "200") {
        console.log(res)
        var privilege = res.data.data.privilege;
        wx.setStorageSync("usershuxing", privilege);
        if (null != privilege && privilege == 2) {
          wx.redirectTo({
            url: "../technician_user/technician_user"
          });
        } else if (null != privilege && privilege == 3) {
          wx.redirectTo({
            url: "../store_user/store_user"
          });
        } else {
          that.setData({
            userinfo: res.data.data
          });
        }
        //防止页面闪烁一下的
        that.setData({
          rootshow: true,
          hasdata: true
        });
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000,
          mask: true
        });
      }
    }, function (res) {
      console.log(res);
    });
  },

  //页面跳转前检测登录
  tiaozhuan: function (e) {
    console.log(e)
    var that = this;
    var path = e.currentTarget.dataset.path;
    if (that.data.rootshow) {
      wx.navigateTo({
        url: path
      });
    } else {
      that.setData({
        showModalStatus: true
      });
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //检测用户身份
    this.checkUser();
    // 获取用户消息，订单数量
    this.getNum();
  },

  onShareAppMessage: function () {
  },
  formSubmit: function (e) {
    var data = {
      formId: e.detail.formId,
      token: wx.getStorageSync("userToken")
    }
    comm.requestPost("/service/account/saveFormId.do", data, function (res) {

    });
  }
})