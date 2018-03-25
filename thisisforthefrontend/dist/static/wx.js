(function() {  
  var JSSDK_URL = "http://res.wx.qq.com/open/js/jweixin-1.2.0.js";  
  var _getParameter = function(param) {  
      var reg = new RegExp('[&,?]' + param + '=([^\\&]*)', 'i');  
      var value = reg.exec(location.search);  
      return value ? value[1] : '';  
  };  
    
  var WXCFG = {  
      appId: 'wx747b4382d2847b0e',  
      weappNo: 'XX',  
      openid: 'xxxxxxxxxxxxxxxxxxxx',  
      ucp_uri: 'https://www.abc.com/it-pir/'  
  };  
  var loadscript = function(url, callback) {  
      var script = document.createElement('script');  
      script.type = 'text/javascript';  
      if (callback)  
          script.onload = script.onreadystatechange = function() {  
              if (script.readyState && script.readyState != 'loaded' && script.readyState != 'complete')  
                  return;  
              script.onreadystatechange = script.onload = null;  
              callback();  
          };  
      script.src = url;  
      document.getElementsByTagName('head')[0].appendChild(script);  
  };  
  var _ts = new Date().getTime();  
  var _url = WXCFG.ucp_uri + "/getSignature?weappNo=" + WXCFG.weappNo + "&openid=" + WXCFG.openid + "&callback=ucp_callback" + _ts;  
  var _signature;  
  window['ucp_callback' + _ts] = function(data) {  
      _signature = JSON.parse(data);  
  }  
  var jssdk_ready = false,  
      ucp_sign_ready = false;  

  var _wx;  
  var _init_wx = function(callback, debug) {  
      // 注入微信参数  
      var wx_config = {  
          debug: !!debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。  
          appId: WXCFG.appId, // 公众号的唯一标识  
          timestamp: _signature.timestamp, // 必填，生成签名的时间戳  
          nonceStr: _signature.nonce, // 必填，生成签名的随机串  
          signature: _signature.signature, // 必填，签名，见附录1  
          jsApiList: window.WXSDK.config.jsApiList || [ // 必填，需要使用的JS接口列表，所有JS接口列表见附录2  
              'onMenuShareTimeline',  
              'onMenuShareAppMessage',  
              'hideOptionMenu',  
              'showOptionMenu',  
              'hideOptionMenu',  
              'hideMenuItems',  
              'showMenuItems',  
              'hideAllNonBaseMenuItem',  
              'showAllNonBaseMenuItem'  
          ]  
      };  

      // 通过config接口注入权限验证配置  
      wx.config(wx_config);  

      // 通过error接口处理失败验证  
      wx.error(function(res) {  
          if (debug) {  
              alert('JSSDK接口处理失败验证 ', JSON.parse(res));  
          }  
      });  

      // 通过ready接口处理成功验证的回调  
      wx.ready(function() {  
          _wx = wx;  
          callback & callback();  
      });  
  };  

  // // 分享到朋友圈  
  // wx.onMenuShareTimeline({  
  //     title: '过来，有个1000万上下的游戏跟你玩一下~',  
  //     link: linkUrl,  
  //     imgUrl: APP.config.CDN + '/assets/img/tiger/share.jpg',  
  //     success: function() {},  
  //     cancel: function() {}  
  // });  

  // // 分享给朋友  
  // wx.onMenuShareAppMessage({  
  //     title: '过来，有个1000万上下的游戏跟你玩一下~',  
  //     desc: '过来，有个1000万上下的游戏跟你玩一下~',  
  //     link: linkUrl,  
  //     imgUrl: APP.config.CDN + '/assets/img/tiger/share.jpg',  
  //     success: function() {},  
  //     cancel: function() {}  
  // });  
  window.WXSDK = {  
      config: {  
          jsApiList: [ // 必填，需要使用的JS接口列表，所有JS接口列表见附录2  
              'onMenuShareTimeline',  
              'onMenuShareAppMessage',  
              'hideOptionMenu',  
              'showOptionMenu',  
              'hideOptionMenu',  
              'hideMenuItems',  
              'showMenuItems',  
              'hideAllNonBaseMenuItem',  
              'showAllNonBaseMenuItem'  
          ]  
      },  
      init: function(data, callback, debug) {  
          callback = callback || function() {}  
          debug = debug || _getParameter("wx_debug") == "true";  
          try {  
              if (debug) console.log("初始化数据", data);  
              var cb = function() {  
                  if (data) {  
                      _wx.onMenuShareTimeline(data);  
                      _wx.onMenuShareAppMessage(data);  
                      callback & callback(_wx);  
                  } else {  
                      callback & callback(_wx);  
                  }  
              }  
              if (!_wx) {  
                  var _ready = function() {  
                      if (debug) console.log("都准备好了");  
                      _init_wx(function() {  
                          cb();  
                      }, debug);  
                  }  
                  loadscript(_url, function() {  
                      if (debug) console.log("获取UCP签名成功", _signature);  
                      ucp_sign_ready = true;  
                      if (jssdk_ready && ucp_sign_ready) {  
                          _ready();  
                      }  
                  });  
                  loadscript(JSSDK_URL, function() {  
                      jssdk_ready = true;  
                      if (debug) console.log("JSSDK加载成功");  
                      if (jssdk_ready && ucp_sign_ready) {  
                          _ready();  
                      }  
                  });  
              } else {  
                  cb();  
              }  
          } catch (e) {  
              if (debug) console.log(e);  
              callback & callback();  
          }  
      }  
  };  
})();  