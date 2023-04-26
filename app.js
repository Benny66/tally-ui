// app.js
App({
  onLaunch() {
    this.getMenuRect()
  },
  globalData: {
    // api_base_url: 'http://127.0.0.1:8080', // 开发环境
    api_base_url: 'http://xxx', // 生产环境
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
            if (res.code === 200) {
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
    wx.request({
      url: _this.globalData.api_base_url + url,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': wx.getStorageSync('token') || ''
      },
      method: 'POST',
      data: data,
      success(res) {
        if (res.statusCode === 401) {
          // 登录失效
          wx.reLaunch({
            url: "/pages/views/login"
          });
          return false
        }
        if (res.statusCode !== 200) {
          _this.appShowError(res.data.message, () => {
            fail && fail(res);
          });
          return false;
        }
        success && success(res.data);
      },
      fail(res) {
        _this.appShowError(res.errMsg, () => {
          fail && fail(res);
        });
      },
      complete(res) {
        wx.hideNavigationBarLoading();
        wx.hideLoading();
        complete && complete(res);
      }
    });
  },






})