var comm = require('../../utils/comm.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
   data: {
    countryCodes: ["+86", "+80", "+84", "+87"],
    countryCodeIndex: 0,
    chaozuotips: "",            //操作提示
  },

  //关闭失败提示
  hideshibai:function(){
    this.setData({
      shiabaitips:false
    })
    // //用户登录之后 判断什么然后跳转
    if(wx.getStorageSync("usershuxing")==1){
      wx.redirectTo({
        url:"../customer_user/customer_user"
      });
    }else if(wx.getStorageSync("usershuxing")==2){
      wx.redirectTo({
        url:"../technician_user/technician_user"
      });
    }else if(wx.getStorageSync("usershuxing")==3){
      wx.redirectTo({
        url:"../store_user/store_user"
      });
    }
  },

  //用户登录
  formSubmit:function(e){
    var that = this;
    var data = {
      phone: e.detail.value.userzhanghao,
      password: e.detail.value.usermima,
    };
    comm.requestPost("/service/account/login.do",data,function(res){
 
      if(res.data.result == "200"){
        wx.setStorageSync("usershuxing", res.data.data.privilege);
        wx.setStorageSync("userToken", res.data.data.token);
        wx.setStorageSync("openId", res.data.data.openId);
        that.setData({
          shiabaitips:true,
          chaozuotips: "登录成功"
        })
        // wx.showToast({
        //   title: '登录成功',
        //   icon: 'success',
        //   duration: 2000
        // })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
       
      }
    },function(res){
      wx.showToast({
        title: '失败',
        icon: 'none',
        duration: 2000
      })
    });
  },

  // 手机号
  bindCountryCodeChange: function(e) {
    // console.log('picker country code 发生选择改变，携带值为', e.detail.value);
    this.setData({
      countryCodeIndex: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function(options) {
     wx.setStorageSync('openId', "");
     wx.setStorageSync('userToken', "");
     // 该页面不允许分享
     wx.hideShareMenu();
   },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
   onReady: function() {

   },

  /**
   * 生命周期函数--监听页面显示
   */
   onShow: function() {

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

  // 忘记密码跳转
  forget: function () {
    wx.navigateTo({
      url: "../forget/forget",
    })
  },

})