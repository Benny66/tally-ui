// pages/user/index.js
const app = getApp()
import { formatTime, toThousands, formatTimeTwo } from '../../utils/util' 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuRect: app.globalData.menuRect,
    url: app.globalData.api_base_url,
    info: {},
    tallyTotal: {},
    books: [],
    bookInfo: {},
    formTj: {
      book_id: '',
      date: '',
      date_lebal: '',
      date_year_lebal: '',
    },
    tongji: {

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ['formTj.date']: formatTimeTwo(formatTime(new Date()), 'Y-M-D'),
      ['formTj.date_year_lebal']: formatTimeTwo(formatTime(new Date()), 'Y'),
      ['formTj.date_lebal']: formatTimeTwo(formatTime(new Date()), 'M月份'),
    })

    this.books()
    // this.getInfo()
    this.getTallyTotal()
    this.getTallyTotalTime()

  },
  books() {
    app.ajaxPost('/api/get-user-book', {}, (res)=>{
      if(res.code === 200){
        this.setData({
          books: res.data,
        })
      }
    })
  },
  bindPickerChange(e) {
    const books = this.data.books
    const index = e.detail.value
    this.setData({
      bookInfo: books[index],
      ['formTj.book_id']: books[index]['id']
    })
    this.getTallyTotalTime()

  },
  bindPickerChangeDate(e) {
    this.setData({
      ['formTj.date_lebal']: formatTimeTwo(e.detail.value, 'M月份'),
      ['formTj.date_year_lebal']: formatTimeTwo(e.detail.value, 'Y'),
      ['formTj.date']: e.detail.value
    })
    this.getTallyTotalTime()

  },

  getTallyTotal() {

    app.ajaxPost('/api/get-tally-main-total', {

    }, (res)=>{
      if(res.code === 200){

        res.data.disregard = toThousands(res.data.disregard)
        res.data.expend = toThousands(res.data.expend)
        res.data.income = toThousands(res.data.income)
        console.log(res.data, 89)
        this.setData({
          tallyTotal: res.data
        })
      }
    })

  },
// 指定时间账本查询
  getTallyTotalTime() {
    const obj = this.data.formTj
    console.log(obj, 990)
    let query = {}
    if(obj.date){
      query.book_id = obj.book_id
      query.date = obj.date

      app.ajaxPost('/api/get-tally-main-total', obj, (res)=>{
        if(res.code === 200){
          this.setData({
            tongji: {
              disregard: toThousands(res.data.disregard),
              expend: toThousands(res.data.expend),
              income: toThousands(res.data.income),
            }
          })
  

        }
      })

    }


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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        // 唯一标识（其它设置不同的整数）  
        selected: 2
      })
    }
    this.getInfo()
  },
  // 添加账本
  setUrlAddBooks() {
    wx.navigateTo({
      url: '/pages/views/add_books',
    })
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
    this.setData({
      ['formTj.date']: formatTimeTwo(formatTime(new Date()), 'Y-M-D'),
      ['formTj.date_year_lebal']: formatTimeTwo(formatTime(new Date()), 'Y'),
      ['formTj.date_lebal']: formatTimeTwo(formatTime(new Date()), 'M月份'),
    })

    this.books()
    this.getInfo()
    this.getTallyTotal()

    setTimeout(()=>{
      wx.stopPullDownRefresh();
    }, 1000)
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

  },
  setLoan() {
    console.log(1111)
    wx.navigateTo({
      url: '/pages/loan/index',
    })
  }
})