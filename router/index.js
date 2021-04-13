import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    component: Home,
    children: [
      {
        path: '/',
        redirect: '/index',
      },
      {
        path: '/index',
        name: 'index',
        component: () => import('../views/Index.vue'),
        meta: {
          title: '主页',
        },
      },
      {
        path: '/PeriodEnd',
        name: 'PeriodEnd',
        component: () => import('../views/PeriodEnd.vue'),
        meta: {
          title: '主页',
        },
      },
      {
        path: '/markets',
        name: 'markets',
        component: () => import('../views/Markets.vue'),
        meta: {
          title: 'Markets',
          // requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: '/options',
        name: 'options',
        component: () => import('../views/Options.vue'),
        meta: {
          title: 'Options',
        },
      },
      {
        path: '/period',
        name: 'period',
        component: () => import('../views/Period.vue'),
        meta: {
          title: 'Period',
        },
      },
      {
        path: '/trading',
        name: 'trading',
        component: () => import('../views/Trading.vue'),
        meta: {
          title: 'Trading',
        },
      },
      {
        path: '/history',
        name: 'history',
        component: () => import('../views/History.vue'),
        meta: {
          title: 'History',
        },
      },
      {
        path: '/addMarket',
        name: 'addMarket',
        component: () => import('../views/AddMarket.vue'),
        meta: {
          title: 'AddMarket',
        },
      },
    ],
  },
  // {
  //   path: '/notFound',
  //   name: 'notFound',
  //   component: () => import('../views/404.vue'),
  // },
  // {
  //   path: '*',
  //   redirect: '/notFound',
  // },
]

const router = new VueRouter({
  saveScrollPosition: true,
  // mode: 'history',
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
})
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}
export default router
