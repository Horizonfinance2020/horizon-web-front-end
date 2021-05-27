import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './icons'
import axios from 'axios'
import Loading from './components/loading'
import './assets/font/font.css'
import { msg } from './components/message'
// import Router from 'vue-router'
// const routerPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//   return routerPush.call(this, location).catch(error=> error)
// }
Vue.mixin(msg)
Vue.use(ElementUI)
Vue.use(Loading)
Vue.prototype.$axios = axios

Vue.config.productionTip = false

// 时间过滤：
Vue.filter('MathFloor', val => {
  if (!val) return 0
  return Math.floor(Number(val)*1000)/1000
})

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')

window.document.documentElement.setAttribute(
  'data-theme',
  localStorage.getItem('data-theme') ? localStorage.getItem('data-theme') : ''
)
