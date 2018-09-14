var comm = require('../../utils/comm.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
   data: {
    info: [],       //雇员信息
    projects: [],   //雇员老板的项目信息
    date: '2016-09-01',
    selectPerson: true,
    firstPerson: '请选择行业',
    selectArea: false,
    arr: [],        //店主的所有项目
    projectId:[],   //项目名
  },
  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function(options) {
    this.gettechninfo();
    // this.getwayprocet();

     // 该页面不允许分享
     wx.hideShareMenu();
   },

  //提交雇员的信息
  formSubmit:function(e){
    wx.showLoading({
      title: '提交中',
      mask: true
    })
    var that = this;
    var pcjid = [];
    var money = [];

    var data = {
      token: wx.getStorageSync("userToken"),
      message: e.detail.value.tokentips,
      type: that.data.clicktype,
      // projectId: pcjid,
      // projectPrice: money,
      "user.name": e.detail.value.name,
      "user.position": e.detail.value.zhiwei,
      "employerPhone": e.detail.value.dzshouji,
      // "user.password": e.detail.value.mima,
      "user.workingTime": e.detail.value.nianfen,
      "user.skills": e.detail.value.shangchang,
      "user.introduce": e.detail.value.jianjie,
      "user.phone": e.detail.value.phone
    };
    var password = e.detail.value.mima;
    if(null != password && "" != password) {
      data["user.password"] =  password;
    }
    // 构建ProjectID和price
    for (var i in that.data.projects) {
      data["projectEmployees[" + i+"].projectId"] = that.data.projects[i].project.id;
      data["projectEmployees[" + i + "].projectPrice"] = e.detail.value[that.data.projects[i].project.id];
    }
    comm.requestPost("/service/employee/updateEmployeeInfo.do",data,function(res){
      wx.hideLoading();
      if(res.data.result == 200){
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
          duration: 1000,
          mask: true
        });
      }

    },function(res){
      wx.hideLoading();
    });
  },

  //获取雇员的信息
  gettechninfo(){
    var that = this;
    var data = {
      token: wx.getStorageSync("userToken"),
    };
    comm.requestPost("/service/employee/viewEmployeeInfo.do",data,function(res){
      console.log(res)
      if(res.data.result == 200){
        that.setData({
          info: res.data.data.user,
          employerPhone: res.data.data.employerPhone,
          projects: res.data.data.projectEmployees,
        });

        if(res.data.data.business == null) {
          that.setData({
            business: "店主尚未设置行业"
          });
        } else {
          that.setData({
            business: res.data.data.business
          });
        }
      }
    },function(res){
      console.log(res);
      console.log("获取失败");
    });
  },

  //获取所有项目
  getwayprocet:function(){
    var that = this;
    var data = {
      token: wx.getStorageSync("userToken"),
    }
    comm.requestPost("/service/employer/viewProjects.do",data,function(res){
      console.log(res);
      if(res.data.result == 200){
        that.setData({
          arr: res.data.data
        });
      }
    },function(res){
      console.log(res);
      console.log("操作失败");
    });
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