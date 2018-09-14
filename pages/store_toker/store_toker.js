var comm = require('../../utils/comm.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    items: [{
      name: '20元/月',
      value: '20元/月'
    },
    {
      name: '100元/半年',
      value: '100元/半年',
      checked: 'true'
    },
    {
      name: '180元/一年',
      value: '180元/一年'
    },
    ],
    projects: [],
    clicktype: "",       //被点击的类型
    day: 0                //VIP到期时间
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init();
    // 渲染筛选
    this.fetchFilterData();

    // 该页面不允许分享
    wx.hideShareMenu();
  },

  // VIP开通
  formSubmit: function (e) {
    var that = this;
    var leixing = 0;
    if (e.detail.value.lxvip == '180元/一年') {
      leixing = 3;
    } else if (e.detail.value.lxvip == '100元/半年') {
      leixing = 2;
    } else if (e.detail.value.lxvip == '20元/月') {
      leixing = 1;
    }
    var data = {
      token: wx.getStorageSync("userToken"),
      type: leixing,
    };
    comm.requestPost("/service/account/WXPay.do", data, function (res) {
      if (res.data.result == "200") {
        console.log(res);
        wx.requestPayment({
          'timeStamp': res.data.data.timeStamp,
          'nonceStr': res.data.data.nonceStr,
          'package': res.data.data.package,
          'signType': 'MD5',
          'paySign': res.data.data.paySign,
          'success': function (res) {
            wx.showToast({
              title: '开通成功',
              icon: 'success',
              duration: 2000
            })
            that.setData({
              showModalStatus: false
            });
          },
          'fail': function (res) {
          }
        })
      }
    }, function (res) {
      wx.showToast({
        title: '失败',
        icon: 'none',
        duration: 2000
      })
    });
  },

  // 顾客筛选
  fetchFilterData: function () {
    this.setData({
      filterdata: {
        "contain": [{
          "id": 1,
          "title": "预约顾客"
        },
        {
          "id": 2,
          "title": "绑定顾客"
        },
        {
          "id": 3,
          "title": "新增顾客"
        },
        ],
      }
    })
  },

  //提交优惠信息
  tokeyouhui: function (e) {
    var that = this;
    // var tempprojects = [];
    var data = {
      token: wx.getStorageSync("userToken"),
      message: e.detail.value.tokentips,
      type: that.data.clicktype,
      // projects: tempprojects
    };
    for (var i in that.data.projects) {
      // tempprojects.push({ projectID: that.data.projects[i].projectID, money: e.detail.value[that.data.projects[i].projectID] });
      data["projects[" + i + "].projectID"] = that.data.projects[i].projectID;
      data["projects["+i+"].money"]= e.detail.value[that.data.projects[i].projectID];
    }

    comm.requestPost("/service/employer/setFunctionPay.do", data, function (res) {
      if (res.data.result == 200) {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })

        this.init();
        // 渲染筛选
        this.fetchFilterData();
        var page = getCurrentPages().pop();
        page.onLoad();
        // wx.redirectTo({
        //   url: "../store_toker/store_toker"
        // });
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    }, function (res) {
      wx.showToast({
        title: '失败',
        icon: 'none',
        duration: 2000
      })
    });
  },

  //获取项目列表
  chooseContain: function (e) {
    var that = this;
    this.setData({
      filter: Object.assign({}, this.data.filter, {
        containid: e.currentTarget.dataset.id
      })
    })
    var checkednub = this.data.filter.containid;
    that.setData({
      clicktype: checkednub
    });
    var data = {
      token: wx.getStorageSync("userToken"),
      type: checkednub
    };
    comm.requestPost("/service/employer/viewFunctionPay.do", data, function (res) {
      if (res.data.result == 200) {
        that.setData({
          projects: res.data.data.projects,
          day: res.data.data.day
        });
      }
    }, function (res) {
      console.log(res);
      wx.showModal({
        title: "开通失败",
        confirmColor: '#1da1f2',
      })
      console.log("操作失败");
    });
  },

  init: function() {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var checkednub = 1;
    that.setData({
      clicktype: checkednub,
      filter: Object.assign({}, this.data.filter, {
        containid: 1
      })
    });
    var data = {
      token: wx.getStorageSync("userToken"),
      type: checkednub
    };
    comm.requestPost("/service/employer/viewFunctionPay.do", data, function (res) {
      console.log(res)
      if (res.data.result == 200) {
        that.setData({
          projects: res.data.data.projects,
          day: res.data.data.day
        });
      }
      wx.hideLoading()
    }, function (res) {
      wx.hideLoading()
    });
  },

  // VIP弹窗动画
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例
    var animation = wx.createAnimation({
      duration: 200, //动画时长
      timingFunction: "linear", //线性
      delay: 0 //0则不延迟
    });

    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;

    // 第3步：执行第一组动画
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function () {
      // 执行第二组动画
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })

      //关闭
      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 200)
    // 显示
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      });
    }
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