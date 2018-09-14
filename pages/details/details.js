var dateTimePicker = require('../../utils/dateTimePicker.js');// 时间合成外部js
var comm = require('../../utils/comm.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
   data: {
    jishiid: 0,
    num: 5, //后端给的分数,显示相应的星星
    one_1: '',
    two_1: '',
    one_2: 0,
    two_2: 5,
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    checkboxItems: [],
    info: [],           //雇员的基础信息
    projects: [],       //雇员的项目信息
    works: [],          //雇员的作品信息
    guanzhudu: 0,       //关注度
    dingdanshu: 0,      //订单数
    showModalStatus: false,
    rootshow: false,            //是否授权的标致
    showshouji: 0,
    codeT:"",
    customerPhone:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function (options) {
    var that = this;

    if (typeof options.guyuanId == "undefined") {
      var shopid = wx.getStorageSync("shopid");
      wx.redirectTo({
        url: "../index/index?shopid=" + shopid,
      })
    } else {
      that.setData({
        jishiid: options.guyuanId
      });
    }
    // 星星加载
    this.setData({
      one_1: this.data.num,
      two_1: 0 - this.data.num
    })

    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();

    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    });

     //检测用户身份
     this.checkUserInfo();
   },

  //初始化checkboxItems数组
  inticheckboxItems: function () {
    var that = this;
    var list = that.data.projects;
    for (var i in list) {
      that.data.checkboxItems.push({ id: i.id, checked: 0 });
    }
    that.setData({
      checkboxItems: that.data.checkboxItems
    });
    console.log(that.data.checkboxItems);
  },

  //检测用户是否用户信息授权
  checkUserInfo: function () {
    var that = this;
    wx.getSetting({
      success: function (res) {
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
  getUserInfo: function (e) {
    console.log(e)
    var that = this;
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      rootshow: true,
      showModalStatus: false
    });
    that.checkUser();
  },
  //关闭授权窗口
  bindGetUserInfo: function (e) {
    this.setData({
      showModalStatus: false
    })
  },

 /**
   * 存储用户信息
   */
   checkUser:function(){
    var that = this;
    var userToken = wx.getStorageSync("userToken");
    if (typeof (userToken) == "undefined" || typeof (userToken) == "undefined" || userToken == null || userToken == "") {
      wx.login({
        success: function (res) {
          if (res.code) {
            var usercode = res.code;
            comm.requestPost("/service/customer/getOpenID.do", { code: usercode }, function (res) {
              if (res.data.result == 200) {
                var userToken = res.data.data.token;
                var openId = res.data.data.openId;
                var privilege = res.data.data.privilege;
                wx.setStorageSync("usershuxing", privilege);
                wx.setStorageSync("userToken", userToken);
                wx.setStorageSync("openId", openId);
                that.updateInfo();
                that.getguyuaninfo();
              } else {
                wx.showModal({
                  title: res.data.msg,
                  content: '是否重新链接',
                  confirmText: "确认",
                  cancelText: "取消",
                  success: function (res) {
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
    }else{
      that.getguyuaninfo();
    }
  },

  updateInfo: function () {
    //  首次注册，上传头像，昵称
    var userToken = wx.getStorageSync("userToken");
    comm.requestPost("/service/account/getUserInfo.do", { token: userToken }, function (res) {
      if (null == res.data.data.head || "" == res.data.data.head || null == res.data.data.nickName || "" == res.data.data.nickName) {
        // 查看是否授权
        wx.getSetting({
          success: function (res) {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
              wx.getUserInfo({
                success: function (res) {
                  var nickName = res.userInfo.nickName;
                  var head = res.userInfo.avatarUrl;
                  var data3 = {
                    head: head,
                    nickName: nickName,
                    token: userToken
                  }
                  comm.requestPost("/service/customer/updateUserInfo.do", data3, function (res) {
                  }, function (res) {
                    console.log(res);
                  });
                }
              })
            }
          }
        })
      }
    }, function (res) {
      console.log(res);
    });
  },

  //获取用户的手机号码
  getPhoneNumber: function (e) {//点击获取手机号码按钮
    var that = this;
    var ency = e.detail.encryptedData;    //密文
    var iv = e.detail.iv;                 //向量
    var dataphone = {
      encryptedData: ency,
      code: that.data.codeT,
      iv: iv,
      token: wx.getStorageSync("userToken"),
    };
    console.log(dataphone);
    if (e.detail.errMsg == 'getPhoneNumber:fail:cancel to confirm login') {
      wx.showToast({
        title: '授权取消',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    }
    else if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showToast({
        title: '授权失败',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    } else {
      //用户的手机号码后台已经保存了
      comm.requestPost("/service/account/decodeUserPhone.do", dataphone, function (res) {
        if(res.data.result == "200") {

          that.setData({
            customerPhone:res.data.data,
            showshouji:1
          })
          console.log("解密成功~~~~~~~~~~~~~");
          // that.order();
          console.log(res);
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000,
            mask: true
          })
        }
      }, function (res) {
      });
    }
  },

  //获取选中的样色
  xuanzhong: function (e) {
    var that = this;
    var asd = 0;
    var index = e.target.dataset.text;
    console.log(e);
    var list = that.data.checkboxItems;
    if (list[index].checked == 0) {
      list[index].checked = 1;
    } else {
      list[index].checked = 0;
    }
    that.setData({
      checkboxItems: list
    });
  },

  //用户提交订单
  order: function (e) {
    var that = this;
    wx.showModal({
      title: "方便与你联系 ",
      content: '用户手机：'+ that.data.customerPhone,
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          if(!that.data.rootshow){
            that.setData({
              showModalStatus:true
            });
            return 0;
          }
          var list = that.data.checkboxItems;
          //存储被选中的id
          var projectID = [];
          //获取被选中的下标
          var flag = 0;
          for (var i in list) {
            if (list[i].checked == 1) {
              flag = 1;
              projectID.push(that.data.projects[i].project.id);
            }
          }
          if(flag == 0) {
            wx.showToast({
              title: '请选择项目',
              icon: 'none',
              duration: 1000,
              mask: true
            })
            return;
          }
          var list1 = that.data.dateTimeArray1;
          var time = "";
          //获取time
          for (var i in list1) {
            if (i == 0) {
              time += list1[i][that.data.dateTime1[i]] + "-";
            } else if (i == 1) {
              time += list1[i][that.data.dateTime1[i]] + "-";
            } else if (i == 2) {
              time += list1[i][that.data.dateTime1[i]] + " ";
            } else if(i == 3) {
              time += list1[i][that.data.dateTime1[i]] +":";
            } else {
              time += list1[i][that.data.dateTime1[i]];
            }
          }
          var data = {
            token: wx.getStorageSync("userToken"),
            employeeID: that.data.jishiid,
            time: time,
            projectID: projectID,
            formId: e.detail.formId
          };
          comm.requestPost("/service/customer/bookOrder.do", data, function (res) {
            if (res.data.result == "200") {
              wx.showToast({
                title: '预约成功',
                icon: 'succes',
                duration: 2000,
                mask: true
              });
              //获取当前的用户类型 3店主 2技师 1用户
              var usershuxing = wx.getStorageSync("usershuxing");
              if(usershuxing == 3){
                wx.redirectTo({
                  url: 'page/store_line/store_line'
                });
              }else if(usershuxing == 2){
                wx.redirectTo({
                  url: 'page/technician_line/technician_line'
                });
              }else{
                wx.redirectTo({
                  url: 'page/customer_line/customer_line'
                });
              }
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000,
                mask: true
              })
            }
          }, function (res) {
            wx.showToast({
              title: '预约失败',
              icon: 'none',
              duration: 2000,
              mask: true
            })
          });
        } else {
          wx.showToast({
            title: '该预约取消',
            icon: 'none',
            duration: 2000
          });
          return 0;
        }
      }
    });
  },

  //获取雇员的信息
  getguyuaninfo() {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var data = {
      token: wx.getStorageSync("userToken"),
      id: that.data.jishiid
    };
    comm.requestPost("/service/customer/bookingOrderViewDetails.do", data, function (res) {
      if (res.data.result == "200") {
        // 将作品图片提取出来
        var worksT = [];
        var ii = 0;
        var flag = false;
        for (var i in res.data.data.works) {
          for (var j in res.data.data.works[i].workImages) {
            worksT.push(res.data.data.works[i].workImages[j].url)
            ii++;
            if(ii == 6) {
              flag = true;
              break;
            }
          }
          if(flag) {
            break;
          }
        }

        let customerPhone = res.data.data.customerPhone;
        if(null == customerPhone || "" == customerPhone) {
          customerPhone = 0;
          wx.login({
            success: function (res) {
              if (res.code) {
                that.setData({
                  codeT:res.code
                })
              } else {
                console.log("获取信息失败");
              }
            }
          })
        }

        that.setData({
          info: res.data.data.user,
          projects: res.data.data.projectEmployees,
          works: worksT,
          shopname: res.data.data.shopName,
          showshouji: customerPhone,
          customerPhone: customerPhone,
          guanzhudu: res.data.data.attentionNum,
          dingdanshu: res.data.data.orderNum,
          imgArr: worksT
        });
        that.inticheckboxItems();
      }
      wx.hideLoading();
    }, function (res) {
      wx.showToast({
        title: '加载失败',
        icon: 'none',
        duration: 2000
      })
      wx.hideLoading();
    });
  },

  opens: function () {
    wx.showToast({
      title: '预约成功',
      icon: 'succes',
      duration: 2000,
      mask: true
    })
  },

  // 点击图片查看图片组
  previewImg: function (e) {
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.imgArr;
    wx.previewImage({
      current: imgArr[index], //当前图片地址
      urls: imgArr, //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  // 复选框
  checkboxChange: function (e) {
    console.log(e);
    var checked = e.detail.value;
    var changed = {};
    for (var i = 0; i < this.data.checkboxItems.length; i++) {
      if (checked.indexOf(this.data.checkboxItems[i].name) !== -1) {
        changed['checkboxItems[' + i + '].checked'] = true
      } else {
        changed['checkboxItems[' + i + '].checked'] = false
      }
    }
    this.setData(changed)
  },

  // 时间选择器
  changeDate(e) {
    this.setData({
      date: e.detail.value
    });
  },
  changeTime(e) {
    this.setData({
      time: e.detail.value
    });
  },
  changeDateTime(e) {
    this.setData({
      dateTime: e.detail.value
    });
  },
  changeDateTime1(e) {
    this.setData({
      dateTime1: e.detail.value
    });
  },
  changeDateTimeColumn(e) {
    var arr = this.data.dateTime,
    dateArr = this.data.dateTimeArray;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr
    });
  },
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1,
    dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
  },

  //底部菜单栏跳转
  navigateTo: function (e) {
    var that = this;
    if(!that.data.rootshow){
      that.setData({
        showModalStatus: true
      });
      return 0;
    }
    app.navigateTo(e);
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
     return {
      title: '时间很贵请别浪费约吧！',
      path: 'pages/details/details?guyuanId=' + this.data.info.id
    }
  }
})