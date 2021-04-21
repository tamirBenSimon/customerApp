import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import jquery from 'jquery'
import xlsx from 'xlsx'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VuePapaParse from 'vue-papa-parse'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import VueSidebarMenu from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store'


Vue.use(VueSidebarMenu)
Vue.use(VuePapaParse)
Vue.use(IconsPlugin)
Vue.use(BootstrapVue)
Vue.use(ElementUI)
Vue.use(jquery)
Vue.use(xlsx)
Vue.use(VueAxios, axios)

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
