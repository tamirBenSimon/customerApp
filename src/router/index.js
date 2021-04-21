import Vue from 'vue'
import VueRouter from 'vue-router'
import dashbord from '../views/Dashbord.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
  path: '/dashbord',
  name: 'Dashbord',
  component: dashbord
},
  {
  path: '/',
  name: 'Login',
  component: Login
}

]

const router = new VueRouter({
  routes
})
export default router
