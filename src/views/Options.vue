<template>
  <div class="box">
    <div class="right" @click="goPeriod">
      <p>FACTORY</p>
      <span>BID INTEREST RATES OVER A PERIOD</span>
      <span>OF 2 WEEKS OR A MONTH</span>
    </div>
    <div class="left" @click="goHistory">
      <p>HISTORY</p>
      <span>SEE BID HISTORY</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['Smile']),
  },
  data() {
    return {}
  },
  methods: {
    goPeriod() {
      this.$router.push({
        path: '/period',
      })
    },
    goHistory() {
      this.$router.push({
        path: '/history',
      })
    },
  },
}
</script>

<style scoped lang="scss">
@import '../style/mixin.scss';
.box {
  height: 100%;
  display: flex;
  @include font_color($font-color-theme);
  .right {
    width: 50%;
    display: flex;
    justify-content: center;
    // align-content: center;
    text-align: center;
    flex-direction: column;
    border-right: 1px solid #aaa9a9;
    cursor: pointer;
  }
  .right:hover {
    color: #5784c1;
  }
  .left {
    width: 50%;
    display: flex;
    justify-content: center;
    // align-content: center;
    flex-direction: column;
    text-align: center;
    border-left: 1px solid #aaa9a9;
    cursor: pointer;
  }
  .left:hover {
    color: #5784c1;
  }
  p {
    font-size: 24px;
  }
  span {
    font-size: 16px;
  }
}
</style>
