// const  mongoose = require ("mongoose")

// const balanceSheetSchema = new mongoose.Schema({
//   assets: {
//     bankBalance: Number,
//     accountReceivable: Number,
//     cashInHand: Number,
//     prepaidExpenses: Number,
//     property: Number,
//     officeEquipment: Number,
//     software: Number,
//     deposit: Number,
//   },
//   liabilities: {
//     accountpayable: Number,
//     outstanding: Number,
//     shorttermLoan: Number,
//     longtermLoan: Number,
//     lease: Number,
//   },
//   equities: {
//     capital: Number,
//     retainedEarnings: Number,
//     withdrawl: Number,
//   },
//   totals: {
//     totalAssets: Number,
//     totalLiabilities: Number,
//     totalEquities: Number,
//   }
// }, { timestamps: true });

// const BalanceSheet = mongoose.model("BalanceSheet", balanceSheetSchema);

// module.exports =  BalanceSheet;


const mongoose = require("mongoose");

const balanceSheetSchema = new mongoose.Schema({
  assets: {
    bankBalance: { type: Number, default: 0 },
    accountReceivable: { type: Number, default: 0 },
    cashInHand: { type: Number, default: 0 },
    prepaidExpenses: { type: Number, default: 0 },
    property: { type: Number, default: 0 },
    officeEquipment: { type: Number, default: 0 },
    software: { type: Number, default: 0 },
    deposit: { type: Number, default: 0 },
  },
  liabilities: {
    accountpayable: { type: Number, default: 0 },
    outstanding: { type: Number, default: 0 },
    shorttermLoan: { type: Number, default: 0 },
    longtermLoan: { type: Number, default: 0 },
    lease: { type: Number, default: 0 },
  },
  equities: {
    capital: { type: Number, default: 0 },
    retainedEarnings: { type: Number, default: 0 },
    withdrawl: { type: Number, default: 0 },
  },
  totals: {
    totalAssets: { type: Number, default: 0 },
    totalLiabilities: { type: Number, default: 0 },
    totalEquities: { type: Number, default: 0 },
  }
}, { timestamps: true });

module.exports = mongoose.model("BalanceSheet", balanceSheetSchema);
