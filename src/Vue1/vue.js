


/**
 * 1.observe 初始化将数据变为响应式
 * 2.proxy 将响应式数据暴露到vue实例上
 * 3.compiler 编译 并且 将更新函数放到对应的 dep上
 * 更新关系 dep对应多个watcher 最后调用update更新
 * dep = [watcher]
*/


function defineReactive(obj, key, val) {
    observe(val)
    let dep = new Dep(obj, key)
    Object.defineProperty(obj, key, {
        get() {
            // console.log(key, 'key')

            Dep.target && dep.addDep(Dep.target)
            
            return val
        },
        set(v) {
            //如果传进来的数据 是新的才做响应式
            if (v !== val) {
                // console.log(v, '更新')
                val = v
                dep.notify()
            }
        }
    })
}

function observe(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return null
    }

    new Observe(obj)
}

function proxy(vm, data) {
    Object.keys(data).forEach(key => {
        Object.defineProperty(vm, key, {
            get() {
                return data[key]
            },
            set(newVal) {
                data[key] = newVal
            }
        })
    })
}

class Comiler {
    constructor(vm, el) {
        this.$vm = vm
        this.$el = document.querySelector(el)

        if (this.$el) {
            //初始化模板
            this.compile(this.$el)
        }
    }
    isElement(node) {
        return node.nodeType === 1
    }
    isInterpolation(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }
    compile(el) {
        let nodeList = Array.from(el.childNodes)
        nodeList.forEach(node => {
            if (this.isElement(node)) {
                //元素节点
                this.compileElement(node)
            } else if (this.isInterpolation(node)) {
                //内容节点
                this.compileText(node)
            }
            if (node.childNodes && node.childNodes.length) {
                this.compile(node)
            }
        })
    }
    isDirective(attr) {
        return attr.indexOf('v-')
    }
    compileElement(node) {
        Array.from(node.attributes).forEach(attr => {
            let attrName = attr.name
            let exp = attr.value
            if (this.isDirective(attrName) !== -1) {
                let dir = attrName.substring(2)
                this[dir] && this[dir](node, exp)
            }
        })
    }
    update(node, key, type) {
        //1.初始化数据
        let fn = this[type + 'Update']
        fn && fn(node, this.$vm[key])
        //2.将更新函数放到watcher中
        new Watcher(this.$vm, key, function (val) {
            fn && fn(node, val)
        })

    }
    textUpdate(node, val) {
        node.textContent = val
    }
    text(node, exp) {
        this.update(node, exp, 'text')
    }
    html(node, exp) {
        this.update(node, exp, 'html')
    }
    htmlUpdate(node, val) {
        node.innerHTML = val
    }
    compileText(node) {
        let exp = RegExp.$1
        this.update(node, exp, 'text')
    }
}

class Observe {
    constructor(data) {
        if (Array.isArray(data)) {
            //数组行为
        } else {
            //对象
            this.walk(data)
        }
    }
    walk(data) {
        Object.keys(data).forEach(key => {
            defineReactive(data, key, data[key])
        })
    }
}

class Dep {
    constructor(vm, key) {
        this.deps = []
    }

    addDep(dep) {
        this.deps.push(dep)
    }

    notify() {
        this.deps.forEach(watcher => watcher.update())
    }
}

class Watcher {
    constructor(vm, key, updatFn) {
        this.vm = vm
        this.key = key
        this.updatFn = updatFn
        
        Dep.target = this
        vm[key]
        Dep.target = null

    }

    update() {
        this.updatFn.call(this, this.vm[this.key])
    }

}

class Vue {
    constructor({ el, data }) {
        this.$el = el
        this.$data = data
        //1.初始化数据将数据变为响应式

        observe(data)

        //2.将数据代理到Vue实例

        proxy(this, data)

        //3.compiler编译

        new Comiler(this, el)
    }
}
