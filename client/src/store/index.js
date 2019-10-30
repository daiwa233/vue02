import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)



export default new Vuex.Store({
  state: {
    userinfo: {}
  },
  mutations: {
    // 每个mutations的第一个参数都是state, 第二个参数是commit时的载荷
    initialize(state, user) {
      state.userinfo = user;
    },

    clear(state) {
      state.userinfo = {};
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    //每个getters的第一个参数都是state,
    userinfo: state => state.userinfo
  }
})
