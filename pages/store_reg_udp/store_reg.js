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
    tempfiles:[],               //存放存在在服务器的图片文件
    oneurl: "null",
    one: [],
    showModal: false,            //错误提示框
    shiabaitips:false,           //操作失败提示
    chaozuotips: "",            //操作提示
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
    shopinfo: [],                //店铺的详情信息
  },
  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function(options) {
    this.getshopinfo();
    // 该页面不允许分享
    wx.hideShareMenu();
    qqmapsdk = new QQMapWX({
      key: 'MOBBZ-GZC6O-NJAWA-SGKDN-LV3DJ-2JFVJ'
    });
  },


  //获取当前店铺的信息
  getshopinfo:function(){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this;
    var data = {
      token: wx.getStorageSync("userToken"),
    };
    comm.requestPost("/service/employer/viewShopInfo.do",data,function(res){
      if(res.data.result == 200){

        var shijian = res.data.data.shop.businessTime;
        if(null != shijian && "" != shijian) {
          var gang = shijian.indexOf("-");
          var date = shijian.substring(0, gang);
          var time = shijian.substring(gang + 1, shijian.length);
        }
        // null != shijian
        // var oneimg = new Array();
        // if(res.data.data.shop.businessLicense != null){
        //   var data = {
        //     id: 0,
        //     url: res.data.data.shop.businessLicense,
        //   };
        //   oneimg.push(data);
        // }
        that.setData({
          date: date,
          time: time,
          latitude: res.data.data.shop.latitude,
          longitude: res.data.data.shop.longitude,
          duliweizhi: '',
          sheng: res.data.data.shop.province,
          shi: res.data.data.shop.city,
          qu: res.data.data.shop.area,
          xiangxi: res.data.data.shop.address,
          files: res.data.data.shopImages,
          tempfiles: res.data.data.shopImages,
          // one: oneimg,
          shopinfo: res.data.data.shop
        });

        console.log(that.data.one);
      }
      wx.hideLoading();
    },function(res){
      wx.hideLoading();
      wx.showModal({
        title: "失败",
        confirmColor: '#1da1f2',
      })
      console.log("操作失败");
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
        if (res.authSetting['scope.userLocation'] != "undefined" && res.authSetting['scope.userLocation'] != true) {
          that.setData({
            showModalStatus:true
          });
          console.log(that.data.showModalStatus)
        } else if (res.authSetting['scope.userLocation'] == "undefined") {
        }
        else {
        }
      }
    });
  },

  //关闭失败提示
  hideshibai:function(){
    if(this.data.chaozuotips == "修改成功"){
      //没有返回键，跳转到添加项目
      wx.redirectTo({
        url:"../store_project/store_project"
      });
    }else{
      this.setData({
        shiabaitips:false
      })
    }
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

    wx.showLoading({
      title: '提交中',
      mask: true
    })

    //上传轮播图片
    var filesLong1 = that.data.files.length;
    console.log(that.data.files);
    if (filesLong1 <= 3 && !that.data.showModal) {
      for (var i = filesLong1 - 1; i >= 0; i--) {
        if (that.data.files != null) {
          that.uploadFileImag(i, 'banner');
        }
      }
    } else {
      that.setData({
        showModal: true
      });
      return 0;
    }
    //上传营业执照
    // console.log(that.data.one);
    // if(that.data.one != null && that.data.one!= ""){
    //   console.log("执照上传");
    //   var filesLong1 = that.data.one.length;
    //   var filetmp = that.data.one;
    //   that.uploadFileImag(0, 'licence');
    // } else {
    //   wx.showToast({
    //     title: '请选择营业执照',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return;
    // }

    //提交地址信息
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    console.log(that.data.sheng)
    console.log(that.data.xiangxi)



    var data = {
      token: wx.getStorageSync("userToken"),
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
      "shop.businessTime":  that.data.date+ "-" + that.data.time
    };
    var password = e.detail.value.mima;
    if (null != password && "" != password) {
      data["password"] = password;
    }

    comm.requestPost("/service/employer/updateShopInfo.do", data, function (res) {
      wx.hideLoading();
      if (res.data.msg == 'success') {
        wx.showModal({
          title: '修改成功',
          content: '是否跳转到首页',
          success: function (res) {
            if (res.confirm) {
              //点击确定 跳转首页
              wx.redirectTo({
                url: "../index/index"
              });
            }
            else{
              return 0;
            }
          }
        })
    } else {
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 2000
      })
    }

  }, function (res) {
    wx.hideLoading();
  });
  },

  // 上传轮播
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        for(var i = 0; i < res.tempFilePaths.length; i++){
          if(that.data.files.length > 2){
            break;
          }
          var data = {
            id: i,
            url: res.tempFilePaths[i],
          };
          that.data.files.push( data );
        }
        that.setData({
          files: that.data.files
        });
      }
    })
  },

  //阅览作品图片
  previewImage: function(e) {
    var that = this;
    var urllist = [];
    for(var i in that.data.files)
    {
      urllist.push( that.data.files[i].url );
    }
    wx.previewImage({
      current: urllist[e.target.dataset.id], // 当前显示图片的http链接
      urls: urllist  // 需要预览的图片http链接列表
    })
  },

  //预览营业执照
  // business: function (e) {
  //   var that = this;
  //   var urllist = [];
  //   for(var i in that.data.one)
  //   {
  //     urllist.push( that.data.one[i].url );
  //   }
  //   wx.previewImage({
  //     current: urllist[e.target.dataset.id], // 当前显示图片的http链接
  //     urls: urllist  // 需要预览的图片http链接列表
  //   })
  // },

  //上传营业执照
  // license: function (e) {
  //   var that = this;
  //   var oneimg = new Array();
  //   wx.chooseImage({
  //     sizeType: ['original', 'compressed'],
  //     sourceType: ['album', 'camera'],
  //     success: function (res) {
  //       var data = {
  //         id: 0,
  //         url: res.tempFilePaths[0],
  //       };
  //       oneimg.push(data);
  //       that.setData({
  //         one: oneimg
  //       });
  //       console.log(that.data.one);
  //     },
  //   })
  // },

  //上传图片到fwq
  uploadFileImag:function(nub, leixing){
    var that = this;
    if(leixing=='banner'){
      var img = that.data.files[nub].url;
      if(img.indexOf("http://image") != -1){
        return 0;
      }
    }else{
      var img = that.data.one[nub].url;
      if(img.indexOf("http://image") != -1){
        return 0;
      }
    }
    if(img != ""){
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
          var data=res.data;
        },
        fail: function(res){
          console.log('fail');
        },
      })
    }
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
    var images = that.data.files;
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          images.splice(index, 1);
          that.setData({
            files: images,
          });
          var data = {
            token: wx.getStorageSync("userToken"),
            bannerID: leixing
          };
          comm.requestPost("/service/employer/removeBanner.do",data,function(res){
            if(res.data.result == 200){
             wx.showToast({
              title: '操作成功',
              icon: 'succes',
              duration: 1000,
              mask:true
            })
           }
         },function(res){
          wx.showModal({
            title: res.data.msg,
            confirmColor: '#1da1f2',
          })
          console.log("操作失败");
        });
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
      }
    })
  },

  // 营业执照的图片
  // deleteImage1: function (e) {
  //   var that = this;
  //   var images = that.data.one;
  //   wx.showModal({
  //     title: '提示',
  //     content: '确定要删除此图片吗？',
  //     success: function (res) {
  //       if (res.confirm) {
  //         images.splice(0, 1);
  //         that.setData({
  //           one: images,
  //         });
  //         var data = {
  //           token: wx.getStorageSync("userToken"),
  //         };
  //         console.log(data);
  //         comm.requestPost("/service/employer/removebusinessLicense.do",data,function(res){
  //           if(res.data.result == 200){
  //            wx.showToast({
  //             title: '操作成功',
  //             icon: 'succes',
  //             duration: 1000,
  //             mask:true
  //           })
  //          }
  //        },function(res){
  //         wx.showModal({
  //           title: res.data.msg,
  //           confirmColor: '#1da1f2',
  //         })
  //         console.log("操作失败");
  //       });
  //       } else if (res.cancel) {
  //         console.log('点击取消了');
  //         return false;
  //       }
  //     }
  //   })
  // },

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