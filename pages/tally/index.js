// pages/tally/index.js
const app = getApp()
import { toThousands, getDateDiff, getTimeState } from '../../utils/util' 
import moment from 'moment'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuRect: app.globalData.menuRect,
    url: app.globalData.api_base_url,
    hi: getTimeState(),
    yud: `${new Date().getMonth() + 1}月${new Date().getDate()}号`,
    books: [],
    bmw: 0,
    book_id: null,
    tallyTotal: {},
    list1: [],
    list2: [],
    statis: {},
    hint: '',
    weather: ''
  },
  onReady:function(){
    // this.initFun()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(1111)
    this.initFun()
  },
  initFun() {
    if (wx.getStorageSync('token') === "") {
      return app.appSetLogin()
    }
    this.getWeather()
    this.wish()
    this.books()
    this.getTallyTotal()
    this.getList()
  },
  getWeather() {
    
    app.ajaxPost('/api/get-weather', {}, (res)=>{
      if(res.code === 200){
        this.setData({
          weather: res.data
        })
      }
    })
  },
  // 跳转记账
  setJiZhang() {
    wx.switchTab({
      url: '/pages/add/index'
    })
  },
  wish() {
    app.ajaxPost('/api/benediction', {}, (res)=>{
      if(res.code === 200){
        this.setData({
          hint: res.data.phrase
        })
      }
    })
  },
  setTab(e) {
    let id = e.currentTarget.dataset.id
    this.setData({
      book_id: id
    })
    this.getTallyTotal()
    this.getList()
  },
  books() {
    app.ajaxPost('/api/get-user-book', {}, (res)=>{
      if(res.code === 200){
        let w = res.data.length * 193 + 228 + 193
        this.setData({
          bmw: w,
          books: res.data,
          // book_id: res.data[0]?res.data[0]['id']:null
        })
      }
    })
  },
  // 获取今天 昨天的 明细列表
  getList() {
    
    const time = moment().format('YYYY-MM-DD');
    const timezuo = moment().add(-1, 'days').format('YYYY-MM-DD');

    let statis = {
      jins: 0,
      jinz: 0,
      zuos: 0,
      zuoz: 0,
    }

    app.ajaxPost('/api/get-tally-main-list', {
      start_time:time,
      end_time:time,
      book_id: this.data.book_id || ''
    }, (res)=>{
      if(res.code === 200 && res.data !== null){
        res.data.forEach(v => { 
          if(v.type == 1){
            statis.jinz = statis.jinz + Number(v.money)
           }
           if(v.type == 2){
            statis.jins = statis.jins + Number(v.money)
           }
  

           v.money = toThousands(v.money) 
           v.str_time = v.created_at
     
          
          } )
        this.setData({
          list1: res.data,
          ['statis.jins']: toThousands(statis.jins),
          ['statis.jinz']: toThousands(statis.jinz),
        })
      }
    })

    
    app.ajaxPost('/api/get-tally-main-list', {
      start_time:timezuo,
      end_time:timezuo,
      book_id: this.data.book_id || ''
    }, (res)=>{
      if(res.code === 200 && res.data !== null){
        res.data.forEach(v => { 
          if(v.type == 1){
            statis.zuoz = statis.zuoz + Number(v.money)
           }
           if(v.type == 2){
            statis.zuos = statis.zuos + Number(v.money)
           }
          
          v.money = toThousands(v.money);v.str_time = v.created_at } )
        this.setData({
          list2: res.data,
          ['statis.zuos']: toThousands(statis.zuos),
          ['statis.zuoz']: toThousands(statis.zuoz),
        })
      }
    })


  },
  
  // 获取本月统计
  getTallyTotal() {
    const start_time = moment().startOf('month').format('YYYY-MM-DD');
    const end_time = moment().endOf('month').format('YYYY-MM-DD');
    app.ajaxPost('/api/get-tally-main-total', {
      start_time:start_time,
      end_time:end_time,
      book_id: this.data.book_id || ''
    }, (res)=>{
      if(res.code === 200){
        console.log(res.data)
        res.data.disregard = toThousands(res.data.disregard)
        res.data.expend = toThousands(res.data.expend)
        res.data.income = toThousands(res.data.income)
        this.setData({
          tallyTotal: res.data
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
        //唯一标识（其它设置不同的整数）  
        selected: 0
      })
    }



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
    this.initFun()
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