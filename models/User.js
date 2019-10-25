const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/vue02', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },

  avatar: {
    type: String,
    default: '/public/img/avatar.jpg'
  },
  date: {
    type: Date,
    default: Date.now
  },

  // 用户注册类别
  identity: {
    type: String,
    default: '个人用户',
    enum: ['个人用户', '企业用户']
  }

})

module.exports = mongoose.model('users', UserSchema);