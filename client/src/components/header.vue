<template>
  <div class="header-nav">
    <div class="left-header">
      <img src="../assets/logo.png" alt="" >
      <span>dva的资金管理系统</span>
    </div>
    <div class="right-header">
        <img :src="'http://localhost:5000'+user.avatar" alt="">
      <div class="userinfo">
         <span class="date">{{ Date.now() | dateFormat }} </span>
          <span class="username">{{ user.name }}</span>
      </div>
        
          <el-dropdown trigger="click" @command="dropmenu">
          <span class="el-dropdown-link">
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="info">个人信息</el-dropdown-item>
            <el-dropdown-item command="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        
        
    </div>
  </div>
</template>

<script>
export default {
  name: 'header-nav',
  data() {
    return {
      
    }
  },

  computed: {
    user() {
      
      return this.$store.getters.userinfo;
    }
  },
  methods: {
    // 点击菜单的事件回调
    dropmenu(item) {
      switch (item) {
        case 'info':
          this.info();
        break;
        case 'logout':
          this.logout();
        break;
      }

    },
    // 展示用户信息
    info() {
      this.$router.push('/info');
    },
    // 退出
    logout() {
      
      localStorage.removeItem('dvaTOKEN');
      // 提交 clear 改变
      this.$store.commit('clear');
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
  .header-nav{
    width: 100vw;
    /* min-width:500px; */
    height: 5rem;
    background:#324057;
    display: flex;
    justify-content: space-between;
  }

  .left-header{
    padding-left: 2rem;
    display:flex;
    justify-content: center;
    align-items: center;
  }
  .left-header>img{
    border-radius:50%;
    height:4rem;
    width:4rem;
     
  }
  .left-header span{
    padding-left:.5rem;
    font-size:1.3rem;
    font-weight: bold;
    color:white;
    
  }
  .right-header{
    padding-right:2rem;
    display:flex;
    justify-content: center;
    align-items: center;
  }

  .right-header>img{
    width:3.5rem;
    height: 3.5rem;
    margin: 0 .5rem;
    
  }
  .el-icon-caret-bottom{
    color: #fff;
    
  }
  .userinfo{
    display: flex;
    flex-direction: column;
  }
  .username{
    color:#0984e3;
    font-size:1.1rem;
    font-weight:700;
  }
  .date{
    color:#fff;
    
  }
  
  
</style>