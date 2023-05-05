// app.js
App({
  onLaunch() {
    wx.cloud.init()
    this.getMenuRect()
  },
  globalData: {
    // api_base_url: 'http://127.0.0.1:8080', // 开发环境
    api_base_url: 'http://36.138.174.50:8999', // 生产环境
    menuRect: {}
  },
  // 获取导航信息
  getMenuRect() {
    const info = wx.getMenuButtonBoundingClientRect()
    const winodwConfig = wx.getWindowInfo()
    info.borderWidth = winodwConfig.windowWidth - info.right
    this.globalData.menuRect = info
  },
  // 显示失败提示框
  appShowError(msg, callback) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
      success(res) {
        callback && callback();
      }
    });
  },
  // app 静默登陆
  appSetLogin() {
    const _this = this
    wx.login({
      success(res) {
        if (res.code) {
          _this.ajaxPost('/api/auth-login', {
            code: res.code,
          }, (res) => {
            if (res.code === 0) {
              wx.setStorageSync('token', res.data.token)
              wx.reLaunch({
                url: "/pages/tally/index"
              });
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  // post请求
  ajaxPost(url, data, success, fail, complete) {
    const _this = this;
    // 请求动画
    wx.showNavigationBarLoading();
    wx.showLoading({
      mask: true,
      title: '正在请求...',
    })
    console.log(url)
    try{
      wx.cloud.callContainer({
        config: {
          env: 'prod-8gi0kygd3fa432da', // 微信云托管的环境ID
        },
        path: url, // 填入业务自定义路径和参数，根目录，就是 / 
        method: 'POST', // 按照自己的业务开发，选择对应的方法
        data:data,
        header: {
          'X-WX-SERVICE': 'golang-5wtd', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
          // 其他header参数
          'content-type': 'application/x-www-form-urlencoded',
          'token': wx.getStorageSync('token') || '',
        }
        // dataType:'text', // 默认不填是以JSON形式解析返回结果，若不想让SDK自己解析，可以填text
        // 其余参数同 wx.request
      }).then(res=>{
        console.log(res)
        if (res.statusCode === 401) {
          // 登录失效
          wx.reLaunch({
            url: "/pages/views/login"
          });
          return false
        }
        if (res.statusCode !== 200) {
          console.log(res.data)
          _this.appShowError(res.data.message, () => {
            fail && fail(res.data);
    complete && complete(res);

          });
          return false;
        }
        success && success(res.data);
      complete && complete(res);

      });
    } catch(e) {
      console.log(e)
    };
    wx.hideNavigationBarLoading();
    wx.hideLoading();
    // complete && complete(res);
    // wx.request({
    //   url: _this.globalData.api_base_url + url,
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded',
    //     'token': wx.getStorageSync('token') || ''
    //   },
    //   method: 'POST',
    //   data: data,
    //   success(res) {
    //     if (res.statusCode === 401) {
    //       // 登录失效
    //       wx.reLaunch({
    //         url: "/pages/views/login"
    //       });
    //       return false
    //     }
    //     if (res.statusCode !== 200) {
    //       _this.appShowError(res.data.message, () => {
    //         fail && fail(res);
    //       });
    //       return false;
    //     }
    //     success && success(res.data);
    //   },
    //   fail(res) {
    //     _this.appShowError(res.errMsg, () => {
    //       fail && fail(res);
    //     });
    //   },
    //   complete(res) {
    //     wx.hideNavigationBarLoading();
    //     wx.hideLoading();
    //     complete && complete(res);
    //   }
    // });
  },






})