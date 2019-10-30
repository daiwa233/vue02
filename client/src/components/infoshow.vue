<template>
  <div class="infoshow">
    <div class="avatar">
      <img :src="'http://localhost:5000'+user.avatar" alt="" id="user-avarar">
      <el-upload
        class="upload-demo"
        <!-- action="https://jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :limit="3"
        :on-exceed="handleExceed"
        :file-list="fileList"> -->
        
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">更换头像</div>
      </el-upload>
    </div>
    <div class="userinfo">
      <div class="username">
        <i class="el-icon-user-solid "></i>
      <span>{{ user.name }}</span>
      </div>
      <div class="identity">
        <i class="el-icon-s-tools"></i>
      <span>{{ user.identity }}</span>
      </div>

      
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.getters.userinfo;
    }
  }
}
</script>

<style scoped>
  .infoshow{
    
    width:100%;
    height:100%;
    display: flex;
    justify-content: center;
    
  }
  .avatar{
    height:100%;
    flex:1;
    background:#f7f1e3;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  #user-avarar{
    width:8rem;
    height:8rem;
    margin-bottom:1rem;
  }
  .userinfo{
    flex: 2;
    background:#c8d6e5;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .username ,.identity{
    font-size:2.5rem ;
    margin:1rem;
  }
  
</style>