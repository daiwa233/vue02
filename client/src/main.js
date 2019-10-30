import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import axios from './http'
import VueAxios from 'vue-axios'

import moment from 'moment'


// axios 的全局配置
axios.defaults.withCredentials = true; // 允许携带cookie
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// 注册一个全局的时间过滤器，过滤当前时间为早 中 晚  
Vue.filter('dateFormat', (date) => {
  
  const hours = new Date(date).getHours();
  
  if (hours>6 && hours<= 12) {
    return '早上好!';
  }else if(hours>12 && hours<=18) {
    return '下午好!';
  } else if (hours>18 && hours<=22) {
    return '晚上好!';
  } else if(hours>22 && hours<=3){
    return '深夜好!';
  }else{
    return '凌晨好！'
  }
  
})

// 输出当前时间yyyy-mm-dd hh-mm-ss
Vue.filter('dateFormat2', (date) => {
  
  return moment(date).format('YYYY-MM-DD HH:mm:ss')
})

Vue.use(VueAxios, axios)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
