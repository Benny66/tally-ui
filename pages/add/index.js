// pages/add/index.js
const app = getApp()
import { formatTime, formatTimeTwo } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isTally: true,
    isRemark: false,
    books: [],
    categorys:[],
    bookInfo: {},
    form: {
      id: '',
      book_id: '',
      category_id: '',
      type: 1,
      money: '',
      name: '',
      desc: '',
      date: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    


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
        //唯一标识（其它设置不同的整数）  
        selected: 1
      })
    }


    this.setData({
      ['form.date']: formatTimeTwo(formatTime(new Date()), 'Y-M-D'),
      ['form.date_lebal']: formatTimeTwo(formatTime(new Date()), 'M月D日'),
    })
    this.books()
    this.categorys()

  },
  books() {
    app.ajaxPost('/api/get-user-book', {}, (res)=>{
      if(res.code === 0){
        var bookId = 0
        console.log(res.data.length)
        if (res.data.length > 0) {
          bookId = res.data[0]['id']
        }
        this.setData({
          books: res.data,
          bookInfo: res.data[0],
          ['form.book_id']: bookId,
        })
      }
    })
  },
  bindPickerChange(e) {
    const books = this.data.books
    const index = e.detail.value
    this.setData({
      bookInfo: books[index],
      ['form.book_id']: books[index]['id']
    })

  },
  bindPickerChangeDate(e) {
    this.setData({
      ['form.date']: e.detail.value,
      ['form.date_lebal']: formatTimeTwo(e.detail.value, 'M月D日'),
    })

  },
  setNav(e) {
    this.setData({
      ['form.type']: e.currentTarget.dataset.value
    })
    this.categorys()
  },
  // 获取分类
  categorys() {
    app.ajaxPost('/api/get-category-list', {type: this.data.form.type}, (res)=>{
      if(res.code === 0){
        var categoryId = 0
        if (res.data.length > 0) {
          const randomValue = res.data[0];
          categoryId = randomValue['id']
        }
        this.setData({
          categorys: res.data,
          ['form.category_id']: categoryId,
        })
      }
    })
  },
  setMoney(e) {
    this.setData({
      ['form.money']: e.detail.value
    })
  },
  setDesc(e) {
    this.setData({
      ['form.desc']: e.detail.value
    })
  },
  setName(e) {
    this.setData({
      ['form.name']: e.detail.value
    })
  },
  
  setcategory(e) {
    this.setData({
      ['form.category_id']: e.currentTarget.dataset.id
    })
  },
  tijiao() {
    const {book_id, date, category_id, name, money} = this.data.form
    let code = true
    if(!book_id){
      wx.showToast({
        icon: 'none',
        title: '请选择账本',
      })
      code = false
    }
    if(!date){
      wx.showToast({
        icon: 'none',
        title: '请选择日期',
      })
      code = false
    }
    if(!category_id){
      wx.showToast({
        icon: 'none',
        title: '请选择分类',
      })
      code = false
    }
    if(!name){
      wx.showToast({
        icon: 'none',
        title: '请输入名称',
      })
      code = false
    }
    if(!money){
      wx.showToast({
        icon: 'none',
        title: '请输入金额',
      })
      code = false
    }
    if(code) {
      // 提交
      
      app.ajaxPost('/api/set-tally-edit', this.data.form, (res)=>{
        if(res.code === 0){
          wx.showToast({
            icon: 'none',
            title: '添加成功',
          })
          this.setData({
            form: {
              id: '',
              book_id: '',
              category_id: '',
              type: 1,
              money: '',
              name: '',
              desc: '',
              date: ''
            }
          })
        }
      })
    }
   
  },
  showTally() {
    this.setData({
      isTally: true
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
      ['form.date']: formatTimeTwo(formatTime(new Date()), 'Y-M-D'),
      ['form.date_lebal']: formatTimeTwo(formatTime(new Date()), 'M月D日'),
    })
    this.books()
    this.categorys()
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

  }
})