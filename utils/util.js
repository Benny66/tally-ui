const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/
const formatTimeTwo = (date, format) => {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(date.replace(/-/g, "/"));
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
      format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

// 递归处理
const getArrTree = function (arr, pid = 0) {
  let subArr = arr.filter(v=>v.pid == pid)
  subArr.forEach((item, i) => {
      item['children'] = getArrTree(arr, item.id)
      item['value'] = item.id
      item['id'] = item.id
      item['label'] = item.name
      item['text'] = item.name
  });
  return subArr
}

// 金额格式化
const toThousands = function(num) {
    if(!num)return '0.00';
    var info = parseFloat(num).toFixed(2).toString().split('.');
    num=info[0];
    var result = '';
    while (num.length > 3) {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) { result = num + result; }
    info[0] = result;
    return info.join('.'); 
}

// 时间戳转多少分钟之前
const getDateDiff = function (dateTimeStamp) {
  // 时间字符串转时间戳
  var timestamp = new Date(dateTimeStamp).getTime();
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  var year = day * 365;
  var now = new Date().getTime();
  var diffValue = now - timestamp;
  var result;
  if (diffValue < 0) {
      return;
  }
  var yearC = diffValue / year;
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  if (yearC >= 1) {
      result = "" + parseInt(yearC) + "年前";
  } else if (monthC >= 1) {
      result = "" + parseInt(monthC) + "月前";
  } else if (weekC >= 1) {
      result = "" + parseInt(weekC) + "周前";
  } else if (dayC >= 1) {
      result = "" + parseInt(dayC) + "天前";
  } else if (hourC >= 1) {
      result = "" + parseInt(hourC) + "小时前";
  } else if (minC >= 1) {
      result = "" + parseInt(minC) + "分钟前";
  } else
      result = "刚刚";
  return result;
}
const getTimeState = function(){
  // 获取当前时间
  let timeNow = new Date();
  // 获取当前小时
  let hours = timeNow.getHours();
  // 设置默认文字
  let state= ``;
  // 判断当前时间段
  if (hours >= 0 && hours <= 10) {
      state = `早上好!`;
  } else if (hours > 10 && hours <= 14) {
      state= `中午好!`;
  } else if (hours > 14 && hours <= 18) {
      state= `下午好!`;
  } else if (hours > 18 && hours <= 24) {
      state= `晚上好!`;
  }
  return state;
}

//获取指定日期所在月的第一天和最后一天
function getfirstDateAndlastDate(str){
  var dateStr = str;
  var date = new Date(dateStr);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  if(month > 12){
      month = 1;
      year++;
  }
  if (month < 10) {
      month = '0' + month
  }
  var monthLastDay = new Date(year, month, 0).getDate();
  var firstDate = year + '-' + month + '-' + '01';
  var lastDate = year + '-' + month + '-' + monthLastDay;

  return [firstDate, lastDate]
  console.log(firstDate);
  console.log(lastDate);
}


module.exports = {
  formatTime,
  formatTimeTwo,
  getArrTree,
  toThousands,
  getDateDiff,
  getTimeState,
  getfirstDateAndlastDate
}
