/**
 *  @数据 CRUD(增删改查)  账户中各'卡'的余额需要前端计算
 */
const express = require('express');
const router = express.Router();
const passport = require('passport');
const ProFile = require('../../models/profile');
// const {paymethodsMap} = require('../../config/keys');
const Balance = require('../../models/balance');
/**
 * $route GET api/profiles/test
 *  @description 测试路由接口
 *  @access public
 */
router.get('/test', (req, res, next) => {
  res.json({msg: 'ok'})
})

/**
 * $route POST api/profiles/initialize/${username}
 *  @description 用户添加初始数据接口
 *  @access private
 */
router.post(
  '/initialize/:username',
  passport.authenticate("jwt", {session: false}),
  async (req, res, next) => {
    if (req.user.username !== req.params.username) {
     return await res.json({msg: '安全验证失败,请重新登录', success: false});
    }
    const { body } = req;
    body.username = req.user.username;
    const initializeMoney = await new Balance(body).save().catch(err => next(err));
    await res.json({
      initializeMoney,
      success: true
    })

})


/**
 * $route GET api/profiles/data/${username}
 *  @description 获得登录用户的全部资金数据
 *  @access private
 */
router.get(
  '/data/:username', 
  passport.authenticate("jwt", {session: false}),
  async (req, res, next) => {
    if (req.user.username !== req.params.username) {
     return await res.json({msg: '安全验证失败,请重新登录', success: false});
    }
    const { username } = req.user;
    const data = await ProFile.find({ username }).catch(err => next(err));  
    await res.json({
      success: true,
      data
    })
})

/**
 * $route POST api/profiles/add/${username}
 *  @description 添加一条资金数据
 *  @access private
 * 
 * @要求：前端表单中的数据严格按照指定的name提交
 */
router.post(
  '/add/:username',
  passport.authenticate("jwt", {session: false}),
  async (req, res, next) => {
    if (req.user.username !== req.params.username) {
      return await res.json({msg: '安全验证失败,请重新登录', success: false});
     }

    const { body } = req;
    body.username = req.user.username;

    //存储数据，之后更新余额
    const data = await new ProFile(body).save().catch(err => next(err));

    // const { model, paymethod, moneynum } = body;

    // // paymethodsMap是将前端传过来的支付方式和collection中支付方式的键一一映射
    // const Mapkey = Object.keys(paymethodsMap).find((item) => paymethodsMap[item].includes(paymethod))
    //  //得到的mapkey是collection中的一个键
   

    // //更新余额
    // const balance = await Balance.findOne({username: req.user.username})
    // .catch(err => next(err));

    // balance[Mapkey] = model.includes('支出') ? balance[Mapkey] - moneynum : balance[Mapkey] + moneynum;
    
    // await balance.save().catch(err => next(err));

    await res.json({
      // balance,
      data,
      success: true
    })

  }
  )

  /**
 * $route DELETE api/profiles/remove/:id
 *  @description 删除一条资金数据
 *  @access private
 * @ 前端接收到success：true之后，需手动splice数组中的数据
 * 
 */
router.delete(
  '/remove/:id',
  passport.authenticate("jwt", {session: false}),
  async (req, res, next) => {
    if (req.user.username !== req.params.username) {
      return await res.json({msg: '安全验证失败,请重新登录', success: false});
     }
    const { id } = req.params;
    
    await ProFile.findByIdAndRemove(id)
      .catch(err => next(err));
    
    await res.json({
        success: true,
        msg: 'remove successed'
      })
  }
)

/**
 * $route POST api/profiles/edite/:id
 *  @description 修改一条资金数据
 *  @access private
 * @ 前端接收到success：true之后，需手动修改数组中的数据
 * 
 */
router.post(
  '/edite/:id',
  passport.authenticate("jwt", {session: false}),
  async (req, res, next) => {                     
    

    const {id} = req.params;
    const {body} = req;
    
    const data = await ProFile.findByIdAndUpdate(
      id,
      {$set: body},
      {new: true}
    ).catch(err => next(err))
    await res.json({
      success: true,
      data
    })

  }
)


module.exports = router;