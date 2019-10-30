/**
 *  @description 发送邮件验证码
 *  @access private
 */

 const NodeMailer = require('nodemailer');
 const { mailerConfig } = require('../config/keys'); //引入smtp服务器config

 // 创建一个smtp客户端对象
const transporter = NodeMailer.createTransport(mailerConfig);

 module.exports = (emailAddress, verify) => {


  // 邮件内容
  const email = {
    //发件人
    from: 'dvalhj@163.com',
    // 邮件主题
    subject: '接受凭证',
    // 收件人
    to: emailAddress,
    // 邮件内容
    html: `您正在注册dva的资金管理系统，<strong style="color: blue">${verify}</strong> 是您本次操作的验证码，
          请在10分钟内填写在相应位置，感谢您的注册^_^`
  };
  

   return new Promise((resolve, reject) => {
    transporter.sendMail(email, (err, info) => {
      if (err) return reject(err);
      resolve(info)
    })
   })

 }