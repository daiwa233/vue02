module.exports = {
  MD5key: 'test',
  privatekey: 'test',
  sessionkey: 'test', 
  // 服务器端计算需要多次访问数据库，转到客户端计算
  // paymethodsMap: {
  //   'zfbBalance': '支付宝',
  //   'wxBalance': '微信',
  //   'cardBalance': '银行卡',
  //   'cashBalance': '现金'
  // },

  // 此处为发送邮件的配置，我使用的是163邮箱
  mailerConfig: {
    host: 'smtp.163.com',
    port: 465,
    
    auth: {
      user: 'xxx@163.com', // 此处填写发送邮件使用的邮箱
      pass: 'xxxxxx' // 此处为smtp协议的验证
    }
  },
  
  svgOptions: {
    size: 4,
    background: '#cc9966',
    noise: 2,
    color: true,
    fontSize: 32,
    ignoreChars: '0o1i',
    width: 110
  }
}