<template>
  <div class="home">
    <el-container direction="vertical" style="height:100%">
      <el-header>
        <new-header />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
      <el-footer>
        <new-footer />
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import NewHeader from '@/components/NewHeader.vue'
import NewFooter from '@/components/NewFooter.vue'

export default {
  name: 'Home',
  components: {
    NewHeader,
    NewFooter,
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