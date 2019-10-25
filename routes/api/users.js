/**
 *  @login & register
 */
 const express = require('express');
 const router = express.Router();
 const md5 = require('md5');
 const User = require('../../models/User');
 const passport = require('passport');

 // 导入一些配置的key
 const { Md5key, privatekey } = require('../../config/keys');
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
    const { email, password } = req.body;

    const data = await User.findOne({ email }).catch(err => next(err));
  
    if (data) {
      
      const {password: dbpassword} = data;
      if (md5(md5(password)+Md5key) === dbpassword) {

        const rule = {id: data.id, name: data.name};
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
   const { username, email } = body;

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

     
  
   }  
     body.password = md5(md5(body.password)+Md5key);
    
     await new User(body).save().catch(err => next(err))
    
     await res.json({success: true,data: body});
   

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


module.exports = router;