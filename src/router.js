import Vue from 'vue'
import Router from 'vue-router'
import IviewTable from './components/IviewTable.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'iview-table',
      component: IviewTable
    }
  ]
})
