<template>
  <div class="box">
    <div class="left">
      <p>Coming soon.</p>
      <button class="logo_btn" @click="back">GO BACK</button>
    </div>
    <div class="right"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
  },
}
</script>

<style scoped lang="scss">
@import '../style/mixin.scss';
.box {
  display: flex;
  height: 100%;
}
.left {
  width: 45%;
  height: 100%;
  padding-left: 100px;
  min-height: 600px;
  min-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  p {
    font-size: 54px;
    letter-spacing: 0px;
    @include font_color($font-color-theme);
  }
  .logo_btn {
    margin: 50px 0 30px 0;
    font-size: 24px;
    font-weight: bold;
    @include bg_color($background-color-theme);
    border: 2px solid;
    @include font_color($font-color-theme);
    @include btnbor_color($button-border-color-theme);
    width: 500px;
    height: 76px;
    line-height: 70px;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.06);
    text-align: center;
    border-radius: 50px;
    outline: none;
    cursor: pointer;
  }
  .logo_btn:hover {
    @include idxbtnfont_color($idxfont-button-color-theme);
    @include idxbtnbg_color($button-background-color-theme);
    border: none;
  }
}
.right {
  height: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  .imgs {
    width: 400px;
    height: 100%;
  }
}
</style>
