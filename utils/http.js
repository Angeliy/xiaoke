import {config} from '../config.js';
const tips = {
  1 : '抱歉，可能是网络出现了一个错误',
  1005 : 'appkey申请无效',
  3000 : '点赞出错了'
}
class HTTP {
  //发送http请求
  request(parmas) {
    //接受三个参数 url method data
    if(!parmas.method) {
      parmas.method = "GET";
    }
    wx.request({
      url: config.api_base_url + parmas.url,
      method:parmas.method,
      data:parmas.data,
      header:{
        'content-type':'application/json',
        'appkey':config.appkey
      },
      success:(res)=>{
    //console.log( typeof(res.statusCode )); //数字类型
        let code = res.statusCode.toString();
        if(code.startsWith('2')) {
          if(parmas.success) {
            parmas.success(res.data);
          }
          
        } else {
          //错误处理
          let error_code = res.data.error_code;
          this._show_error(error_code);
           
        }
      },
      //一般指网络错误
      fail:(err)=>{
        // wx.showToast({
        //   title: '网络出错了',
        //   icon:'none',
        //   duration:4000
        // })
        this._show_error(1);
      }


    })
  }
  //错误处理
  _show_error(error_code) {
    if(!error_code) {
      error_code = 1
    }
    wx.showToast({
      title: tips[error_code],
      icon:'none',
      duration : 3000
    })
  }
}
export {HTTP};