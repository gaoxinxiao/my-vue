import Vue from "vue";
import Vuex from "./gvuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 1,
    num: 1,
  },
  mutations: {
    add(state) {
      state.count++;
      state.num++
    }
  },
  actions: {
    add({ commit }) {
      setTimeout(() => {
        commit("add");
      }, 1000);
    }
  },
  getters: {
    getCount(state) {
      return state.count * 2;
    },
    getNum(state) {
      return state.num * 3;
    }
  }
});
