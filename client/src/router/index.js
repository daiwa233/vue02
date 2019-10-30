import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/index.vue'
import NotFound from '../views/404.vue'
import Register from '../views/register.vue'
import Login from '../views/login.vue'
import HomePage from '../components/homepage.vue'
import InfoShow from '../components/infoshow.vue'
import Manage from '../components/manage.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'index',
    component: Index,
    children: [
      {path:'', component: HomePage},
      {path:'/home', component: HomePage, name:'home'},
      {path:'/info', component: InfoShow, name:'info'},
      {path:'/manage', component: Manage, name:'manage'}

    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '*',
    name: '/404',
    component: NotFound
  }


]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 配置路由守卫
router.beforeEach((to, from, next) => {
  
  const islogin = localStorage.dvaTOKEN ? true : false;
  

    if (to.path == "/login" || to.path == '/register') {
      // 如果是登录状态，访问注册或登录页面，返回首页
      islogin ? next('/index') : next();
    } else {
      // 如果路径是 其他,判断是否登录
      islogin ? next() : next('/login');
    }
   


})

export default router
