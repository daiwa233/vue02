<template>
  <div class="register">
    <div class="bgregister"></div>
    <div class="bgblack"></div>
    <div class="register-body">
  
      <el-form 
      :model="registerForm"
       status-icon :rules="rules"
        ref="registerForm"
         label-width="80px" 
         class="register-Form"
         @validate="validate"
         >
          <h1 class="register-title">注册</h1>
        <el-form-item label="用户名" prop="username">
          <el-input 
          type="text" 
          v-model="registerForm.username" 
          placeholder="用户名"
          ref="username"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input 
          type="email" 
          v-model="registerForm.email"
           placeholder="邮箱"
           ref="email"
           ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="registerForm.password"  placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item label="身份" prop="identity">
        <el-select v-model="registerForm.identity" placeholder="请选择">
          <el-option label="个人用户" value="个人用户"></el-option>
          <el-option label="企业用户" value="企业用户"></el-option>
        </el-select>
      </el-form-item>
      <div class="sendEmail"> 
        <el-form-item  prop="verification_code">
          <el-input 
           type="text"
           v-model="registerForm.verification_code" 
           placeholder="请输入验证码"
           ref="verify"
           ></el-input>
        </el-form-item>
           <el-button 
           type="danger"
            @click="sendEmail" 
            size="mini" 
            :disabled="sendButton.flag" 
            >{{ sendButton.msg }}</el-button>
      </div>
          <el-button type="primary" @click="onSubmit" :disabled="submitFlag">立即注册</el-button>
        <div>
          已有账号？去 <router-link to="/login">登录</router-link>
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
        return callback(new Error('请输入您的邮箱'))
      } else {

        let reg =  /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (!reg.test(value)) 
          return  callback(new Error('邮箱格式不正确,请检查'));
        
        callback();
      }
    };
    const validateVerify = (rule, value, callback) => {
      
      if (value === '' ) return callback(new Error('请输入验证码'))
      if (value.length !== 6) return callback(new Error('验证码是6位字符'))
      callback();
    };
    const validateUsername = (rule, value, callback) => {
      let reg = /^[\u4E00-\u9FA5A-Za-z0-9_]{4,10}$/;
      if (!reg.test(value)) {
        return callback(new Error('用户名不能包含除了下划线的其他特殊字符'))
      }
      callback();
    }

    return {
      // 表单中双向绑定的value
      registerForm: {
        username: '',
        usernameflag: false,
        email: '',
        emailflag: false,
        password: '',
        passwordflag: false,
        identity: '个人用户',
        verification_code: '',
        verification_codeflag: false
      },
      // 发送验证码按钮状态
      sendButton:{
        msg: '发送验证码',
        flag: true
      },
      // 注册按钮flag
      submitFlag: true,
      // 我晕了
      sendflag: false,
      // 表单验证规则
      rules: {
          username:[
            {required: true,message: '请输入您的用户名',trigger:'channge'},
            {min:4, max: 10, message: '用户名由4~10个字符组成', trigger: 'change'},
            {validator: validateUsername, trigger: 'change'},
          ],
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
   
    onSubmit() {
      const { username, email, password,identity,verification_code} = this.registerForm;
      this.axios({
        method: 'post',
        url: '/api/users/register',
        data: {
          username,
          email,
          password,
          identity,
          verify: verification_code
        }
      }).then(res => {
        const {data} = res;
        
        // 用户信息注册成功
        if (data.success) {
          
          localStorage.setItem('dvaTOKEN', data.token);
          this.$message({
            message: '注册成功',
            type: 'success'
          });
          // 使用jwt-decode解析token，并提交改变到vuex中
          const decode = jwt_decode(data.token);
          this.$store.commit('initialize', decode)

          return  this.$router.push('/index');
        } 
        // 邮箱验证码不通过
        if (data.verify === false) {

          this.$refs.verify.focus();
          this.registerForm.verification_code = '';
          return this.$message.error('验证码错误');

        }
        // 邮箱验证超时
        if (data.timeout) {
          this.$refs.verify.focus();
          this.registerForm.verification_code = '';
          return this.$message.error('验证码已失效，请点击重新发送');
        }
        // 邮箱重复
        if (data.email === false) {
          this.$refs.email.focus();
          this.registerForm.email = '';
          return this.$message.error('邮箱已存在');
        }
        // 用户名重复
        if (data.username === false) {
            this.$refs.username.focus();
            this.registerForm.username = '';
           return this.$message.error('用户名已存在');
        }

        

      }).catch(err => {
        console.log(err)
        this.$message.error('出错了，请刷新试试');
      })
    },
    // 将邮箱名称和用户名发送至后台
    sendEmail() {
     
      
      this.axios({
        method:'get',
        url: `/api/users/email?username=${this.registerForm.username}&email=${this.registerForm.email}`,

      }).then(res => {
        
        const {data} = res;

        
        //邮件发送的结果中accrpted[0] 存在
        if (data.result) {
          if (data.result.accepted[0]) {
            // 邮件发送成功改变发送邮件按钮样式
            this.changeSendBtn();
            return this.openRightTop('邮件已发送');
          }
          
          return this.$message.error('邮件发送失败');
        }
        
        // 邮箱重复
        if (data.email === false) {
          this.$refs.email.focus();
          this.registerForm.email = '';
         return this.$message.error('邮箱已存在,请先更换，再点击发送');
        }
        // 用户名重复
        if (data.username === false) {
          this.$refs.username.focus();
          this.registerForm.username = '';

         return  this.$message.error('用户名已存在，请先更换，再点击发送');
        }

      }).catch(err => {
        this.openRightTop('邮件发送失败', '请检查后重试')
      })
      
      
    },
    // 更改发送验证码btn 的样式
    changeSendBtn() {
       let second = 60;
       this.sendflag = true;
     
       this.sendButton.flag = true;

       const timer = setInterval(() => {
          second--;
          // 补齐两位字符
          second = second.toString().padStart(2,'0');

          this.sendButton.msg = `${second}秒后重试`;
          if (second <= 0) {
            clearInterval(timer);
            this.sendButton.msg = '重新发送';
            this.sendButton.flag = false;
            this.sendflag = false;
          }
      }, 1000)
    },
    // 表单中被校验触发事件
    validate(prop,fg) {
      if (prop === 'username' && fg){
          this.registerForm.usernameflag = true;
      }
      if (prop === 'email' && fg){
          this.registerForm.emailflag = true;
      }
      if (prop === 'password' && fg){
          this.registerForm.passwordflag = true;
      }
      if (prop === 'verification_code' && fg) {
          this.registerForm.verification_codeflag = true;
        }
      
      if(this.registerForm.usernameflag && this.registerForm.emailflag && this.registerForm.passwordflag) {
        // 如果点击了发送验证码按钮之后又重新修改表单内容
          if(!this.sendflag) {
            this.sendButton.flag = false;
          }
          
        
        
        if (this.registerForm.verification_codeflag && fg) {
          this.submitFlag = false;
        }
      } 
      if (!fg && prop !== 'verification_code') {
        let str = `${prop}flag`;
        this.registerForm[str] = false;
        
        this.sendButton.flag = true;
      }

      if (!fg) {
        let str = `${prop}flag`;
        this.registerForm[str] = false;
         this.submitFlag = true;
      }

    },

    // element-ui 通知
     openRightTop(title='已完成', message='请注意查收') {
        this.$notify({
          title,
          message
        });
      },

  },

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
  .sendEmail input{
    background:#fff;
    -webkit-apperrance:none;
    border-radius:4px;
    box-sizing: border-box;
    border: 1px solid #dcdfe6;
    color:#606266;
    display:inline-block;
    height:40px;
    padding: 0 15px;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  .sendEmail button{
    height: 40px;
  }
  
</style>