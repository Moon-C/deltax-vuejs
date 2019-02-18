import Vue from 'vue'
import router from './router'
import App from './App.vue'
import store from './store'
import iView from 'iview'
import BootstrapVue from 'bootstrap-vue'
import 'iview/dist/styles/iview.css'

Vue.use(iView)
Vue.use(BootstrapVue)

Vue.config.productionTip = false

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
