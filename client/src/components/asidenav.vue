<template>
  <div class="menu_page">
    <el-row>
      <el-col :span="12">
        
        <el-menu
          model="vertical"
          class="el-menu-vertical-demo"
          background-color="#324057"
          text-color="#fff"
          active-text-color="#409eff"
          
        >
        <router-link to="/home">
          <el-menu-item index="1">
          <i class="el-icon-menu"></i>
          <span slot="title">首页</span>
          </el-menu-item>
        </router-link>
        <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-coin"></i>
          <span>资金管理</span>
        </template>
        <el-menu-item-group >
          <router-link to="/manage">
              <el-menu-item index="2-1">资金流水</el-menu-item>
          </router-link>
          
        </el-menu-item-group>

        </el-submenu>
        <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-info"></i>
          <span>信息管理</span>
        </template>
        <el-menu-item-group>
          <router-link to="/info">
            <el-menu-item index="3-1">个人信息</el-menu-item>
          </router-link>
          
        </el-menu-item-group>

        </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'asidenav'
};
</script>

<style scoped>
.menu_page {
  position: fixed;
  top: 71px;
  left: 0;
  min-height: 100%;
  background-color: #324057;
  z-index: 99;
}
.el-menu {
  border: none;
}
.fa-margin {
  margin-right: 5px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 180px;
  min-height: 400px;
}
.el-menu-vertical-demo {
  width: 35px;
}
.el-submenu .el-menu-item {
  min-width: 180px;
}

.hiddenDropdown,
.hiddenDropname {
  display: none;
}


</style>