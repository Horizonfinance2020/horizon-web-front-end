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
// import Router from 'vue-router'
// const routerPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//   return routerPush.call(this, location).catch(error=> error)
// }

Vue.use(ElementUI)
Vue.use(Loading)
Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')

window.document.documentElement.setAttribute(
  'data-theme',
  localStorage.getItem('data-theme') ? localStorage.getItem('data-theme') : ''
)
