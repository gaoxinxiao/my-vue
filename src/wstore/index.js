import Vue from 'vue'
import Vuex from './wvuex.js'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        count: 1,
        num:1
    },
    mutations: {
        add(state) {
            state.count++
        },
        addNum(state) {
            state.num++
        }
    },
    actions: {
        add({ commit }) {
            setTimeout(() => {
                commit('add')
            }, 1000)
        }
    },
    getters: {
        getCount(state) {
            console.log('执行')
            return state.count * 2
        }
    }
})