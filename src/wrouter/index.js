import Vue from 'vue'
import VueRouter from './wvue-router.js'
import Home from '../views/home.vue'
import List from '../views/list.vue'

//会调用内部 install 方法 注册全局Vue 并且 保证全局可以调用 this.$router
Vue.use(VueRouter)

const routes = [{
    path: "/",
    name: "Home",
    component: Home
}, {
    path: "/list",
    name: "List",
    component: List
}]

export default new VueRouter({
    routes
})