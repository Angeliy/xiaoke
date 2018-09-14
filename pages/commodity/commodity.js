// pages/commodity/commodity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: [{
        url: '../../image/sw.png'
      },
      {
        url: '../../image/sw_1.png'
      },
      {
        url: 'http://img04.tooopen.com/images/20130701/tooopen_20083555.jpg'
      },

    ]
  },
  //跳转首页
  onTuan:function() {
    wx.navigateTo({
      url: "/pages/index/index", //跳转首页
    })
  },
 //viewAppraise 点击查看评价跳转评价列表
  viewAppraise:function() {
    wx.navigateTo({
      url: '/pages/appraise/appraise',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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