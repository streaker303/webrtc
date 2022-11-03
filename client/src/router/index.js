import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/teacher',
    name: 'teacher',
    component: () => import(/* webpackChunkName: "about" */ '../views/teacher.vue')
  },
  {
    path: '/student',
    name: 'student',
    component: () => import(/* webpackChunkName: "about" */ '../views/student.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
