
let Vue = null

class VueRouter {
    constructor(options) {
        this.$options = options
        let inital = window.location.hash.slice(1)

        //监听路由的变化更新vue组件内部的render 函数  Current => hashChange => view
        //vue两种方式将数据变成响应式
        
        //将current变成可观察的数据（响应式）
        //1
        Vue.util.defineReactive(this,'current',inital)

        //2
        // this.state = new Vue({
        //     data() {
        //         return {
        //             current: inital
        //         }
        //     }
        // })
        window.addEventListener('hashchange', this.onHashChange.bind(this))
    }

    onHashChange() {
        let inital = window.location.hash.slice(1)
        //监听current变化更改的时候触发 render函数更新
        this.current = inital
        // this.state.current = inital
    }
}

//接收到vue的实例挂载到全局
VueRouter.install = function (_vue) {
    Vue = _vue

    //在这里可以通过 Vue.mixin做混入
    Vue.mixin({
        beforeCreate() {
            //挂载全局router 保证组件内部使用this可以调用到
            if (this.$options.router) {
                Vue.prototype.$router = this.$options.router
            }
        }
    })

    Vue.component('router-link', {
        props: {
            to: {
                type: String,
                required: true
            }
        },
        render(h) {
            return h('a', { attrs: { href: `#${this.to}` } }, this.$slots.default)
        }
    })
    Vue.component('router-view', {
        render(h) {
            let Component = null
            let currentRes = this.$router.$options.routes.find(v => v.path === this.$router.current)
            if (currentRes.component) Component = currentRes.component
            return h(Component)
        }
    })

}

export default VueRouter