<template>
  <div class="home">
    <el-container direction="vertical" style="height:100%">
      <el-header>
        <header-bar />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
      <el-footer>
        <footer-bar />
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import HeaderBar from '@/components/HeaderBar.vue'
import FooterBar from '@/components/FooterBar.vue'

export default {
  name: 'Home',
  components: {
    HeaderBar,
    FooterBar,
  },
  methods: {
    changeTheme(theme) {
      localStorage.setItem('data-theme', theme)
      window.document.documentElement.setAttribute('data-theme', theme)
    },
  },
}
</script>
<style scoped lang="scss">
@import '../style/mixin.scss';
.home {
  height: 100%;
  min-width: 1290px;
}
.el-header,
.el-main,
.el-footer {
  padding: 0;
  @include bg_color($background-color-theme);
}
.el-header {
  height: 100px !important;
  border-bottom: 1px solid #aaa9a9;
}
.el-footer {
  height: 80px !important;
  border-top: 1px solid #aaa9a9;
}

.el-main::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
</style>