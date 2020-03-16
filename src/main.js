import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import '@/libs'
import '@/assets/css/global.scss'
import '@/assets/css/transition.scss'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
