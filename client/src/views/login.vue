<template>
  <div class="register">
    <div class="bgregister"></div>
    <div class="bgblack"></div>
    <div class="register-body">
  
      <el-form 
      :model="loginForm"
       status-icon :rules="rules"
        ref="loginForm"
         label-width="80px" 
         class="register-Form"
         @validate="validate"
         >
          <h1 class="register-title">登录</h1>
        
        <el-form-item label="邮箱" prop="email" >
          <el-input 
          type="email"
           v-model="loginForm.email"
            placeholder="邮箱/用户名"
            ref="email"
            ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
           type="password"
            v-model="loginForm.password"
              placeholder="密码"
              ref="password"
              ></el-input>
        </el-form-item>
        
      <div class="sendEmail"> 
        <el-form-item  prop="verification_code">
          <el-input 
           type="text"
           v-model="loginForm.verification_code" 
           placeholder="请输入验证码"
           ref="verify"
           ></el-input>
        </el-form-item>
           <div class="svgfield" ref="svgfield" @click="getsvg">

           </div>
      </div>
          <el-button type="primary" @click="Onlogin" :disabled="submitFlag">立即登录</el-button>
        <div>
          还没有账号？去 <router-link to="/register">注册</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import jwt_decode from 'jwt-decode'
export default {
  name: 'register',
  data () {
    const validatePass = (rule, value, callback) => {

      if (value === '') {
        return callback(new Error('请输入您的密码'))
      }
      else {
        let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
        if (!reg.test(value))
        return callback(new Error('密码需要6~20个由数字字母组成的混合字符串'));

        callback();
      }
    };
    const validateEmail = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入您的邮箱/用户名'))
      } else {

          let reg_username = /^[\u4E00-\u9FA5A-Za-z0-9_]{4,10}$/;
          let reg =  /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
          if (reg.test(value) || reg_username.test(value)) {
            return callback();
          }
          if (!reg.test(value) && !reg_username.test(value)) 
            return  callback(new Error('邮箱或用户名不正确,请检查'));
          
      }
    }
    const validateVerify = (rule, value, callback) => {
      
      if (value === '' ) return callback(new Error('请输入验证码'))
      if (value.length !== 4) return callback(new Error('验证码是4位字符'))
      callback();
    }

    return {
      // 表单中双向绑定的value
      loginForm: {
        
        email: '',
        emailflag: false,
        password: '',
        passwordflag: false,
        verification_code: '',
        verification_codeflag: false
      },
      
      // 注册按钮flag
      submitFlag: true,

      // 表单验证规则
      rules: {
          
          email:[
            {trigger:'change',validator: validateEmail, required: true},
          ],
          password:[
            {trigger:'change',validator: validatePass , required:true}
          ],
          verification_code: [
            {validator: validateVerify, trigger: 'change'}
          ]
      }
    }
  },
  methods: {
    Onlogin() {
       const { email, password,verification_code} = this.loginForm;
      this.axios({
        method: 'post',
        url: '/api/users/login',
        data: {
          email,
          password,
          verify: verification_code
        }
      }).then((res => {
        
        const { data } = res;
        
        // 判断session是否失效，session失效主要是服务器重启（自己写的接口没有做session持久化）或者失效导致的
        if (data.session === false) {
          this.getsvg();
         return this.$message.error('长时间未操作,已为您重新刷新验证码');

        }

        // 全部都匹配
        if (data.success) {
          localStorage.setItem('dvaTOKEN', data.token);

          // 使用jwt-decode解析token，并提交改变到vuex中
          const decode = jwt_decode(data.token);

          this.$store.commit('initialize', decode)


          this.$message({
            message: '登录成功',
            type: 'success'
          })
         return  this.$router.push('/index');
        }

        // 验证码错误
        if (data.verify === false) {
          this.$refs.verify.focus();
          this.loginForm.verification_code = '';
          this.getsvg();
          return this.$message({
            message: '验证码错误,请重新输入',
            type: 'error'
          })
        }

        // 邮箱不存在
        if (data.email === false) {
          this.$refs.email.focus();
          this.loginForm.email = '';
          this.getsvg();
         return this.$message.error('用户名或邮箱不存在');
        }
        // 密码错误
        if (data.password === false) {
          this.$refs.password.focus();
          this.loginForm.password = '';
          this.getsvg();
         return this.$message.error('密码错误');
        }
        

            // 请求出错
      })).catch(err => this.openRightTop('请求出错', '请刷新重试'))
    },
   
    // 表单被校验触发事件
    validate(prop,fg) {
      
      if (prop === 'email' && fg){
          this.loginForm.emailflag = true;
      }
      if (prop === 'password' && fg){
          this.loginForm.passwordflag = true;
      }
      if (prop === 'verification_code' && fg){
          this.loginForm.verification_codeflag = true;
      }
      
      if(this.loginForm.emailflag && this.loginForm.passwordflag && this.loginForm.verification_codeflag) { 
        
          this.submitFlag = false;
        
      } 
      
      if (!fg) {
        let str = `${prop}flag`;
        this.loginForm[str] = false;
         this.submitFlag = true;
      }

    },

    getsvg() {
      this.axios({
        method: 'get',
        url: '/api/users/svgverify'
      }).then(result => {
        if (result.data) {
          this.$refs.svgfield.innerHTML = result.data;
        }
      }).catch(err=> {
        this.openRightTop('验证码获取失败','请刷新重试')
      })
    },

    // element-ui 通知
     openRightTop(title='已完成', message='请注意查收') {
        this.$notify({
          title,
          message
        });
      },

  },
  created() {
    this.getsvg();
  }

}
</script>

<style scoped>
  
  .bgregister{
    position:absolute;
    left:0;
    top:0;
    width: 100vw;
    height: 100vh;
    background: url('../assets/formbg.png') no-repeat;
    background-size: 100% 100%;
    filter: blur(3px);
    z-index: -9999;
  }
  .bgblack{
    position:absolute;
    left:0;
    top:0;
    width:100vw;
    height:100vh;
    background:black;
    opacity:.3;
    z-index: -9999;
  }
  .register-Form{
   background:white;
    width: 25rem;
    margin:0 auto;
    padding:1rem;
    padding-bottom:2rem;
    border-radius:10px;
    
  }

  .register-body{
    position: relative;
    top:8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    
  }
  .register-title{
    margin-bottom:3rem;
    
    color:#2c3e50;
    font-size:1.8rem;
    font-weight:500;
  }
  .el-form-item--large{
    margin-left:0;
    text-align:center;
  }

  
  .sendEmail{
    display: flex;
    justify-content: space-around;
    margin-bottom:2rem;
  }
  

  .svgfield{
    width: 110px;
    height:50px;
    background:rgba(200,200,200,.5);    
  }
  
</style>