var comm = require('../../utils/comm.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
   data: {
    page: 1,      //原始页数
    size: 20,     //查询的数组长度
    items: [],     //全部的作品集合
    tempimg: [],  //暂时图片
    zongchang: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function(options) {
    this.getworkimg();
     // 该页面不允许分享
     wx.hideShareMenu();
  },

  //雇员获取自己的作品
  getworkimg:function(){
    var that = this;
    // that.setData({
    //   items: [],
    //   tempimg: []
    // });
    var data = {
      token: wx.getStorageSync("userToken"),
      num: that.data.page,
      size: that.data.size
    };
    comm.requestPost("/service/employee/viewWorks.do",data,function(res){
      if(res.data.result == 200){
        // var temp = [];
        var list = res.data.data.list;
        // for(var i in list)
        // {
        //   list[i].gmtCreate = comm.js_date_time(list[i].gmtCreate);
        //   that.data.items.push( list[i] );
        // }
        for(var i in list)
        {
          for(var j in list[i].workImages)
          {
            that.data.items.push(list[i].workImages[j].url);
          }
        }
        //分离图片url
        for(var i in list)
        {
          for(var j in list[i].workImages)
          {
            var data = {
              url: list[i].workImages[j].url,
              id: list[i].workImages[j].workId
            };
            that.data.tempimg.push(data);
          }
        }
        that.setData({
          imagurl: that.data.tempimg,
          items: that.data.items,
          zongchang: res.data.data.pageInfo.total
        });
      }
    },function(res){
      console.log(res);
      console.log("获取失败");
    });
  },

  //技师
  previewImg: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.text;
    wx.previewImage({
      current: index,
      urls: that.data.items // 需要预览的图片http链接列表
    })
  },


  // 长按删除图片
  deleteImage: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index; //获取当前长按图片下标
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function(res) {
        if (res.confirm) {
          var data = {
            token: wx.getStorageSync("userToken"),
            workID: index
          };
          console.log(data);
          comm.requestPost("/service/employee/removeWorks.do",data,function(res){
            if(res.data.result == 200){
              wx.showToast(
              {
                title: '删除成功',
                icon: 'success',
                duration: 2000
              });

              // 重新刷新页面
              that.setData({
                imagurl: [],
                items: [],
                page: 1,
                tempimg: []
              });
              that.getworkimg();
            }
          },function(res){
            console.log(res);
            console.log("删除失败");
          });
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
      }
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
     var that = this;
     that.setData({
       imagurl: [],
       items: [],
       page: 1,
       tempimg:[]
     });
    this.getworkimg();
    wx.stopPullDownRefresh();
   },

  /**
   * 页面上拉触底事件的处理函数
   */
   onReachBottom: function() {
     var that = this;
     if (this.data.zongchang + this.data.size * 2 < this.data.size * this.data.page) {
       return 0;
     }
     this.setData({
       page: that.data.page + 1
     });
     this.getworkimg();
   },

  /**
   * 用户点击右上角分享
   */
   onShareAppMessage: function() {

   },

  // 链接上传页
  uploader: function() {
    wx.navigateTo({
      url: "../technician_uploader/technician_uploader",
    })
  },

})