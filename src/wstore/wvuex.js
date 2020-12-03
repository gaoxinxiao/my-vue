
let Vue = null //存取全局vue实例 


class Store {
    constructor(options) {
        this.$options = options
        this._mutations = options.mutations
        this._actions = options.actions
        this._getters = options.getters
        let computed = {}

        Object.keys(this._getters).forEach(key => {
            let entry = this._getters[key]
            computed[key] = () => {
                return entry(this.state)
            }
        })

        this.getters = new Proxy({}, {
            get: (target, key) => {
                return this._vm[key]
            }
        })

        //标明为私有属性
        this._vm = new Vue({
            data() {
                return {
                    $$state: options.state
                }
            },
            computed:{
                ...computed,
                getAA(){
                    return 1
                }
            }
        })
     
        this.commit = this.commit.bind(this)
        this.dispatch = this.dispatch.bind(this)
    }

    get state() {
        return this._vm._data.$$state
    }

    commit(type, payload) {
        let entry = this._mutations[type]
        if (!entry) {
            console.log('不要瞎写函数')
            return
        }
        entry(this._vm._data.$$state, payload)
    }

    dispatch(type, payload) {
        let entry = this._actions[type]
        if (!entry) {
            console.log('不要瞎写函数')
            return
        }
        entry(this, payload)
    }
}

function install(_vue) {
    Vue = _vue //获取vue实例 在外部调用 Vue.use的时候会调用这个方法

    //使用Vue.mixin进行混入

    Vue.mixin({
        beforeCreate() {
            if (this.$options.store) {
                Vue.prototype.$store = this.$options.store
            }
        }
    })
}

export default { Store, install }