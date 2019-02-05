import Vue from 'vue'
import Router from 'vue-router'
import Listings from './views/Listings.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'listings',
      component: Listings,
    },
    {
      path: '/add',
      name: 'addEntry',
      component: () => import(/* webpackChunkName: "addEntry" */ './views/FormView.vue')
    },
    {
      path: '/edit/:id',
      name: 'editEntry',
      component: () => import(/* webpackChunkName: "editEntry" */ './views/FormView.vue')
    }
  ]
})
