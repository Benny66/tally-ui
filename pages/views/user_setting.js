// pages/views/user_setting.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    sexes:[
      {
        "type":0,
        "name":"未知",
      },
      {
        "type":1,
        "name":"男",
      },
      {
        "type":2,
        "name":"女",
      },
    ]
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
      if(res.code === 0){
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
      if(res.code === 0){
        let userInfo = res.data
        userInfo.sex_desc = this.getSexInfo(userInfo.sex)
        this.setData({
          info: userInfo
        })
      }
    })
  },
  bindSex:function(e){
    const sexes = this.data.sexes
    const index = e.detail.value
    console.log(this.data.info)
    console.log(index)
    console.log(sexes[index])
    this.setData({
      ['info.sex_desc']: sexes[index].name,
      ['info.sex']: index,
    })
  },
  getSexInfo(sex){
    if(sex === 1) {
      return "男"
    }else if (sex === 2) {
      return "女"
    }
    return "未知"
  },
  onChooseAvatar(e) {
    const _this = this
    const { avatarUrl } = e.detail 
    // tempFilePath可以作为img标签的src属性显示图片
    // const tempFilePaths = res.tempFilePaths[0]
    wx.uploadFile({
      url: getApp().globalData.api_base_url+'/api/upload-file', //接受图片的接口地址
      header: {
        chartset: "utf-8",
        "content-type": "multipart/form-data"
      },
      filePath: avatarUrl,
      name: 'file',
      success (res){
          const data = JSON.parse(res.data)
          _this.setData({
            ['info.avatar_url']: data.data
          })

          // //do something
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