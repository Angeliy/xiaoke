var comm = require('../../utils/comm.js');
var utilMd5 = require('../../utils/md5Type.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
   data: {
    countryCodes: ["+86", "+80", "+84", "+87"],
    countryCodeIndex: 0,
    shoujihaoma: "",        //获取当前输入的手机号码
  },

  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function(options) {
     // 该页面不允许分享
     wx.hideShareMenu();
   },

  //获取当前输入的手机号码
  getshoujihaoma:function(e){
    this.setData({
      shoujihaoma: e.detail.value
    });
  },

  //获取验证码
  getyangzhengma:function(){
    var that = this;
    var phone = that.data.shoujihaoma;
    if(null == phone || "" == phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var time = that.gettimecuo();
    var rand = that.count();
    var secret = utilMd5.hexMD5(phone + 'xiao' + time + 'ke' + rand + 'minixiaoke').toUpperCase();
    var data = {
      phone: phone,
      time: time,
      rand: rand,
      secret: secret
    };
    comm.requestPost("/service/account/sendMsm.do",data,function(res){
      if (res.data.result == "200") {
        wx.showToast({
          title: '发送成功',
          icon: 'success',
          duration: 2000
        })
       
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

  //忘记密码参数传递
  formSubmit:function(e){
    var data = {
      phone :e.detail.value.zhanghao,
      password :e.detail.value.newmima,
      code :e.detail.value.yangzhangma
    };
    comm.requestPost("/service/account/changePassword.do",data,function(res){
      wx.showModal({
        title: "修改成功",
        confirmColor: '#1da1f2',
      })
      wx.redirectTo({
        url: "../signin/signin",
      })
    },function(res){
      console.log(res);
      wx.showModal({
        title: res.data.msg,
        confirmColor: '#1da1f2',
      })
      console.log("操作失败");
    });
  },

  //获取当前时间戳
  gettimecuo:function(){
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    return timestamp;
  },

  //产生6位随机数
  count:function(){
    var i = Math.random()*(999999-100000)+100000;
    var j = parseInt(i,10);
    return j;
  },

  // 手机号
  bindCountryCodeChange: function(e) {
    // console.log('picker country code 发生选择改变，携带值为', e.detail.value);
    this.setData({
      countryCodeIndex: e.detail.value
    })
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


 })