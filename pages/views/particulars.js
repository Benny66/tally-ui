// pages/views/particulars.js
const app = getApp()
import { getfirstDateAndlastDate, formatTimeTwo, toThousands, getDateDiff } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: [
      {
        name: '支出',
        value: 1,
      },
      {
        name: '收入',
        value: 2,
      },
      {
        name: '不计收支',
        value: 3,
      },
    ],
    form: {
      type: 1,
      start_time: '',
      end_time: '',
      date_lebal: ''
    },
    typeInfo:{
      name: '支出',
      value: 1,
    },
    list: []
  },
  bindPickerChange(e) {
    const types = this.data.types
    const index = e.detail.value
    this.setData({
      typeInfo:  types[index],
      ['form.type']: types[index]['value']
    })
    this.getList()
  },
  bindPickerChangeDate(e) {
    let datt = getfirstDateAndlastDate( e.detail.value)
    this.setData({
      ['form.start_time']: datt[0],
      ['form.end_time']: datt[1],
      ['form.date_lebal']: formatTimeTwo(datt[0], 'Y年M月'),
    })
    this.getList()

  },
  getList() {
    const obj = this.data.form
    if(obj.type && obj.start_time && obj.end_time) {
      app.ajaxPost('/api/get-tally-main-list', obj, (res)=>{
        if(res.code === 0 && res.data !== null){
          res.data.forEach(v => { 
   
            v.money = toThousands(v.money);v.str_time = v.created_at } )
          this.setData({
            list: res.data,
          })
        }
      })
  
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let datt = getfirstDateAndlastDate( new Date())
    this.setData({
      ['form.start_time']: datt[0],
      ['form.end_time']: datt[1],
      ['form.date_lebal']: formatTimeTwo(datt[0], 'Y年M月'),
    })

    this.getList()
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