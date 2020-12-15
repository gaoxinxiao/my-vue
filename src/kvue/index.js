// 实现KVue构造函数
function defineReactive(obj, key, val) {
    // 如果val是对象，需要递归处理之
    observe(val)
    // 管家创建
    const dep = new Dep()

    Object.defineProperty(obj, key, {
        get() {
            // 依赖收集
            Dep.target && dep.addDep(Dep.target)
            return val
        },
        set(newVal) {
            if (val !== newVal) {
                // 如果newVal是对象，也要做响应式处理
                observe(newVal)
                val = newVal
                // 通知更新
                dep.notify()
            }
        }
    })
}
// 遍历指定数据对象每个key，拦截他们
function observe(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj
    }
    // 每遇到⼀个对象，就创建⼀个Observer实例
    // 创建⼀个Observer实例去做拦截操作
    new Observer(obj)
}
// proxy代理函数：让⽤户可以直接访问data中的key
function proxy(vm, key) {
    Object.keys(vm[key]).forEach(k => {
        Object.defineProperty(vm, k, {
            get() {
                return vm[key][k]
            },
            set(v) {
                vm[key][k] = v
            }
        })
    })
}
// 根据传⼊value类型做不同操作
class Observer {
    constructor(value) {
        this.value = value
        // 判断⼀下value类型
        // 遍历对象
        this.walk(value)
    }
    walk(obj) {
        Object.keys(obj).forEach(key => {
            defineReactive(obj, key, obj[key])
        })
    }
}
class KVue {
    constructor(options) {
        // 0.保存options
        this.$options = options
        this.$data = options.data
        // 1.将data做响应式处理
        observe(this.$data)
        // 2.为$data做代理
        proxy(this, '$data')
        // 3.编译模板
        // new Compile('#app', this)
        if (options.el) {
            this.$mount(options.el)
        }
    }
    $mount(el) {
        //执行updateComponent 
        this.$el = document.querySelector(el)
        const updateComponent = () => {
            //内部会执行渲染函数
            let { render } = this.$options
            // let el = render.call(this)
            // let parent = this.$el.parentElement
            // parent.insertBefore(el, this.$el.nextSibling)
            // parent.removeChild(this.$el)
            // this.$el = el

            let vnode = render.call(this, this.$createElement)
            this._update(vnode)
        }
        new Watcher(this, updateComponent)
    }

    //更新虚拟dom
    _update(vnode) {
        let prevNode = this._vnode

        if (!prevNode) {
            //初始化过程
            this.__patch__(this.$el, vnode)
        } else {
            //更新过程
            this.__patch__(prevNode, vnode)
        }
    }

    //虚拟dom更新计算
    __patch__(oldNode, vnode) {
        if (oldNode.nodeType) {
            //如果oldNode.nodeType存在证明是一个元素初始化更新
            let parent = oldNode.parentElement //宿主元素的 父元素
            let refElm = oldNode.nextSibling //相邻元素
            let el = this.createElm(vnode)

            //props 属性更新
            for (let key in vnode.props) {
                el.setAttribute(key, vnode.props[key])
            }
            parent.insertBefore(el, refElm)
            parent.removeChild(oldNode)
        } else {
            //props 属性更新
            let el = vnode.el = oldNode.el
            let oldNodeProps = oldNode.props || {}
            let newProps = vnode.props || {}
            for (let key in newProps) {
                el.setAttribute(key, newProps[key])
            }
            for (let key in oldNodeProps) {
                if (!(key in newProps)) {
                    el.removeAttribute(key)
                }
            }

            let oldCh = oldNode.children
            let newCh = vnode.children

            //如果新的children是string 证明是文本
            if (typeof newCh === 'string') {
                if (typeof oldCh === 'string') {
                    if (newCh !== oldCh) {
                        //纯文本更新
                        el.textContent = newCh
                    }
                } else {
                    //以前没有文本
                    el.textContent = newCh
                }
            } else {
                //如果老的是字符串那么清空把新的节点 添加进去
                if (typeof oldCh === 'string') {
                    oldCh.innerHTML = ''
                    newCh.forEach(child => {
                        el.appendChild(this.createElm(child))
                    })
                } else {
                    this.updateChildren(el, oldCh, newCh)
                }
            }

        }
        this._vnode = vnode
    }

    updateChildren(parentEl, oldCh, newCh) {
        //判断两个节点
        const len = Math.min(oldCh.length, newCh.length)
        for (let i = 0; i < len; i++) {
            this.__patch__(oldCh[i], newCh[i])
        }

        //newCh更长的那个，说明有新增
        if (newCh.length > oldCh.length) {
            newCh.slice(len).forEach(child => {
                const el = this.createElm(child)
                parentEl.appendChild(el)
            })
        } else if (newCh.length < oldCh.length) {
            oldCh.slice(len).forEach(child => {
                parentEl.removeChild(child.el)
            })
        }
    }

    //创建真实dom
    createElm(vnode) {
        let el = document.createElement(vnode.tag)
        if (vnode.children) {
            if (typeof vnode.children === 'string') {
                el.textContent = vnode.children
            } else {
                vnode.children.forEach(v => {
                    let child = this.createElm(v)
                    el.appendChild(child)
                })
            }
        }
        vnode.el = el
        return el
    }

    //将传进来的render函数转化成虚拟dom返回
    $createElement(tag, props, children) {
        return { tag, props, children }
    }

}
// 移除
// class Compile {}
class Watcher {
    constructor(vm, fn) {
        this.vm = vm
        this.getter = fn
        this.get()
    }
    get() {
        // 依赖收集触发
        Dep.target = this
        this.getter.call(this.vm)//调用产生依赖
        Dep.target = null
    }
    update() {
        this.get()
    }
}

// 管家：Watcher 对应多个dep
class Dep {
    constructor() {
        this.deps = new Set() // 管理传进来的watcher避免重复
    }
    addDep(watcher) {
        this.deps.add(watcher)
    }
    notify() {
        this.deps.forEach(watcher => watcher.update())
    }
}