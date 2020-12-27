<template>
  <div id="kline" ref="kline" style="height: 100%">
    <div class="header">
      <span @click="showList" >123</span>
      {{ name }}
    </div>
    <div class="main" ref="main"></div>
    <List
      :show="listshow"
      @toggleShow="showList"
      @ChangeSymbol="ChangeSymbol"
      :pairName="pairName"
    />
  </div>
</template>

<script>
import List from "./list.vue";
export default {
  data() {
    return {
      listshow: false,
    };
  },

  components: {
    List,
  },

  methods: {
    showList() {
      if (this.listshow) {
        setTimeout(() => {
          this.listshow = false;
        }, 500);
      } else {
        this.listshow = true;
      }
    },
  },
};
</script>
<style scoped>
::-webkit-scrollbar {
  display: none;
}
#kline {
  width: 100%;
  height: 100%;
  background: #071724;
  overflow: hidden;
  padding-top: 10%;
  box-sizing: border-box;
}
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 5%;
  color: #f7f7f7;
  background: #131e30;
  z-index: 1001;
  display: flex;
  align-items: center;
  padding: 0 4%;
  > img:nth-of-type(1) {
    height: 14px;
  }
  > img:nth-last-of-type(1) {
    height: 14px;
    width: 18px;
    margin: 0 8px;
  }
}
.main {
  height: 100%;
  width: 100%;
  overflow-y: auto;
}
</style>
