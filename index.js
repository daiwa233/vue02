const express = require('express');
const app = express();
const users = require('./routes/api/users');
const bodyParser = require('body-parser');
const passport = require('passport');
const proFiles = require('./routes/api/profiles');
const session = require('express-session');
const { sessionkey } = require('./config/keys');
const PORT = 5000;

//配置body-parse中间件
// parse application/x-www-form-urlencoded,不能处理formdata类型的数据
app.use(bodyParser.urlencoded({ extended: false }));
//parse application/json
app.use(bodyParser.json());

app.use("/public", express.static('public'));

// 配置passport中间件
app.use(passport.initialize());
require('./config/passport')(passport);//引入 passport 的配置项

// 配置session
app.use(session({
  secret: sessionkey,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000 }
}))

//配置路由中间件
app.use("/api/users", users);
app.use("/api/profiles", proFiles);

//配置错误处理中间件
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send('请求失败，稍后重试');
})

app.listen(PORT, () => {
  console.log(`server is running at  ${PORT}`);
})