<template>
  <div class="box">
    <div class="top">
      <div
        class="top-l"
        @click="goPeriod"
        @mousemove="setColor('one')"
        @mouseleave="remColor('one')"
      >
        <span
          :style="{'font-weight':tag==='one'? 'bold':'none',color:tags==='one'?'#5784c1':tag==='one'?'':'#707070'}"
        >FACTORY</span>
      </div>
      <div
        class="top-r"
        @click="goHistory"
        @mousemove="setColor('two')"
        @mouseleave="remColor('two')"
      >
        <span
          :style="{ 'font-weight':tag==='two'? 'bold':'none',color:tags==='two'?'#5784c1':tag==='two'?'':'#707070'}"
        >HISTORY</span>
      </div>
    </div>
    <div class="bom" :style="{width:steps}"></div>
  </div>
</template>

<script>
export default {
  props: {
    tag: {
      type: String,
      required: '',
    },
    steps: {
      type: String,
      required: '35%',
    },
  },
  data() {
    return {
      tags: null,
    }
  },
  methods: {
    setColor(item) {
      if (item !== this.tags) {
        this.tags = item
      }
    },
    remColor(item) {
      if (item === this.tags) {
        this.tags = null
      }
    },
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
  z-index: 101;
  height: 100px;
  width: 100%;
  top: 100px;
  min-width: 1290px;
  display: flex;
  position: fixed;
  @include bg_color($background-color-theme);
  flex-direction: column;
  justify-content: center;
  .top {
    display: flex;
    height: 90px;
    border-bottom: 1px solid #aaa9a9;
    .top-l,
    .top-r {
      width: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      @include font_color($font-color-theme);
      font-size: 24px;
      cursor: pointer;
    }
    .top-l {
      border-right: 1px solid #aaa9a9;
    }
    .top-r {
      border-left: 1px solid #aaa9a9;
    }
  }
  .bom {
    width: 35%;
    height: 10px;
    background-color: #5784c1;
    border-radius: 0 5px 5px 0;
  }
}
</style>
