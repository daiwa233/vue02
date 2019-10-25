const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/vue02', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

const ProFileSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  describe: {
    type: String,
    required: true
  },
  // 资金流动模式
  model: {
    type: String,
    enum: ['收入', '支出'],
    required: true
  },
  // 资金流动的方式
  paymethod: {
    type: String,
    enum: ['银行卡', '支付宝', '微信', '现金'],
    required: true
  },
  //收入或者支出的金额
  moneynum: {
    type: Number,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  }

})

module.exports = mongoose.model('profiles', ProFileSchema);