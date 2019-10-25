/**
 * @description 存放用户资金状况(余额)model
 */

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/vue02', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const BalanceSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },

  // 银行卡余额
  cardBalance: {
    type: Number,
    default: 0
  },
  // 支付宝余额
  zfbBalance: {
    type: Number,
    default: 0
  },

  // 微信余额
  wxBalance: {
    type: Number,
    default: 0
  },
  // 现金余额
  cashBalance: {
    type: Number,
    default: 0
  },

  date: {
    type: Date,
    default: Date.now
  }

})

module.exports = mongoose.model('banlances', BalanceSchema);