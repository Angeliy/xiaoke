var comm = require('../../utils/comm.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
   data: {
    files: [],
    // one: [],
    showModal: false,            //错误提示框
    shiabaitips:false,            //操作失败提示
    date: '9:00',
    time: '17:00',
    latitude: 0,
    longitude: 0,
    sheng: "",
    shi: "",
    qu: "",
    xiangxi: "",
    showModalStatus:false,      //地理位置信息提示框
    duliweizhi:"",
  },
  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function(options) {
    // 该页面不允许分享
    wx.hideShareMenu();
    qqmapsdk = new QQMapWX({
      key: 'MOBBZ-GZC6O-NJAWA-SGKDN-LV3DJ-2JFVJ'
    });
  },
  //关闭授权窗口
  bindGetUserInfo: function(e) {
    this.setData({
      showModalStatus:false
    });
  },
  // 进去的设置页面设置
  setadrr_btn:function()
  {
    var that = this;
    wx.getSetting(
    {
      success:function(res)
      {
        if(res.authSetting['scope.userLocation'])
        {
          wx.showToast(
          {
            title: '授权成功',
            icon: 'success',
            duration: 2000
          });
          that.bindGetUserInfo();
        }
        else
        {
          wx.showToast(
          {
            title: '未开启地理位置',
            icon: 'none',
            duration: 2000
          });
        }
      },
    });
  },

  //获取当前的地理位置
  getLocation:function(){
    var that = this;
    wx.getLocation({
      type: "wgs84",
      success:function(res){
        wx.chooseLocation({
          success: function (res) {
            qqmapsdk.geocoder({
              address: res.address,
              success: function (res) {
               var dizhi = res.result.title;
               var xiabiao = dizhi.indexOf("区");
               var xiangxi = dizhi.substring(xiabiao+1, dizhi.length);
               that.setData({
                sheng: res.result.address_components.province,
                shi: res.result.address_components.city,
                qu: res.result.address_components.district,
                xiangxi: xiangxi,
              });
             },
             fail: function (res) {
              console.log("获取失败")
            },
            complete: function (res) {
              console.log("获取结束")
            }
          });
            that.setData({
              latitude: res.latitude,
              longitude: res.longitude,
              duliweizhi: res.address,
            });
            console.log(that.data);
          },
          fail: function (err) {
            console.log(err)
          }
        });
      },
      fail:function(res){
        console.log("asd2"+res);
        that.huoqushoquan();
      }
    });
  },

  //获取当前的地理位置权限
  huoqushoquan:function(){
    var that = this;
    wx.getSetting({
      success: (res) => {
        console.log("asd1"+JSON.stringify(res))
        if (res.authSetting['scope.userLocation'] != "undefined" && res.authSetting['scope.userLocation'] != true) {
          that.setData({
            showModalStatus:true
          });
          console.log(that.data.showModalStatus)
        } else if (res.authSetting['scope.userLocation'] == "undefined") {
          //调用wx.getLocation的API
        }
        else {
          //调用wx.getLocation的API
        }
      }
    });
  },

  //关闭失败提示
  hideshibai:function(){
    this.setData({
      shiabaitips:false
    })
  },
  //关闭错误提示对话框
  hidetipsModal:function(){
    this.setData({
      showModal:false
    });
  },

  //表单提交
  formSubmit: function(e) {
    var that = this;
    var flag = false;
    console.log(that.data.files);
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    //上传轮播图片
    var filesLong1 = that.data.files.length;
    console.log(filesLong1);
    //上传营业执照图片
    // var oneLong2 = that.data.one.length;

    if (e.detail.value.dianming == null || "" == e.detail.value.dianming) {
      wx.showToast({
        title: '请填写店名',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    var addre = that.data.qu;
    if (addre == null || "" == addre) {
      wx.showToast({
        title: '请选择地址',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (e.detail.value.hangye == null || "" == e.detail.value.hangye) {
      wx.showToast({
        title: '请填写行业',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (e.detail.value.zhanghao == null || "" == e.detail.value.zhanghao) {
      wx.showToast({
        title: '请填写手机帐号',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (e.detail.value.mima == null || "" == e.detail.value.mima) {
      wx.showToast({
        title: '请填写密码',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    // if(0 == oneLong2) {
    //   wx.showToast({
    //     title: '请选择营业执照',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return;
    // }

    wx.showLoading({
      title: '提交中',
      mask:true
    })

    
    // if(oneLong2 <= 1 && !that.data.showModal){
    //   for(var i = oneLong2; i > 0; i--){
    //     that.uploadFileImag(i-1, 'licence');
    //   }
    // }else{
    //   that.setData({
    //     showModal: true
    //   });
    // }
    if(true){
      var data = {
        token: wx.getStorageSync("userToken"),
        password: e.detail.value.mima,
        "shop.shopName": e.detail.value.dianming,
        "shop.shopPhone": e.detail.value.dianhua,
        "shop.business": e.detail.value.hangye,
        "shop.phone": e.detail.value.zhanghao,
        "shop.province": that.data.sheng,
        "shop.city": that.data.shi,
        "shop.area": that.data.qu,
        "shop.address": that.data.xiangxi,
        "shop.longitude": that.data.longitude,
        "shop.latitude": that.data.latitude,
        "shop.businessTime": that.data.date+ "-" + that.data.time
      };
      comm.requestPost("/service/employer/updateShopInfo.do",data,function(res){
        wx.hideLoading();
        if(res.data.msg == 'success'){
          wx.setStorageSync("usershuxing", 3);
          

          // 基本资料上传成功后，上传图片
          if (filesLong1 <= 3 && !that.data.showModal) {
            for (var i = filesLong1; i > 0; i--) {
              that.uploadFileImag(i - 1, 'banner');
            }
          } else {
            that.setData({
              showModal: true
            });
          }

          wx.showToast({
            title: '注册成功',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
          //没有返回键，跳转到添加项目
          wx.redirectTo({
            url:"../store_project/store_project"
          });
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })

        }
      },function(res){
        wx.hideLoading();
        console.log(res);
      });
    }
  },

  // 上传轮播
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        var filestmp = that.data.files.concat(res.tempFilePaths).slice(0,3);
        that.setData({
          files: filestmp
        });
      }
    })
  },

  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  //上传营业执照
  license: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        that.setData({
          one: that.data.one.concat(res.tempFilePaths[0])
        });
      },
    })
  },

  //上传图片到fwq
  uploadFileImag:function(nub, leixing){
    wx.showLoading({
      title: '上传图片...',
      mask: true
    })
    var that = this;
    if(leixing=='licence'){
      var img = that.data.one[nub];
    }else{
      var img = that.data.files[nub];
    }
    wx.uploadFile({
      url: "https://safe.wyxke.com/xk_mini/service/employer/uploadShopFile.do",
      filePath: img,
      name: leixing,
      header: {
        "Content-Type": "multipart/form-data",
        'accept': 'application/json',
      },
      formData:{
        token: wx.getStorageSync("userToken"),
      },
      success: function(res){
        wx.hideLoading();
      },
      fail: function(res){
        wx.hideLoading();
      },
    })
  },

  business: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.one
    })
  },
  // 时间选择
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  // 长按删除图片
  deleteImage: function (e) {
    var that = this;
    var leixing = e.currentTarget.dataset.text; //获取当前长按图片下标
    var index = e.currentTarget.dataset.id; //获取当前长按图片下标
    if(leixing==1){
      var images = that.data.files;
    }else{
      var images = that.data.one;
    }
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          images.splice(index, 1);
          if(leixing==1){
            that.setData({
              files:images
            });
          }else{
            that.setData({
              one:images
            });
          }
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
        that.setData({
          images
        });
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