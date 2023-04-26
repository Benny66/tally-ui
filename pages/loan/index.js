// 引入Math.js库
// var math = require('../../node_modules/mathjs/lib/browser/math')

var math = require('../../utils/math.js')

Page({
  data: {
    amount: 0,
    periodOptions: [1, 3, 6, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120],
    selectedPeriod: 1,
    monthlyRate: 0,
    repaymentOptions: ['等本等息', '等额本息', '等额本金', '先息后本'],
    selectedRepayment: '等本等息',
    dueDay: null,
    totalAmount: null,
    repaymentDetails: null,
    currentTab: 0
  },

  onAmountChange(event) {
    this.setData({
      amount: event.detail.value
    });
  },

  onPeriodChange(event) {
    const selectedPeriod = this.data.periodOptions[event.detail.value];
    this.setData({
      selectedPeriod
    });
  },

  onRateChange(event) {
    const monthlyRate = math.divide(event.detail.value, 100);
    this.setData({
      monthlyRate
    });
  },

  onRepaymentChange(event) {
    const selectedRepayment = this.data.repaymentOptions[event.detail.value];
    this.setData({
      selectedRepayment
    });
  },

  onDueDayChange(event) {
    this.setData({
      dueDay: event.detail.value
    });
  },

  calculate() {
    const amount = parseFloat(this.data.amount);
    const period = this.data.selectedPeriod;
    const monthlyRate = this.data.monthlyRate;
    const repayment = this.data.selectedRepayment;
    const dueDay = parseInt(this.data.dueDay);
    if (!amount || !period || !monthlyRate || !repayment) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    const monthlyPayment = this.calculateMonthlyPayment(amount, period, monthlyRate, repayment);

    const repaymentDetails = this.generateRepaymentDetails(amount, period, monthlyRate, repayment, monthlyPayment, dueDay);

    const totalAmount = math.multiply(monthlyPayment, period).toFixed(2);

    this.setData({
      totalAmount,
      repaymentDetails
    });
  },

  switchResultTab(event) {
    const tab = parseInt(event.currentTarget.dataset.tab);
    this.setData({
      currentTab: tab
    });
  },

  calculateMonthlyPayment(amount, period, monthlyRate, repayment) {
    let monthlyPayment = null;
    switch (repayment) {
      case '等本等息': {
        const interest = math.multiply(amount, monthlyRate, period);
        monthlyPayment = math.divide(math.add(amount, interest), period);
        break;
      }
      case '等额本息': {
        const denominator = math.pow(math.add(1, monthlyRate), period);
        monthlyPayment = math.multiply(amount, math.multiply(monthlyRate, denominator), math.divide(1, math.subtract(denominator, 1)));
        break;
      }
      case '等额本金': {
        const eachPrincipal = math.divide(amount, period);
        const firstMonthInterest = math.multiply(amount, monthlyRate);
        const firstMonthPayment = math.add(eachPrincipal, firstMonthInterest);
        const decreaseAmount = eachPrincipal;
        monthlyPayment = new Array(period);
        monthlyPayment[0] = {
          period: 1,
          monthlyPayment: firstMonthPayment.toFixed(2),
          remainingPrincipal: (amount - eachPrincipal).toFixed(2)
        };
        for (let i = 1; i < period; i++) {
          const interest = math.multiply(monthlyRate, (amount - decreaseAmount * i));
          const payment = math.add(interest, eachPrincipal);
          monthlyPayment[i] = {
            period: i + 1,
            monthlyPayment: payment.toFixed(2),
            remainingPrincipal: (amount - eachPrincipal * (i + 1)).toFixed(2)
          };
        }
        break;
      }
      case '先息后本': {
        monthlyPayment = math.multiply(amount, monthlyRate).toFixed(2);
        break;
      }
    }

    return monthlyPayment;
  },

  generateRepaymentDetails(amount, period, monthlyRate, repayment, monthlyPayment, dueDay) {
    let repaymentDetails = null;
    switch (repayment) {
      case '等本等息': {
        repaymentDetails = new Array(period);
        for (let i = 0; i < period; i++) {
          repaymentDetails[i] = {
            period: i + 1,
            monthlyPayment: monthlyPayment.toFixed(2),
            remainingPrincipal: amount.toFixed(2)
          };
        }
        break;
      }
      case '等额本息': {
        repaymentDetails = new Array(period);
        let remainingPrincipal = amount;
        for (let i = 0; i < period; i++) {
          const interest = math.multiply(remainingPrincipal, monthlyRate);
          const principal = math.subtract(monthlyPayment, interest);
          remainingPrincipal = math.subtract(remainingPrincipal, principal);
          repaymentDetails[i] = {
            period: i + 1,
            monthlyPayment: monthlyPayment.toFixed(2),
            remainingPrincipal: remainingPrincipal.toFixed(2)
          };
        }
        break;
      }
      case '等额本金': {
        repaymentDetails = monthlyPayment;
        break;
      }
      case '先息后本': {
        repaymentDetails = new Array(period + 1);
        let remainingPrincipal = amount;
        for (let i = 0; i < period; i++) {
          const interest = math.multiply(remainingPrincipal, monthlyRate);
          repaymentDetails[i] = {
            period: i + 1,
            monthlyPayment: interest.toFixed(2),
            remainingPrincipal: remainingPrincipal.toFixed(2)
          };
        }
        repaymentDetails[period] = {
          period: period + 1,
          monthlyPayment: math.add(monthlyPayment, remainingPrincipal).toFixed(2),
          remainingPrincipal: '0.00'
        };
        break;
      }
    }

    if (dueDay) {
      repaymentDetails = this.sortRepaymentDetails(repaymentDetails, dueDay);
    }

    return repaymentDetails;
  },

  sortRepaymentDetails(repaymentDetails, dueDay) {
    const sortedRepaymentDetails = repaymentDetails.slice();
    sortedRepaymentDetails.sort((a, b) => {
      const aDueDate = new Date();
      aDueDate.setMonth(aDueDate.getMonth() + a.period - 1);
      aDueDate.setDate(dueDay);
      const bDueDate = new Date();
      bDueDate.setMonth(bDueDate.getMonth() + b.period - 1);
      bDueDate.setDate(dueDay);
      return aDueDate.getTime() - bDueDate.getTime();
    });
    return sortedRepaymentDetails;
  }
});