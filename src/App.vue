<template>
  <div id="app">
    <router-link to="/">home</router-link>&
    <router-link to="/list">list</router-link>

    <p>getNum:{{ getNum }}</p>
    <p>getCount:{{ getCount() }}</p>
    <p @click="num++">getNum++</p>
    <p @click="count++">getCount++</p>

    <router-view />
  </div>
</template>

<script>
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
      console.log('count更新')
      return this.count;
    },
  },
  computed: {
    getNum() {
      console.log('num更新')
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
