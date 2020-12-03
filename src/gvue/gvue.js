
//将传进来的数据变为响应式数据
function defineReactitive(obj, key, val) {
    // if (typeof val === 'object' && val !== null) observe(val)
    observe(val)
    Object.defineProperty(obj, key, {
        get() {
            console.log('获取值', key)
            return val
        },
        set(v) {
            if (v !== val) {
                console.log('设置值', key)
                val = v
                //最后设置的时候更新组件的update函数
            }
        }
    })
}

//将对象里的所有属性都变为响应式
function observe(obj) {
    if (typeof obj !== 'object' || obj === null) return
    //判断进来的参数是数组还是对象针对不同的类型添加对应的响应式
    new Observer(obj)

}

class Observer {
    constructor(obj) {
        this.value = obj
        if (Array.isArray(obj)) {
            //数组的情况改天在处理
        } else {
            this.walk(obj)
        }
    }

    walk(obj) {
        Object.keys(obj).forEach(key => {
            defineReactitive(obj, key, obj[key])
        })
    }
}

//将$data的key代理到vm上去，用户可以直接使用
function proxy(vm) {
    console.log(vm,'vm')

    Object.keys(vm.$data).forEach(key => {
        Object.defineProperty(vm, key, {
            get() {
                return vm.$data[key]
            },
            set(val) {
                vm.$data[key] = val
            }
        })
    })
}

class Gvue {
    constructor(options) {
        this.$options = options
        this.$data = options.data
        //1.Observe
        // observe(this.$data)

        //1.1 代理
        proxy(this)
        //2.Compile
    }
}