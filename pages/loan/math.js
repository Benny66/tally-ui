// utils/math.js
var Math = require('../../utils/math.js')

/**
 * 等本等息
 * @param {Number} loanAmount 贷款金额
 * @param {Number} loanTerm 贷款期数（月）
 * @param {Number} rate 月利率
 * @returns {Object} 计算结果 {totalPaymentAmount, monthlyPaymentAmount, cumulativePaymentAmount, repayDetail}
 */
export function equalPrincipalAndInterest(loanAmount, loanTerm, rate) {
  let totalPaymentAmount = loanAmount * (1 + rate * loanTerm)
  let monthlyPaymentAmount = totalPaymentAmount / loanTerm
  let cumulativePaymentAmount = monthlyPaymentAmount * loanTerm
  let repayDetail = []
  for (let i = 0; i < loanTerm; i++) {
    let date = new Date()
    date.setMonth(date.getMonth() + i)
    let repayAmount = monthlyPaymentAmount
    if (i == loanTerm - 1) {
      // 最后一期还款不含利息
      repayAmount = loanAmount / loanTerm + loanAmount * rate
    }
    repayDetail.push({
      date: date,
      repayAmount: repayAmount,
    })
  }
  return {
    totalPaymentAmount: totalPaymentAmount,
    monthlyPaymentAmount: monthlyPaymentAmount,
    cumulativePaymentAmount: cumulativePaymentAmount,
    repayDetail: repayDetail,
  }
}

/**
 * 等额本息
 * @param {Number} loanAmount 贷款金额
 * @param {Number} loanTerm 贷款期数（月）
 * @param {Number} rate 月利率
 * @returns {Object} 计算结果 {totalPaymentAmount, monthlyPaymentAmount, cumulativePaymentAmount, repayDetail}
 */
export function equalInstallmentPayments(loanAmount, loanTerm, rate) {
  let monthlyPaymentAmount =
    ((loanAmount * rate * Math.pow(1 + rate, loanTerm)) /
      (Math.pow(1 + rate, loanTerm) - 1)) *
    1
  let totalPaymentAmount = monthlyPaymentAmount * loanTerm
  let cumulativePaymentAmount = totalPaymentAmount
  let repayDetail = []
  for (let i = 0; i < loanTerm; i++) {
    let date = new Date()
    date.setMonth(date.getMonth() + i)
    let interest = loanAmount * rate * (1 - i / loanTerm) // 当月利息
    let repayAmount = monthlyPaymentAmount // 当月应还总额
    let principal = repayAmount - interest // 当月应还本金
    let remainingPrincipal = loanAmount - principal * i // 剩余本金
    if (i == loanTerm - 1) {
      // 最后一期还款调整为剩余本金
      principal = remainingPrincipal
      repayAmount = principal + interest
    }
    repayDetail.push({
      date: date,
      repayAmount: repayAmount,
    })
    cumulativePaymentAmount += interest
  }
  return {
    totalPaymentAmount: totalPaymentAmount,
    monthlyPaymentAmount: monthlyPaymentAmount,
    cumulativePaymentAmount: cumulativePaymentAmount,
    repayDetail: repayDetail,
  }
}

/**
 * 等额本金
 * @param {Number} loanAmount 贷款金额
 * @param {Number} loanTerm 贷款期数（月）
 * @param {Number} rate 月利率
 * @returns {Object} 计算结果 {totalPaymentAmount, monthlyPaymentAmount, cumulativePaymentAmount, repayDetail}
 */
export function equalPrincipal(loanAmount, loanTerm, rate) {
  let monthlyRepayPrincipal = loanAmount / loanTerm
  let totalPaymentAmount = 0
  let cumulativePaymentAmount = 0
  let repayDetail = []
  for (let i = 0; i < loanTerm; i++) {
    let date = new Date()
    date.setMonth(date.getMonth() + i)
    let interest = loanAmount * rate * (1 - i / loanTerm) // 当月利息
    let repayAmount = monthlyRepayPrincipal + interest // 当月应还总额
    let remainingPrincipal = loanAmount - monthlyRepayPrincipal * i // 剩余本金
    if (i == loanTerm - 1) {
      // 最后一期还款调整为剩余本金
      repayAmount = remainingPrincipal + interest
    }
    repayDetail.push({
      date: date,
      repayAmount: repayAmount,
    })
    totalPaymentAmount += repayAmount
    cumulativePaymentAmount += interest
  }
  return {
    totalPaymentAmount: totalPaymentAmount,
    monthlyPaymentAmount: totalPaymentAmount / loanTerm,
    cumulativePaymentAmount: cumulativePaymentAmount,
    repayDetail: repayDetail,
  }
}

/**
 * 先息后本
 * @param {Number} loanAmount 贷款金额
 * @param {Number} loanTerm 贷款期数（月）
 * @param {Number} rate 月利率
 * @returns {Object} 计算结果 {totalPaymentAmount, monthlyPaymentAmount, cumulativePaymentAmount, repayDetail}
 */
export function firstInterestLastPrincipal(loanAmount, loanTerm, rate) {
  let totalPaymentAmount = loanAmount * (1 + rate * loanTerm)
  let interest = loanAmount * rate
  let monthlyPaymentAmount = interest
  let cumulativePaymentAmount = interest
  let repayDetail = []
  for (let i = 0; i < loanTerm; i++) {
    let date = new Date()
    date.setMonth(date.getMonth() + i)
    let repayAmount = 0
    if (i == loanTerm - 1) {
      // 最后一期还款包含本金和利息
      repayAmount = loanAmount + interest
    }
    repayDetail.push({
      date: date,
      repayAmount: repayAmount,
    })
  }
  return {
    totalPaymentAmount: totalPaymentAmount,
    monthlyPaymentAmount: monthlyPaymentAmount,
    cumulativePaymentAmount: cumulativePaymentAmount,
    repayDetail: repayDetail,
  }
}