var comm = require('../../utils/comm.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [], //显示雇主中心信息
    head:'',
    nickName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getStorinfo();
    // this.checkAuth();
    // 该页面不允许分享
    wx.hideShareMenu();
  },
  navigateTo: function (e) {
    app.navigateTo(e);
  },

  checkAuth:function() {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              that.setData({
                nickName: res.userInfo.nickName,
                head: res.userInfo.avatarUrl
              });
            }
          })
        }
      }
    })
  },

  //获取雇主信息
  getStorinfo:function(){
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var data = {
      token: wx.getStorageSync("userToken"),
    };
    comm.requestPost("/service/employer/viewEmployerMe.do",data,function(res){
      if(res.data.result == 200){
        that.setData({
          list: res.data.data
        });
      } 
      wx.hideLoading();
    },function(res){
      wx.hideLoading();
    });
  },

  checkUser:function() {
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

                if (null != privilege && privilege == 2) {
                  wx.redirectTo({
                    url: "../technician_user/technician_user"
                  });
                } else if (null != privilege && privilege == 3) {
                  wx.redirectTo({
                    url: "../store_user/store_user"
                  });
                } else {
                  wx.redirectTo({
                    url: "../customer_user/customer_user"
                  });
                }

                that.getStorinfo();
              }
            });
          } else {
            that.getStorinfo();
          }
        }
      })
    } else {
      that.getStorinfo();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.checkUser();
    this.checkAuth();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getStorinfo();
    this.checkAuth();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
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