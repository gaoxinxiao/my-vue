
//1.实现一个插件
let Vue = null

class VueRouter {
    constructor(options){
        this.$options = options
    }
}

VueRouter.install = function (_vue) {
    //获取Vue在VueRouter中使用
    Vue = _vue

    //1.挂载实例 保证全局使用this调用$router 
    //使用全局mixin进行混入
    Vue.mixin({
        beforeCreate() {
            if(this.$options.router){
                //首次实例化的时候会调用一次
                Vue.prototype.$router = this.$options.router
            }
        }
    })

    //2.注册全局组件

    Vue.component('router-link',{
        //执行渲染函数
        render(h){
            return h('a','router-link')
        }
    })
    Vue.component('router-view',{
        render(h){
            return h('div','router-view')
        }
    })
}

export default VueRouter