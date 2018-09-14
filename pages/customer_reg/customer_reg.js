var comm = require('../../utils/comm.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
   data: {
    files: [],
    one: [],
    date: '2016-09-01',
    tispmesg: "",
  },

  hideshibai:function(){
    this.setData({
      shiabaitips:false
    });
  },

  //技师注册
  formSubmit:function(e){
    wx.showLoading({
      title: '提交中',
      mask: true
    })
    var that = this;
    var data = {
      token: wx.getStorageSync("userToken"),
      password: e.detail.value.jsmima,
      phone: e.detail.value.jszhanghao,
      employerPhone: e.detail.value.jsdzphone,
      name: e.detail.value.jsmingzi,
      position: e.detail.value.jszhiwei,
      workingTime: e.detail.value.jsnianfen,
      skills: e.detail.value.jsshangchang,
      introduce: e.detail.value.jsjianjie,
    };
    comm.requestPost("/service/employee/registerEmployee.do",data,function(res){
      if (res.data.msg == 'success') {
        wx.showModal({
          title: '修改成功',
          content: '是否跳转到首页',
          success: function (res) {
            if (res.confirm) {
              //点击确定 跳转首页
              wx.redirectTo({
                url: "../index/index"
              });
            }
            else{
              return 0;
            }
          }
        })
      }else{
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000,
          mask: true
        });
      }
    },function(res){
      wx.hideLoading();
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function (options) {
     // 该页面不允许分享
     wx.hideShareMenu();
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

   }
 })