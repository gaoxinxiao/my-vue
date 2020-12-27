<template>
  <div
    class="coinlist"
    v-if="show"
    @click.self="hideList"
    ref="list"
    :style="{ background: bgColor }"
  >
    <div :class="animationList"></div>
    Sdadasd
  </div>
</template>
<script>
export default {
  props: ["show"],
  data() {
    return {
      animationList: "list show",
      bgColor: "rgba(0,0,0,.5)",
    };
  },
  methods: {
    hideList() {
      this.animationList = "list hide";
      this.bgColor = "transparent"; // 遮罩层的背景色在显示动画中有颜色，消失时为透明
      this.$emit("toggleShow"); // 调用父组件的隐藏方法
      setTimeout(() => {
        // 设置延时是因为消失后需要重新定义方法，便于下一次出现时动画
        this.animationList = "list show";
        this.bgColor = "rgba(0,0,0,.5)";
      }, 501);
    },
  },
};
</script>
<style scoped>
.coinlist {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1002;
}
.show {
  animation: leftShow 0.5s;
}
.hide {
  animation: leftHide 0.5s;
}
@keyframes leftShow {
  0% {
    transform: translate(-100%, 0);
  }
  100% {
    transform: translate(0, 0);
  }
}
@keyframes leftHide {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-100%, 0);
  }
}
</style>
