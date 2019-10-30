/**
 *  @login & register
 */
 const express = require('express');
 const router = express.Router();
 const md5 = require('md5');
 const User = require('../../models/User');
 const passport = require('passport');
// 导入发送邮件的服务
 const mailer = require('../../verify/nodemailer');
 const {createSixNum} = require('../../verify/tools');
const verifytime = 600000;
 // 导入svg 验证
 const svgCaptcha = require('svg-captcha');

 // 导入一些配置的key
 const { Md5key, privatekey, svgOptions } = require('../../config/keys');
 const jwt = require('jsonwebtoken')
 /**
 * 
 *  @description GET  测试路由接口
 *  @access public
 */
 router.get('/test', (req, res, next) => {
  res.json({message: 'ok'});
})

/**
 * $route POST api/users/login
 * @description  登录接口  
 * @access public
 */

 router.post('/login', async (req, res, next) => {
    const { email, password, verify } = req.body;

    // 判断验证码的session 是否失效， 失效返回
     if (!req.session.captcha) {
      return await res.json({
        session: false,
        msg: 'refresh'
      })
     }
    const dbverify = req.session.captcha.toLocaleLowerCase();
    if (dbverify !== verify.toLocaleLowerCase()) {

      return await res.json({
        success: false,
        verify:false
      })
    } 
    const data = await User.findOne({ 
     $or:[
      { email },
      { username: email }
     ] 
      }).catch(err => next(err));
  
     
    if (data) {

      const {password: dbpassword} = data;
      if (md5(md5(password)+Md5key) === dbpassword) {

        // 设置token
        const rule = {
          id: data.id,
          name: data.username,
          identity: data.identity,
          avatar: data.avatar
        };
        const token = await jwt.sign(
          rule, 
          privatekey, 
          {expiresIn: 3600}
        );
  
        return await res.json({
            success: true,
            token: 'Bearer ' + token
          })   
      }
      return await res.json({message:'password is not correct', password: false}) 
      
    }

    return await res.json({
          msg:'email is not in use',
          email: false
        }) 

 })


/**
 * $route POST api/users/register
 * @description POST 注册接口 
 * 
 * @access public
 */
 router.post('/register', async (req, res, next) => {
   const body = req.body;
   const { username, email,  identity } = body;
   const { verifyinfo } = req.session;

   if ( !verifyinfo ) return await res.json({
     success: false,
     click: 'false'
    })
   // 首先验证上传的数据和session中的数据是否一致

   
   if (verifyinfo.date - Date.now() < verifytime) {
    
      const flag = Object.keys(verifyinfo).some(item => {
        if (item === 'date') return false;
         return  verifyinfo[item] !== body[item]

      })
      // 验证成功， 清除session
      req.session.verifyinfo = null;

        if ( flag ) return await res.json({
          success: false,
          verify:false
        })

   } else {
    // 验证成功， 清除session
     req.session.verifyinfo = null;

     return await res.json({
        success: false,
        timeout: true
      })
   }
   
   

   //异步执行查询数据库,
   const data = await User.find({
     $or: [
       {username},
       {email}
     ]
   }).catch(err => next(err));
   
   // 使用find查询如果为空返回的是空数组,不能 if (data)
   if (data.length !== 0) {
      const {username: dbusername,email: dbemail} = data[0];
     
    // 判断 用户名和邮箱是否被使用
      if (dbemail === email) 
      return await res.json({msg: 'email has been used', email: false})

      if (dbusername === username) 
        return await res.json({msg: 'username has been used', username: false})

   }  else {

        

        body.password = md5(md5(body.password)+Md5key);
        
       const userinfo = await new User(body).save().catch(err => next(err))
      

       // 设置token
       const rule = {
          id: userinfo.id,
           name:userinfo.username, 
           identity: userinfo.identity,
           avatar: userinfo.avatar
          };
       const token = await jwt.sign(
         rule, 
         privatekey, 
         {expiresIn: 3600}
       );

        await res.json({
          success: true,
          info: {
            username,
            email,
            identity
          },
          token: 'Bearer ' + token
        });
   }
    
   

 })

/**
 * $route GET api/users/current
 * @description  该接口返回用户信息  return user
 * @access private
 */

 router.get(
   '/current',
    passport.authenticate("jwt", {session: false}), 
    async (req, res, next) => {

      let { id, username, email } = req.user;
      await res.json({
        id,
        username,
        email,
        success: true
      })
 })

/**
 * $route GET api/users/email
 * @description  该接口发送邮件  need email ，username
 * @access public
 */
 router.get(
   '/email',
   async (req, res, next) => {
     const { email, username } = req.query;
      //异步执行查询数据库,
      const data = await User.find({
        $or: [
          {username},
          {email}
        ]
      }).catch(err => next(err));
      
      // 使用query查询如果为空返回的是空数组,不能 if (data)
      if (data.length !== 0) {
        const {username: dbusername,email: dbemail} = data[0];
      // 判断 用户名和邮箱是否被使用
        if (dbemail === email) 
        return await res.json({msg: 'email has been used', email: false})

        if (dbusername === username) 
          return await res.json({msg: 'username has been used', username: false})
      } else {

        const verify = createSixNum();// 6位验证码
        const date = Date.now();
        req.session.verifyinfo = {
          verify,
          email,
          username,
          date
        }
        
        
        const result = await mailer(email, verify)
        .catch(err => res.json({
            success: false,
            emailAddress: false
        })); // 如果邮箱和用户名都不存在，则发送邮件,如果邮件发送失败，则catch

        return await res.json({result}) // 发送失败的话，info={}
      }


   }
   )

/**
 * $route GET api/users/svgverify
 * @description  该接口实现svg验证  
 * @access public
 */
router.get(
  '/svgverify',
  async (req, res, next) => {
    
    const captcha = await svgCaptcha.create(svgOptions);
    req.session.captcha = captcha.text;
    
    res.type('svg');
    await res.status(200).send(captcha.data);
  }
  )

  /**
 * $route GET api/users/avatar
 * @description  该接口更换用户头像  
 * @access private
 */
router.get(
  '/avatar',
  passport.authenticate("jwt", {session: false}),
  async (req, res, next) => {
    
  }
)


module.exports = router;