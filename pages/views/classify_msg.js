// pages/views/classify_msg.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1,
    categorys: [],
    isShow: false,
    form: {
      id: '',
      name: '',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.categorys()
  },
  // 获取分类
  categorys() {
    
    app.ajaxPost('/api/get-category-list', {type: this.data.type}, (res)=>{
      if(res.code === 200){
        this.setData({
          categorys: res.data,
        })
      }
    })
  },
  setTab(e) {
    this.setData({
      type: e.currentTarget.dataset.key
    })
    this.categorys()
  },
  editItem(e) {
    console.log(e.currentTarget.dataset.item)
    let item = e.currentTarget.dataset.item
    if(item.user_id) {
      this.setData({
        ['form.id']: item.id,
        ['form.name']: item.name,
        isShow: true
      })
    }
    
  },
  addCf() {
    this.setData({
      ['form.id']: '',
      ['form.name']: '',
      isShow: true
    })
  },
  saveForm() {
    const obj = this.data.form
    obj.type = this.data.type
    if(!obj.name){
      wx.showToast({
        title: '你不输入标题，保存什么？',
      })
      return false
    }

    
    app.ajaxPost('/api/set-category-edit',obj, (res)=>{
      if(res.code === 200){
        this.categorys()
        this.setData({
          isShow: false
        })
      }
    })

    console.log(this.data.form)
  },
  sbnn(e) {
    this.setData({
      ['form.name']: e.detail.value
    })

  },
  onClose() {
    this.setData({
      isShow: false
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