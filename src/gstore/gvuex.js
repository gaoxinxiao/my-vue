let Vue = null;

class Store {
  constructor(options) {
    this.$options = options;
    this._mutations = options.mutations
    this._actions = options.actions
    this._getters = options.getters
    //通过new Vue实现响应式
    //包装一层防止外部直接修改
    this._vm = new Vue({
      data: {
        $$state: options.state
      }
    });
    this.state = this._vm._data.$$state;
    this.commit = this.commit.bind(this);
    this.dispatch = this.dispatch.bind(this);

    this.getters = new Proxy({}, {
      get: (target, key) => {
        let entry = options.getters[key].bind(this)
        return entry(this.state)
      }
    })
    
  }

  commit(type, payload) {
    let entry = this._mutations[type];
    if (!entry) {
      console.log("不要瞎写commit函数");
      return;
    }
    entry(this._vm._data.$$state, payload);
  }

  dispatch(type, payload) {
    let entry = this._actions[type];
    if (!entry) {
      console.log("不要瞎写dispatch函数");
      return;
    }
    entry(this, payload);
  }
}

function install(_vue) {
  Vue = _vue;

  //混入
  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store;
      }
    }
  });
}

export default { install, Store };
