// pages/views/achievement.js
const app = getApp()

import { formatTime, formatTimeTwo } from '../../utils/util' 

Page({

  /**
   * 页面的初始数据
   */
  data: {
      list:[],
      navs:[
        {
          "type":1,
          "name":"支出",
        },
        {
          "type":2,
          "name":"收入",
        },
        {
          "type":3,
          "name":"不计入收支",
        }
      ],
      navInfo:{},
      formTj:{
        type:1,
        date:"",
        date_lebal:"",
        date_year_lebal:""
      }
  },
  bindNav:function(e){
    const navs = this.data.navs
    const index = e.detail.value
    this.setData({
      navInfo: navs[index],
      ['formTj.type']: navs[index]['type']
    })
    //todo api
    this.getList()
  },
  bindPickerChangeDate:function(e){
    console.log(e.detail.value)
    this.setData({
      ['formTj.date_year_lebal']: formatTimeTwo(formatTime(new Date()), 'Y')+'年',
      ['formTj.date_lebal']: formatTimeTwo(e.detail.value, 'M月份'),
      ['formTj.date']: e.detail.value
    })
    //todo api
    this.getList()
  },
  getList:function(){
    app.ajaxPost('/api/get-tally-sta', {
      type:this.data.formTj.type,
      date:this.data.formTj.date,
    }, (res)=>{
      if(res.code === 0){
        this.setData({
          list: res.data
        })
      }
    })
  },
  initNav:function(){
    this.setData({
      navInfo: this.data.navs[0],
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var currentDate = new Date();
    // 获取年、月、日
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1; // 注意：getMonth返回值从0开始计数
    var day = currentDate.getDate();
    // 将月份和日期补零
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    // 拼接成指定的格式
    var formattedDate = year + '-' + month + '-' + day;
    this.setData({
      ['formTj.date']: formattedDate,
      ['formTj.date_year_lebal']: year+'年',
      ['formTj.date_lebal']: month+'月份',
    });
    this.getList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.initNav()
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
    this.getList()
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