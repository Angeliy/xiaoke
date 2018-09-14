var app = getApp();
var comm = require('../../utils/comm.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //num: 5, //后端给的分数,显示相应的星星
    one_2: 0,
    two_2: 5,
    shopid: 0, //默认shopid为0
    shopinfo: [],
    schoolList: [],
    advertisings: [], //广告
    userDTOS: [], //技师
    showModalStatus: false,
    rootshow: false //是否授权的标致
  },
  openToast: function() {
    wx.showToast({
      title: '技师正在休息',
      icon: 'loading',
      duration: 1000
    });
  },
  navigateTo: function(e) {
    var that = this;
    if (!that.data.rootshow) {
      that.setData({
        showModalStatus: true
      });
      return 0;
    }
    app.navigateTo(e);
  },


  // 团购列表
  cod: function() {
    wx.navigateTo({
      url: "../commodity_list/commodity_list",
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var that = this;

    that.isClearData();

    that.setData({
      shopid: 0
    });
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    var s1 = options.scene;
    var scene = null;
    if (typeof(s1) != "undefined") {
      scene = decodeURIComponent(s1);
    }
    //  scene = "36"
    if (null != scene && "" != scene) {
      that.setData({
        shopid: scene
      });
    }
    //  分享链接后获取参数
    if (typeof(options.shopID) != "undefined") {
      that.setData({
        shopid: options.shopID
      });
      wx.setStorageSync("shopid", options.shopID);
    }

    //检测用户身份
    this.checkUserInfo();
  },

  //显示广告
  guangGaoshow: function() {
    this.setData({
      guanggaoshow: true
    });
  },

  // 链接预约页
  make: function(e) {
    wx.navigateTo({
      url: "../details/details?guyuanId=" + e.currentTarget.dataset.id,
    })
  },

  // 跳转到地图，带上经纬度和位置信息
  goToMap: function() {
    if (null != this.data.shopinfo) {
      var address = this.data.shopinfo.province + "" + this.data.shopinfo.city + "" + this.data.shopinfo.area + this.data.shopinfo.address;
      if (null != address && "" != address) {
        wx.navigateTo({
          url: "../mp/mp?latitude=" + this.data.shopinfo.latitude + "&longitude=" + this.data.shopinfo.longitude + "&address=" + address + "&shopName=" + this.data.shopinfo.shopName
        })
      }
    }
  },

  // 拨打电话
  call: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.shopinfo.shopPhone
    })
  },
  isClearData: function() {
    comm.requestPost("/service/account/isClearData.do", {
      code: "1"
    }, function(res) {
      console.log(res)
      if (res.data.result == 200) {
        var data = res.data.data;
        if (data == 1) {
          wx.setStorageSync('openId', "");
          wx.setStorageSync('userToken', "");
          console.log("clear data")
        }
      }
    });
  },

  //获取商铺信息
  getShopinfo: function() {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var shopid = that.data.shopid;

    var data = {
      token: wx.getStorageSync("userToken"),
      shopID: shopid
    };
    comm.requestPost("/service/customer/main.do", data, function(res) {
      console.log(res)
      if (null != res.data.data && null != res.data.data.shop) {
        that.setData({
          advertisings: res.data.data.shop.advertisings
        });
      }
      if (null != res.data.data && null != res.data.data.userDTOS) {
        that.setData({
          userDTOS: res.data.data.userDTOS
        });
      }
      if (null != res.data.data && null != res.data.data.shop && res.data.data.shop.id > 0) {
        that.setData({
          shopinfo: res.data.data.shop
        });
        // 增加店铺关注度
        var data1 = {
          shopID: res.data.data.shop.id
        };
        comm.requestPost("/service/employer/addAttentionNum.do", data1, function(res) {}, function(res) {

        });
      }
      wx.hideLoading()
    }, function(res) {
      wx.hideLoading()
      wx.showToast({
        title: '加载失败',
        icon: 'none',
        duration: 2000
      })
    });
  },

  updateInfo: function() {
    //  首次注册，上传头像，昵称
    var userToken = wx.getStorageSync("userToken");
    comm.requestPost("/service/account/getUserInfo.do", {
      token: userToken
    }, function(res) {
      if (null == res.data.data.head || "" == res.data.data.head || null == res.data.data.nickName || "" == res.data.data.nickName) {
        // 查看是否授权
        wx.getSetting({
          success: function(res) {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
              wx.getUserInfo({
                success: function(res) {
                  var nickName = res.userInfo.nickName;
                  var head = res.userInfo.avatarUrl;
                  var data3 = {
                    head: head,
                    nickName: nickName,
                    token: userToken
                  }
                  comm.requestPost("/service/customer/updateUserInfo.do", data3, function(res) {

                  }, function(res) {
                    console.log(res);
                  });
                }
              })
            }
          }
        })
      }
    }, function(res) {
      console.log(res);
    });
  },

  //关闭授权窗口
  bindGetUserInfo: function(e) {
    this.setData({
      showModalStatus: false
    })
  },

  //检测用户是否用户信息授权
  checkUserInfo: function() {
    console.log("asd");
    var that = this;
    wx.getSetting({
      success: function(res) {
        if (!res.authSetting['scope.userInfo']) {
          that.setData({
            rootshow: false,
            showModalStatus: true
          });
        } else {
          that.setData({
            rootshow: true,
          });
          that.checkUser();
        }
      }
    })
  },

  // 点击授权按钮的回调
  getUserInfo: function(e) {
    console.log(e)
    var that = this;
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      rootshow: true,
      showModalStatus: false
    });
    that.checkUser();
  },

  /**
   * 存储用户信息
   */
  checkUser: function() {
    var that = this;
    //  customer
    //  wx.setStorageSync('userToken', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoie1wiaWRcIjozMTQsXCJleHBcIjoxNTM2Mzc2NDk5NzEwfSJ9.tqQ_um3T3Nye7mxFwNHAnfoD6xt-mohI2tS4Y3EcrHQ");
    //  customer(雇员)
    //  wx.setStorageSync('userToken', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoie1wiaWRcIjo3NSxcImV4cFwiOjE1MzYzNjA5MTc5MDJ9In0.WuCbb1uS5M4U3gtxVihN7PUXsPIh4O8xR69O3G68LlY");
    //  employer 18428326554
    //  wx.setStorageSync('userToken', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoie1wiaWRcIjo0MyxcImV4cFwiOjE1MzY0NTM0MzI2NzN9In0.F6biL4UMUNdxhnD_XXErzzTTandEYCkw_-cFEhwF89Q");

    var userToken = wx.getStorageSync("userToken");
    if (typeof(userToken) == "undefined" || typeof(userToken) == "undefined" || userToken == null || userToken == "") {
      wx.login({
        success: function(res) {
          if (res.code) {
            var usercode = res.code;
            comm.requestPost("/service/customer/getOpenID.do", {
              code: usercode
            }, function(res) {
              if (res.data.result == 200) {
                var userToken = res.data.data.token;
                var openId = res.data.data.openId;
                var privilege = res.data.data.privilege;
                wx.setStorageSync("usershuxing", privilege);
                wx.setStorageSync("userToken", userToken);
                wx.setStorageSync("openId", openId);
                that.getShopinfo();
                that.updateInfo();
              } else {
                wx.showModal({
                  title: res.data.msg,
                  content: '是否重新链接',
                  confirmText: "确认",
                  cancelText: "取消",
                  success: function(res) {
                    if (res.confirm) {
                      that.checkUserInfo();
                    } else {
                      wx.showToast({
                        title: '加载失败',
                        icon: 'none',
                        duration: 2000
                      })
                    }
                  }
                });
              }
            });
          } else {
            console.log("获取信息失败");
          }
        }
      })

    } else {
      that.getShopinfo();
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
    //检测用户身份
    this.checkUserInfo();
    wx.stopPullDownRefresh();
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
    if (null != this.data.shopinfo) {
      return {
        title: '时间很贵请别浪费约吧！',
        path: 'pages/index/index?shopID=' + this.data.shopinfo.id
      }
    } else {
      return {
        title: '时间很贵请别浪费约吧！',
        path: 'pages/index/index'
      }
    }
  },
  formSubmit: function(e) {
    var data = {
      formId: e.detail.formId,
      token: wx.getStorageSync("userToken")
    }
    comm.requestPost("/service/account/saveFormId.do", data, function(res) {

    });
  }
})