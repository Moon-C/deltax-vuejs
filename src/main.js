import Vue from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import axios from 'axios'
import Vuelidate from 'vuelidate'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(Vuelidate)

axios.defaults.baseURL = 'http://localhost:3000';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
