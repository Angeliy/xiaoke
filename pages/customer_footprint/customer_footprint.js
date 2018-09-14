var comm = require('../../utils/comm.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
   data: {
    inputShowed: false,
    inputVal: "",
    items: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function(options) {
    this.getlihsizuji();
     // 该页面不允许分享
     wx.hideShareMenu();
  },

  //获取用户的历史足迹
  getlihsizuji:function(){
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var data = {
      token: wx.getStorageSync("userToken"),
    }
    comm.requestPost("/service/customer/viewFootprint.do",data,function(res){
      if(res.data.result == 200){
        that.setData({
          items: res.data.data
        });
      }
      wx.hideLoading();
    },function(res){
      wx.showToast({
        title: '加载失败',
        icon: 'none',
        duration: 2000
      })
      wx.hideLoading();
    });
  },

  // 搜索栏
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  jump: function(e) {

    wx.navigateTo({
      url: "../index/index?shopID=" + e.currentTarget.dataset.id,
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
   onShareAppMessage: function(options) {
    var path = 'pages/index/index';
    if( options.from == 'button' ){
      var that = this;
      var title = '时间很贵请别浪费约吧';
      var shopid = options.target.dataset.id;
      path = 'pages/index/index?shopID='+shopid;
      console.log(shopid)
      console.log(path)
      return {
        title: title,
        path: path,
        success: function(res) {
        },
        fail: function(res) {
        },
        complete: function() {
        }
      }
    }
  }

})