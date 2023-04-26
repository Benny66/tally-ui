// pages/add/index.js
const app = getApp()
import { formatTimeTwo } from '../../utils/util'
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
    index: 0,
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
    this.setData({
      ['form.id']: options.id
    })

    this.books()
    this.categorys()
    

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

  

  },
  // 获取账单详情
  getInfo() {
   
    app.ajaxPost('/api/get-tally-info', {id: this.data.form.id}, (res)=>{
      if(res.code === 200){
        let item = this.data.books.find(v=>v.id = res.data.book_id)
        let index = this.data.books.findIndex(v=>v.id = res.data.book_id)
        res.data.date_lebal = formatTimeTwo(res.data.date, 'M月D日'),
        this.setData({
          form: res.data,
          bookInfo: item,
          index: index
        })
      }
    })
  },
  books() {
    app.ajaxPost('/api/get-user-book', {}, (res)=>{
      if(res.code === 200){
        this.setData({
          books: res.data,
        })
        this.getInfo()
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
  },
  // 获取分类
  categorys() {
    
    app.ajaxPost('/api/get-category-list', {type: this.data.form.type}, (res)=>{
      if(res.code === 200){
        this.setData({
          categorys: res.data,
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
        if(res.code === 200){
          wx.showToast({
            icon: 'none',
            title: '成功，即将返回',
          })
          setTimeout(()=>{
            wx.navigateBack({
              delta: 1,
            })
          }, 1000)
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