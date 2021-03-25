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
          // requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: '/PeriodEnd',
        name: 'PeriodEnd',
        component: () => import('../views/PeriodEnd.vue'),
        meta: {
          title: '主页',
          // requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: '/marktes',
        name: 'marktes',
        component: () => import('../views/Marktes.vue'),
        meta: {
          title: 'Marktes',
          // requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: '/options',
        name: 'options',
        component: () => import('../views/Options.vue'),
        meta: {
          title: 'Options',
          // requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: '/period',
        name: 'period',
        component: () => import('../views/Period.vue'),
        meta: {
          title: 'Period',
          // requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: '/trading',
        name: 'trading',
        component: () => import('../views/Trading.vue'),
        meta: {
          title: 'Trading',
          // requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: '/history',
        name: 'history',
        component: () => import('../views/History.vue'),
        meta: {
          title: 'History',
          // requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: '/addMarket',
        name: 'addMarket',
        component: () => import('../views/AddMarket.vue'),
        meta: {
          title: 'AddMarket',
          // requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
    ],
  },
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
