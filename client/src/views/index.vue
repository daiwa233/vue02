<template>
  <div class="index">
    
  <headerNav></headerNav>
  <asideNav></asideNav>
  <div class="rightside">
    <router-view></router-view>
  </div>
  
  </div>
</template>

<script>
import headerNav from '../components/header.vue';
import asideNav from '../components/asidenav.vue'
export default {
  name: 'index',
  components: {
    headerNav,
    asideNav
  }
}
</script>

<style>
  .index{
    width:100%;
    height:100vh;
    overflow: hidden;
  }
  .rightside{
    position: relative;
    top: 0;
    left: 180px;
    width: calc(100% - 180px);
    height: calc(100% - 80px);
    overflow: auto;
  }
</style>