<template>
  <div class="loading" v-show="show">
    <img class="plant rotate" :src="imageSrc" />
  </div>
</template>

<script>
export default {
  name: 'loading',
  data() {
    return {}
  },
  props: {
    show: {
      type: Boolean,
    },
    imageSrc: {
      default: require('../../assets/images/pai.gif'),
      type: String,
    },
  },
}
</script>

<style lang="scss" scoped>
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  .plant {
    width: 288px;
    animation: turn 2s linear infinite;
  }
}
</style>