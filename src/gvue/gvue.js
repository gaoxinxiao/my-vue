

//将传进来的数据变为响应式数据
function defineReactitive(obj, key, val) {
    // if (typeof val === 'object' && val !== null) observe(val)
    let dep = new Dep() //通过闭包的思想为每一个依赖创建一个自己的dep
    observe(val)
    Object.defineProperty(obj, key, {
        get() {
            //收集依赖
            Dep.target && dep.addDep(Dep.target)
            return val
        },
        set(v) {
            if (v !== val) {
                val = v
                //给依赖赋值的时候触发当前依赖对应的更新函数
                dep.notify()
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
        this.$methods = options.methods
        //1.Observe
        observe(this.$data)

        //1.1 代理
        proxy(this)
        //2.Compile进行初始化渲染dom
        new Compiler(this.$options.el,this)
    }
}

class Compiler{
    constructor(el,vm){
        let node = document.querySelector(el)
        this.$vm = vm
        this.compile(node)
    }
    compile(el){
        //childNodes 获取当前元素的所有子节点
        el.childNodes.forEach(node =>{
            //根据不同元素做处理 1 标签元素 3 文本内容
            if(node.nodeType === 1){
                //处理 标签元素
                this.compileElement(node)
                if(node.childNodes.length){
                    this.compile(node)
                }
            } else if(this.idInter(node)){
                //判断是否是插值元素{{}}
                this.compileText(node)
            }
        })
    }
    idInter(node){
        return node.nodeType === 3 && /{\{(.*)\}\}/.test(node.textContent)
    }
    //1 初始化依赖 2.创建其对应的更新函数
    update(node,exp,dir){
        //1初始化
        let fn = this[dir+'Update']
        fn && fn(node, this.$vm[exp])
        //2创建更新函数
        new Watcher(this.$vm,exp,function(val){
            //通过闭包的方式设置当前依赖的更新函数
            fn && fn(node, val)
        })
    }
    compileText(node){
        this.update(node,RegExp.$1,'text')
    }
    textUpdate(node,val){
        node.textContent = val
    }
    isDir(dir){
        //startWith获取字符串前缀
        return dir.startsWith('g-')
    }
    compileElement(node){
        let attrList = node.attributes
        Array.from(attrList).forEach(attr=>{
            let name = attr.name
            let exp = attr.value
            //根据前缀判断是否是默认指令
            if(this.isDir(name)){
                let dir = name.slice(2)
                this[dir] && this[dir](node,exp)
            }
            if(name ==='@click'){
                this.click(node,exp)
            }
        })
    }
    //数据双向绑定
    modal(node,exp){
        this.update(node,exp,'modal')
        node.addEventListener('input',(e)=>{
            this.$vm[exp] =e.target.value
           // this.modalUpdate(node,e.target.value)
        })
    }
    modalUpdate(node,val){
        node.value = val
    }
    click(node,exp){
        this.update(node,exp,'click')
        node.addEventListener('click',()=>{
            this.$vm.$methods[exp].call(this.$vm)
        })
    }
    //做一件事给带指令的标签赋值
    text(node,exp){
        this.update(node,exp,'text')
    }

    html(node,exp){
        this.update(node,exp,'html')
    }
    htmlUpdate(node,val){
        node.innerHTML=val
    }
}

//创建watcher用来监听页面中的依赖
class Watcher{
    constructor(vm,key,updateFn){
        this.vm = vm 
        this.key = key
        this.updateFn = updateFn
        //在get触发的时候创建dep和watcher之间的关系
        Dep.target = this // 源码里面就是这样写的(也可以创建一个全局变量)
        this.vm[key] //获取一下get的值相当于就会触发get
        Dep.target = null
    }

    update(){
        this.updateFn.call(this.vm,this.vm[this.key])
    }
}

//创建一个dep和watcher之间产生关系
class Dep{
    constructor(){
        this.deps = []
    }
    addDep(vm){
        this.deps.push(vm)
    }
    notify(){
        this.deps.forEach(fn=> fn.update())
    }
}