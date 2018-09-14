var comm = require('../../utils/comm.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
   data: {
    userinfo:[],  //显示技师的信息
    shangban: 0, //显示上班状态
  },
  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function() {
    // 该页面不允许分享
    wx.hideShareMenu();
    // this.getjishiinfo();
    // this.getsahngban();
    route: "geren"
  },
  navigateTo:function(e)
  {
    app.navigateTo(e);
  },
  //获取技师信息
  getjishiinfo:function(){
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var data = {
      token: wx.getStorageSync("userToken"),
    };
    comm.requestPost("/service/employee/viewEmployeeMe.do",data,function(res){
      wx.hideLoading();
      if(res.data.result == "200"){
        that.setData({
          userinfo: res.data.data
        });
        that.setData({
          shangban: res.data.data.isWork
        });
      }
      
    },function(res){
      wx.hideLoading();
    });
  },

  //获取上班状态
  getsahngban:function(){
    var that = this;
    var data = {
      token: wx.getStorageSync("userToken"),
    };
    comm.requestPost("/service/employee/onAndOffDuty.do",data,function(res){
      console.log(res)
      if(res.data.result == "200"){
        that.setData({
          shangban: res.data.data
        });
      } else {
        wx.showModal({
          title: "设置失败",
          confirmColor: '#1da1f2',
        })
      }
    },function(res){
      console.log(res);
      wx.showModal({
        title: "获取失败",
        confirmColor: '#1da1f2',
      })
      console.log("操作失败");
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
   onReady: function() {

   },
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
                
                that.getjishiinfo();
              }
            });
          } else {
            that.getjishiinfo();
          }
        }
      })
    } else {
      that.getjishiinfo();
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
   onShow: function() {
     this.checkUser();
   },

  /**
   * 生命周期函数--监听页面隐藏
   */
   onHide: function() {

   },

  /**
   * 生命周期函数--监听页面卸载
   */
   onUnload: function() {

   },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
   onPullDownRefresh: function() {
     this.getjishiinfo();
     wx.stopPullDownRefresh();
   },

  /**
   * 页面上拉触底事件的处理函数
   */
   onReachBottom: function() {

   },

  /**
   * 用户点击右上角分享
   */
   onShareAppMessage: function() {

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