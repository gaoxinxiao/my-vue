
//1.实现一个插件
let Vue = null

class VueRouter {
    constructor(options) {
        this.$options = options
        let initial = window.location.hash.slice(1) //截取#后面的参数
        Vue.util.defineReactive(this, 'current', initial) //将current变量变为响应式
        window.addEventListener('hashchange', this.hashChange.bind(this))
    }
    hashChange() {
        this.current = window.location.hash.slice(1) //截取#后面的参数
    }
}

VueRouter.install = function (_vue) {
    //获取Vue在VueRouter中使用
    Vue = _vue
    //1.挂载实例 保证全局使用this调用$router 
    //使用全局mixin进行混入
    Vue.mixin({
        beforeCreate() {
            if (this.$options.router) {
                //首次实例化的时候会调用一次
                Vue.prototype.$router = this.$options.router
            }
        }
    })

    //2.注册全局组件
    Vue.component('router-link', {
        props: {
            to: {
                type: String,
                required: true
            }
        },
        //执行渲染函数
        render(h) {
            return h('a', { attrs: { href: `#${this.to}` } }, this.$slots.default)
        }
    })
    Vue.component('router-view', {
        render(h) {
            let Component = null
            let res = this.$router.$options.routes.find(v => v.path === this.$router.current)
            if (res.component) {
                Component = res.component
            }
            return h(Component)
        }
    })
}

export default VueRouter