<template>
  <div id="app">
    <router-link to="/">home</router-link>&
    <router-link to="/list">list</router-link>
    <p>getCount:{{ $store.getters.getCount }}</p>
    <p>getNum:{{ $store.state.num }}</p>
    <p @click="$store.commit('add')">getCount+</p>
    <p @click="$store.commit('addNum')">getNum+点击不应该打印执行</p>
    <router-view />
  </div>
</template>

<script>
// <p @click="num++">getNum++</p>
// <p @click="count++">getCount++</p>
export default {
  name: "App",
  data() {
    return {
      count: 1,
      num: 1,
    };
  },
  methods: {
    getCount() {
      console.log("count更新");
      return this.count;
    },
  },
  computed: {
    getNum() {
      console.log("num更新");
      return this.num;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
