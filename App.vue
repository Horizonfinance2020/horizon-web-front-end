<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'App',
  created() {
    const theme = localStorage.getItem('data-theme')
      ? localStorage.getItem('data-theme')
      : 'theme1'
    localStorage.setItem('data-theme', theme)
    const smile = localStorage.getItem('Smile')
      ? localStorage.getItem('Smile')
      : ''
    localStorage.setItem('Smile', smile)
    const isMar = localStorage.getItem('IsMar')
      ? localStorage.getItem('IsMar')
      : false
    localStorage.setItem('IsMar', isMar)
    const isExits = localStorage.getItem('IsExits')
      ? localStorage.getItem('IsExits')
      : 'no'
    localStorage.setItem('IsExits', isExits)
    const Pending = localStorage.getItem('Pending')
      ? JSON.parse(localStorage.getItem('Pending'))
      : []
    localStorage.setItem('Pending', JSON.stringify(Pending))
    this.setTheme(theme)
    this.setSmile(smile)
    this.setIsMar(isMar)
    this.setIsExits(isExits)
    this.setPending(Pending)
  },
  methods: {
    ...mapMutations([
      'setTheme',
      'setSmile',
      'setIsMar',
      'setIsExits',
      'setNetwork',
      'setPending',
    ]),
  },
}
</script>

<style lang="scss">
@import './style/mixin.scss';
html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  font-family: Archivo;
  .el-dropdown-menu__item:hover {
    background-color: transparent !important;
    color: #5784c1 !important;
  }
  .el-notification {
    @include table_color($background-table-color-theme);

    border: none;
    .el-notification__title {
      @include font_color($font-color-theme);
    }
    .el-notification__content {
      @include font_color($font-color-theme);
    }
  }
  .el-dialog {
    @include table_color($background-table-color-theme);
    .home {
      @include font_color($font-color-theme);
    }
    .el-dialog__body {
      @include font_color($font-color-theme);
    }
  }
}
</style>
