// pages/views/user_setting.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfo()
  },
  setInpt(e) {
    let key = e.currentTarget.dataset.key
    let value = e.detail.value
    let str = `info.${key}`
    this.setData({
      [str]: value
    })
    console.log(e)
  },
  setUpdateInfo() {
    
    app.ajaxPost('/api/set-user-info', this.data.info, (res)=>{
      if(res.code === 200){
        wx.showToast({
          title: '更新成功',
        })
        this.getInfo();
        // 成功保存数据后设置计时器
        setTimeout(function() {
          wx.navigateBack({
            delta: 1 // 返回上一层页面
          })
        }, 1000); // 3秒后返回上一层页面
        // setTimeout(()=>{
        //   this.getInfo()
        // }, 500)
      }
    })
  },
  getInfo() {
    
    app.ajaxPost('/api/get-user-info', {}, (res)=>{
      if(res.code === 200){
        this.setData({
          info: res.data
        })
      }
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
        ['info.avatar_url']: avatarUrl
    });
  },
  upimg() {
    const _this = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0]

        wx.uploadFile({
          url: getApp().globalData.api_base_url+'/api/upload-file', //接受图片的接口地址
          header: {
            chartset: "utf-8",
            "content-type": "multipart/form-data"
          },
          filePath: tempFilePaths,
          name: 'file',
          success (res){
              console.log(res);
              const data = JSON.parse(res.data)
              _this.setData({
                ['info.avatar_url']: data.data
              })

              // //do something
          }
      })



      }
    })
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

  }
})