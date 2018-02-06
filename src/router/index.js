import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Login from '@/components/Login'
import Room from '@/components/Room'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/room',
      name: 'room',
      component: Room
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
  ]
})
