Page({

  /**
   * 页面的初始数据
   */
  data: {

  },


  // 地图
  // click: function(e) {
  //   wx.openLocation({

  //     latitude: 23.362490,

  //     longitude: 116.715790,

  //     scale: 18,

  //     name: '华乾大厦',

  //     address: '金平区长平路93号'

  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var longitude = options.longitude;
    var latitude = options.latitude;
    var address = options.address;
    var shopName = options.shopName;
    if(null != longitude) {
      longitude = parseFloat(longitude);
    }
    if(null != latitude) {
      latitude = parseFloat(latitude);
    }
    wx.openLocation({

      latitude: latitude,

      longitude: longitude,

      scale: 18,

      name: shopName,

      address: address

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

  }
})