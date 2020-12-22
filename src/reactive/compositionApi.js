
/**
 * step1 当响应式数据被触发的时候 做依赖收集把相关要更新的 effect 放到 更新栈中
 * step2 set的时候触发 更新栈中的effect执行
*/

// {
//     targetMap:{
//         key:[effect]
//     }
// }

const isObject = v => typeof v === 'object' && v !== null

//创建 reactive
function reactive(obj) {
    if (typeof obj !== 'object' && obj != null) {
        return obj
    }
    return new Proxy(obj, {
        get(target, key) {
            console.log(key, 'get')
            const res = Reflect.get(target, key)
            track(target, key)
            return isObject(res) ? reactive(res) : res
        },
        set(target, key, value) {
            console.log(key, 'set')
            Reflect.set(target, key, value)
            trigger(target, key, value)
        }
    })
}


let effectStack = []// 存放effect

//当响应式数据更新的时候，触发此函数
function effect(fn, options) {
    let e = createEffect(fn, options)
    e()
    return e
}

function createEffect(fn, options) {
    //1.封装高阶函数createEffect 
    //2.处理异常错误
    //3.将 effect 放入到 effectStack中

    const effect = () => {
        if (!effectStack.includes(effect)) {
            try {
                effectStack.push(effect)
                return fn()
            } finally {
                effectStack.pop() //执行完弹出当前effect
            }
        }
    }
    return effect
}

let targetMap = new WeakMap()


//get的时候触发 做依赖收集
function track(target, key) {
    let effect = effectStack[effectStack.length - 1]

    if (effect) {
        // 获取target映射关系map，不存在则创
        let depMap = targetMap.get(target)
        if (!depMap) {
            depMap = new Map()
            targetMap.set(target, depMap)
        }
        // 获取key对应依赖集合，不存在则创建
        let deps = depMap.get(key)
        if (!deps) {
            deps = new Set()
            depMap.set(key, deps)
        }
        //依赖收集完成
        deps.add(effect)
    }

}

//set的时候触发 effect执行
function trigger(target, key) {
    let depMap = targetMap.get(target)
    if (!depMap) return

    let deps = depMap.get(key)
    if (deps) deps.forEach(e => e())
}
