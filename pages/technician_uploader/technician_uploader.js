
Page({

  /**
   * 页面的初始数据
   */
   data: {
    files: [],
    workID: null
  },

  //上传图片到fwq
  uploadFileImag:function(nub){
    var that = this;
    var img = that.data.files[nub];
    wx.uploadFile({
      url: "https://safe.wyxke.com/xk_mini/service/employee/uploadWorkOneByOne.do",
      filePath: img,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data",
        'accept': 'application/json',
      },
      formData:{
        token: wx.getStorageSync("userToken"),
      },
      success: function(res){
        var datatmp = JSON.parse(res.data)
        that.setData({
          workID: datatmp.data.id
        });
        // 上传后面图片
        var length = that.data.files.length;
        if(length > 1) {
          for (var i = 1; i < that.data.files.length; i++) {
            that.uploadFileImag1(i);
          }
        }
      },
      fail: function(res){
        console.log('fail');
      },
    })
  },

  //上传图片到fwq
  uploadFileImag1:function(nub){
    var that = this;
    var img = that.data.files[nub];
    wx.uploadFile({
      url: "https://safe.wyxke.com/xk_mini/service/employee/uploadWorkOneByOne.do",
      filePath: img,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data",
        'accept': 'application/json',
      },
      formData:{
        token: wx.getStorageSync("userToken"),
        // workID: that.data.workID
      },
      success: function(res){
        console.log(nub);
        console.log(that.data.workID);
      },
      fail: function(res){
        console.log('fail');
      },
    })
  },

  //上传图片到fwq
  shangchuang:function(){
    var that = this;
    if (that.data.files.length <= 0) {
      wx.showModal({
        title: '提示',
        content: '请选择图片',
      });
      return 0;
    }
    // if(that.data.files.length > 3){
    //   wx.showModal({
    //     title: '提示',
    //     content: '图片数量最大为3张',
    //   });
    //   return 0;
    // }
    that.uploadFileImag(0);
    wx.redirectTo({
      url: "../technician_timeaxis/technician_timeaxis",
    })
  },

  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        // var filestmp = that.data.files.concat(res.tempFilePaths).slice(0,3);
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },

  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  //长按删除图片
  deleteImage: function (e) {
    var that = this;
    var image = that.data.files;
    var index = e.currentTarget.dataset.id; //获取当前长按图片下标
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定了');
          image.splice(index, 1);
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
        that.setData({
          files: image
        });
      }
    })
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