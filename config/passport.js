/**
 * passport 配置
 */

const User = require('../models/User');
const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;
const { privatekey } = require('./keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = privatekey;

module.exports = passport => {
  // 验证token，如果成功，则将token数据的用户挂载到req对象上
  passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    
    const user = await User.findById( jwt_payload.id).catch(err => done(err, false))
    
       if (user) return done(null, user);

       return done(null, false)
}));
}