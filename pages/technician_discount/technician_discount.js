var comm = require('../../utils/comm.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: 1,      //原始的page下标
    size: 15,     //要显示的页数
    msglist: [],   //消息集合
    zongchang: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getwayprocet();
    // 该页面不允许分享
    wx.hideShareMenu();
  },

  //获取信息
  getwayprocet: function () {
    var that = this;
    var data = {
      token: wx.getStorageSync("userToken"),
      num: that.data.page,
      size: that.data.size
    }
    comm.requestPost("/service/account/viewMessages.do", data, function (res) {
      if (res.data.result == 200) {
        var list = res.data.data.list;
        for (var i in list) {
          var date = new Date(list[i].gmtCreate * 1000);
          var month = date.getMonth() + 1;
          if(month < 10) {
            month = "0"+month;
          }
          var minutes = date.getMinutes();
          if(minutes < 10) {
            minutes = "0" + minutes;
          }
          list[i].gmtCreate = date.getFullYear() + "-" + month + "-" + date.getDate() + " " + date.getHours() + ":" + minutes;
          that.data.msglist.push(list[i]);
        }
        that.setData({
          msglist: that.data.msglist,
          zongchang: res.data.data.pageInfo.total
        });
      }
    }, function (res) {

    });
  },

  //滑动到底部加载更多
  jiazaigengduo: function () {
    var that = this;
    if(this.data.zongchang+this.data.size*2 < this.data.size*this.data.page ){
      return 0;
    }
    that.setData({
      page: that.data.page + 1
    });
    that.getwayprocet();
  },

  //删除信息
  deletemesg: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.text;
    console.log(index);
    var data = {
      token: wx.getStorageSync("userToken"),
      messageID: index
    }
    wx.showModal({
      //title: '提示',
      content: '确定删除吗？',
      confirmColor: '#1da1f2',
      success: function (res) {
        if (res.confirm) {
          comm.requestPost("/service/account/removeMessage.do", data, function (res) {
            if (res.data.result == 200) {
              wx.showToast({
                title: '删除成功',
                icon: 'succes',
                duration: 1000,
                mask: true
              });
              //初始化data的值
              that.setData({
                page: 1,
                size: 10,
                msglist: []
              });
              that.getwayprocet();
            }
          }, function (res) {
            console.log(res);
            console.log("操作失败");
            this.getwayprocet();
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
          that.getwayprocet();
        }
      }
    })
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