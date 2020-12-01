<template>
  <div id="app">
    <router-link to="/">home</router-link>&
    <router-link to="/list">list</router-link>
    <p @click="$store.commit('add')">{{ $store.state.count }}</p>
    <p @click="$store.dispatch('add')">async:{{ $store.state.count }}</p>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
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
