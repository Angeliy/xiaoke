
Page({

  /**
   * 页面的初始数据
   */
   data: {
   },

  //拓客界面的跳转
  goToke:function(){
    if(wx.getStorageSync("usershuxing")==3){
      wx.navigateTo({
        url:"../store_toker/store_toker"
      });
    }else{
      wx.showToast({
        title: '暂未开放',
        icon: 'loading',
        duration: 1000
      });
    }
  },

  openToast: function () {
    wx.showToast({
      title: '暂未开放',
      icon: 'loading',
      duration: 1000
    });
  },

  openToast1: function () {
    wx.showToast({
      title: '暂未开放',
      icon: 'loading',
      duration: 1000
    });
  },
  openToast2: function () {
    wx.showToast({
      title: '暂未开放',
      icon: 'loading',
      duration: 1000
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