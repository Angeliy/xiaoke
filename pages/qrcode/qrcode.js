var comm = require('../../utils/comm.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
   data: {
    token: "",
  },

  //获取店铺的二维码的url
  geterweima:function(){
    var that = this;
    that.setData({
      token: wx.getStorageSync("userToken"),
    });
    // var data = {
    //   token: wx.getStorageSync("userToken"),
    // }
    // comm.requestPost("/service/employer/getShopQRCode.do",data,function(res){
    //   console.log(res);
    //   that.setData({
    //     url: res
    //   });
    // },function(res){
    //   wx.showModal({
    //     title: res.data.msg,
    //     confirmColor: '#1da1f2',
    //   })
    // });
  },
  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function (options) {
    this.geterweima();
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