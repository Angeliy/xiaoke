var comm = require('../../utils/comm.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
   data: {
    winHeight: "", //窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    page: 1,       //原始的page下标
    size: 10,       //要显示的页数
    leixing:0,      //获取的数据类型
    wangchengtime:"",     //完成的时间
    items:[],
    zongchang: 0   //全部的消息集合
  },

  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function(options) {
     // 该页面不允许分享
     wx.hideShareMenu();
    var mThis = this
    /**
     * 获取系统信息
     */
     wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
        clientWidth = res.windowWidth,
        rpxR = 740 / clientWidth;
        var calc = clientHeight * rpxR - 85;
        console.log(calc)
        mThis.setData({
          winHeight: calc
        });
      }
    });
     this.getwayprocet();
   },

  //获取订单信息
  getwayprocet:function(){
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var data = {
      token: wx.getStorageSync("userToken"),
      status: that.data.leixing,
      num: that.data.page,
      size: that.data.size
    }
    comm.requestPost("/service/employee/viewEmployeeOrder.do",data,function(res){
      console.log(res);
      if(res.data.result == 200){
        var list = res.data.data.list;
        for(var i in list)
        {
          // list[i].orderTime = comm.js_date_time(list[i].orderTime);
          that.data.items.push( list[i] );
        }
        that.setData({
          items: that.data.items,
          zongchang: res.data.data.pageInfo.total
        });
      }
      wx.hideLoading();
    },function(res){
      wx.hideLoading();
    });
  },

  // 滑动tab
  switchTab: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    var cur = e.detail.current;
    var leixing = 0;
    if (cur == 0) {
      leixing = leixing;
    } else if (cur == 1) {
      leixing = 3;
    } else if (cur == 2) {
      leixing = 2;
    } else {
      leixing = 1;
    }
    this.setData({
      page: 1,
      leixing: leixing,
      currentTab: cur,
      items: []
    })
    this.getwayprocet();
  },

  // 拨打电话
  call: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },

  // tab点击标题切换当前页时改变样式
  swichNav: function(e) {
    var that = this;
    var cur = e.target.dataset.current;
    console.log(e.target.dataset.current)
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      var leixing = 0;
      if(cur == 0){
        leixing = leixing;
      }else if(cur == 1){
        leixing = 3;
      }else if(cur == 2){
        leixing = 2;
      }else{
        leixing = 1;
      }
      this.setData({
        page: 1,
        leixing: leixing,
        currentTab: cur
      })
      // this.getwayprocet();
    }
  },

  //滑动到底部加载更多
  jiazaigengduo:function(){
    var that = this;
    if(this.data.zongchang+this.data.size*2 < this.data.size*this.data.page ){
      return 0;
    }
    that.setData({
      page: that.data.page+1
    });
    that.getwayprocet();
  },

  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function() {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
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