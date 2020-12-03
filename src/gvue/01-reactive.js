
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

//将对象里的所有属性都变为响应 式
function observe(obj) {
    if (typeof obj !== 'object' || obj === null) return
    Object.keys(obj).forEach(key => {
        defineReactitive(obj, key, obj[key])
    })
}

let obj = {
    foo: 1,
    age: 2,
    baz: {
        a: 1
    }
}
observe(obj)
obj.foo
obj.foo = 111
obj.age
obj.age = 222
obj.baz
obj.baz.a


