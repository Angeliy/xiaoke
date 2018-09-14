  var comm = require('../../utils/comm.js');
  var app = getApp();
  Page({

    /**
     * 页面的初始数据
     */
     data: {
      // 数据
      arr: [],
      delBtnWidth: 134, //删除按钮宽度单位（rpx
      inputTxt: "",
      showModalStatus: false
    },
    /**
     * 生命周期函数--监听页面加载
     */
     onLoad: function(options) {
      this.getwayprocet();
       // 该页面不允许分享
       wx.hideShareMenu();
    },
     //获取所有员工
     getwayprocet:function(){
      var that = this;
      var data = {
        token: wx.getStorageSync("userToken"),
      }
      comm.requestPost("/service/employer/viewOwnEmployee.do",data,function(res){
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

    //添加员工
    formSubmit:function(e){
      var that = this;
      var data = {
        token: wx.getStorageSync("userToken"),
        employeePhone: e.detail.value.employeePhone,
      }
      comm.requestPost("/service/employer/addEmployeePhone.do",data,function(res){
        if(res.data.result == 200){
          wx.showToast({
            title: '添加成功',
            icon: 'succes',
            duration: 1000,
            mask:true
          });
          that.getwayprocet();
        }else{
          wx.showModal({
            title: res.data.msg,
            confirmColor: '#1da1f2',
          })
        }
        that.setData({
          showModalStatus: false,
          inputTxt: ""
        });
      },function(res){
        console.log(res);
        console.log("操作失败");
        that.setData({
          showModalStatus: false
        });
      });
    },
    // 滚动到底部
    lower: function() {
      console.log("我到了底部")
    },
    //删除
    delete_btn: function(e) {
      var that = this;
      var index = e.currentTarget.dataset.index;
      console.log(index);
      var data = {
        token: wx.getStorageSync("userToken"),
        employeeID: index
      }
      wx.showModal({
        //title: '提示',
        content: '确定删除吗？',
        confirmColor: '#1da1f2',
        success: function(res) {
          if (res.confirm) {
            comm.requestPost("/service/employer/removeEmployee.do",data,function(res){
              if(res.data.result == 200){
                that.getwayprocet();
              }
            },function(res){
              console.log(res);
              console.log("操作失败");
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    //手指刚放到屏幕触发
    touchS: function(e) {
      // console.log(e);
      //判断是否只有一个触摸点
      if (e.touches.length == 1) {
        this.setData({
          //记录触摸起始位置的X坐标
          startX: e.touches[0].clientX
        });
      }
    },
    //触摸时触发，手指在屏幕上每移动一次，触发一次
    touchM: function(e) {
      // console.log(e);
      var that = this
      if (e.touches.length == 1) {
        //记录触摸点位置的X坐标
        var moveX = e.touches[0].clientX;
        //计算手指起始点的X坐标与当前触摸点的X坐标的差值
        var disX = that.data.startX - moveX;
        //delBtnWidth 为右侧按钮区域的宽度
        var delBtnWidth = that.data.delBtnWidth;
        var txtStyle = "";
        if (disX == 0 || disX < 0) { //如果移动距离小于等于0，文本层位置不变
          txtStyle = "left:0rpx";
        } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离
          txtStyle = "left:-" + disX + "rpx";
          if (disX >= delBtnWidth) {
            //控制手指移动距离最大值为删除按钮的宽度
            txtStyle = "left:-" + delBtnWidth + "rpx";
          }
        }
        //获取手指触摸的是哪一个item
        var index = e.currentTarget.dataset.index;
        var list = that.data.arr;
        //将拼接好的样式设置到当前item中
        list[index].txtStyle = txtStyle;
        //更新列表的状态
        this.setData({
          arr: list
        });
      }
    },
    touchE: function(e) {
      // console.log(e);
      var that = this
      if (e.changedTouches.length == 1) {
        //手指移动结束后触摸点位置的X坐标
        var endX = e.changedTouches[0].clientX;
        //触摸开始与结束，手指移动的距离
        var disX = that.data.startX - endX;
        var delBtnWidth = that.data.delBtnWidth;
        //如果距离小于删除按钮的1/2，不显示删除按钮
        var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "rpx" : "left:0rpx";
        //获取手指触摸的是哪一项
        var index = e.currentTarget.dataset.index;
        var list = that.data.arr;
        list[index].txtStyle = txtStyle;
        //更新列表的状态
        that.setData({
          arr: list
        });
      }
    },

    // 添加员工弹窗动画
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