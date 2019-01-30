import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

const home = r => require.ensure([], () => r(require('@/components/home')), 'home');
const support = r => require.ensure([], () => r(require('@/components/support')), 'echart');
const asktobuy = r => require.ensure([], () => r(require('@/components/asktobuy')), 'echart');
const complete = r => require.ensure([], () => r(require('@/components/complete')), 'echart');
const filterList = r => require.ensure([], () => r(require('@/components/filterList')), 'filterList');

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: home
    },
    {
      path: '/support',
      name: 'support',
      component: support
    },
    {
      path: '/asktobuy',
      name: 'asktobuy',
      component: asktobuy
    },
    {
      path: '/complete',
      name: 'complete',
      component: complete
    },
    {
      path: '/filterList',
      name: 'filterList',
      component: filterList
    },
  ]
})
