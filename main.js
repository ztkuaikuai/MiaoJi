import App from './App'

import Vue from 'vue'
import './uni.promisify.adaptor'

// 引入uView主js库
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)


Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()