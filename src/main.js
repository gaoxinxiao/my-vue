import Vue from 'vue'
import App from './App.vue'
// import router from './router'
// import router from './grouter'
import router from './wrouter'
// import store from './store'
// import store from './gstore'
import store from './wstore'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
