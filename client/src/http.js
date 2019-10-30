
import axios from 'axios'

import { Loading } from 'element-ui';
import { Message } from 'element-ui';
import router from './router'
let loading;

const startLoading = () => {
  loading = Loading.service({
    lock: true,
    text: '拼命加载中...',
    background: 'rgba(0,0,0,.7)'

  })
}

const endLoading = () => {
  loading.close();
}

// 请求拦截
axios.interceptors.request.use((config) => {
  startLoading();
  // 如果是登录（即存在dvaTOKEN）状态，统一设置header,每次请求都携带token, 
  if (localStorage.dvaTOKEN) {
    config.headers.Authorization = localStorage.dvaTOKEN;
  }

  return config;
}, (err) => {
  Message({
    type: errro,
    message: '失败请检查网络重试',
    showClose: true
  })
  return Promise.reject(error);
})


// 响应拦截
axios.interceptors.response.use((response) => {
  endLoading();
  return response;
}, (error) => {
  endLoading();
  // 如果错误状态码是401,则代表token失效。
  const {status} = error.response;
  if (status == 401) {
    Message.error('长时间未操作,请重新登录');

    // 清除token
    localStorage.removeItem('dvaTOKEN');
    router.push('/login');
  }
  return Promise.reject(error);
})


export default axios;