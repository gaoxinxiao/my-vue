import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home.vue'
import List from '../views/list.vue'

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


export default new VueRouter({ routes }) 