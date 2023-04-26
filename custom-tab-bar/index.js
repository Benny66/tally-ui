Component({
  data: {
    selected: null,
    color: "#d8d8d8",
    selectedColor: "#00a578",
    list: [
      {
      "iconPath": "../images/tabbar/tally.png",
      "selectedIconPath": "../images/tabbar/tally-active.png",
      "pagePath": "pages/tally/index",
      "text": "记账"
    },
    // {
    //   "iconPath": "../images/tabbar/scat.png",
    //   "selectedIconPath": "../images/tabbar/scat-active.png",
    //   "pagePath": "pages/stats/index",
    //   "text": "统计"
    // },
    {
      "iconPath": "../images/tabbar/tally.png",
      "pagePath": "pages/add/index",
    },
    // {
    //   "iconPath": "../images/tabbar/family.png",
    //   "selectedIconPath": "../images/tabbar/family-active.png",
    //   "pagePath": "pages/family/index",
    //   "text": "家庭"
    // },
    {
      "iconPath": "../images/tabbar/user.png",
      "selectedIconPath": "../images/tabbar/user-active.png",
      "pagePath": "pages/user/index",
      "text": "我的"
    }
  ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url:'/'+url})
      this.setData({
        selected: null
      })
      

    },


  }
})