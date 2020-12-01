import Vue from 'vue'
import vueRouter from './gvue-router'
import Home from '../views/home.vue'
import List from '../views/list.vue'

//执行内部 install 方法 
Vue.use(vueRouter)

const routes = [{
    path: "/",
    name: "Home",
    component: Home
}, {
    path: "/list",
    name: "List",
    component: List
}]

export default new vueRouter({ routes })