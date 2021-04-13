<template>
  <div class="home">
    <el-dialog
      :visible.sync="dialogVisible"
      :width="diaWidth"
      :before-close="handleClose"
      :fullscreen="fullscreen"
      :title="title"
      :top="'30vh'"
      height="300px"
      center
    >
      <slot />
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    diaWidth: {
      type: String,
      default: '40%',
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {}
  },
  methods: {
    handleClose(done) {
      this.$emit('closeMain', false)
    },
  },
}
</script>
<style lang="scss" scoped>
@import '../style/mixin.scss';
.home {
  height: 100%;
  width: 100%;
  position: absolute;
}
/deep/ .el-dialog {
  border-radius: 26px !important;
  @include bg_color($background-color-theme);
  @include font_color($font-color-theme);
}
/deep/ .el-dialog__body {
  padding: 25px 10px;
}
.submit_button {
  width: 120px;
  border-radius: 30px;
}
.dialog-box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  img {
    width: 20%;
    padding: 30px;
  }
  li {
    list-style-type: none;
    font-size: 1.8vw;
    color: rgba(86, 101, 112, 1);
  }
}
</style>
