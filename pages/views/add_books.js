// pages/views/add_books.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book_id: '',
    bmw: 0,
    url: app.globalData.api_base_url,
    books: [],
    form: {
      name: '',
      sort: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.book_id) {
      this.setData({
        book_id: options.book_id
      })
    }
    this.books()
    this.bookInfo()
  },
  books() {
    app.ajaxPost('/api/get-user-book', {}, (res)=>{
      if(res.code === 0){
        let w = res.data.length * 193 + 228
        this.setData({
          bmw: w,
          books: res.data
        })
      }
    })
  },
  setTab(e) {
    let id = e.currentTarget.dataset.id
    this.setData({
      book_id: id
    })
    this.bookInfo()
  },
  // 获取账本详情
  bookInfo() {
    const id = this.data.book_id
    if(id){
      app.ajaxPost('/api/get-book-info', {id: this.data.book_id}, (res)=>{
        if(res.code === 0){
          this.setData({
            form: {
              name: res.data.name,
              sort: res.data.sort
            }
          })
        }
      })
    } else {
      this.setData({
        form: {
          name: '',
          sort: ''
        }
      })
    }
  },
  setInput(e) {
    let key = e.currentTarget.dataset.key
    let str = `form.${key}`
    this.setData({
      [str]: e.detail.value
    })
  },
  // 保存账本
  saveBook() {
    const form = this.data.form
    form.id = this.data.book_id
    if(!form.name){
      wx.showToast({
        icon: 'none',
        title: '请输入账本名称',
      })
      return false
    }
    app.ajaxPost('/api/set-book-edit',form, (res)=>{
      if(res.code === 0){
        wx.showToast({
          icon: 'none',
          title: '提交成功',
          duration: 1000,
          success: () =>{

          }
        })

        setTimeout(()=>{
          this.books()
          this.bookInfo()
        }, 1000)


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