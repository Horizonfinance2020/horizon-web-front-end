<template>
  <div class="box">
    <div class="left">
      <li @click="backHome">Horizon</li>
      <li @click="goopen('https://docs.horizon.finance/general/whitepaper')">Docs</li>
      <!-- <li>Code</li> -->
      <li @click="goopen('https://docs.horizon.finance/general/faq')">FAQ</li>
      <li class="last">THEME</li>
      <el-switch v-model="value" active-color="#13ce66" @change="changeTheme"></el-switch>
    </div>
    <div class="right">
      <li @click="goopen('https://twitter.com/Horizon_Fi')">
        <!-- <img :src="require('../assets/images/telegram-'+Theme+'.png')" alt /> -->
        <svg-icon iconClass="twitter" :style="{color:Theme==='theme1'?'#1f1f1f':'#e8e8e8'}"></svg-icon>
      </li>
      <li @click="goopen('https://t.me/HorizonFinance')">
        <svg-icon iconClass="telegram" :style="{color:Theme==='theme1'?'#1f1f1f':'#e8e8e8'}"></svg-icon>
      </li>
      <li @click="goopen('https://discord.com/invite/AmTaATR')">
        <svg-icon iconClass="discord" :style="{color:Theme==='theme1'?'#1f1f1f':'#e8e8e8'}"></svg-icon>
      </li>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  data() {
    return {
      value: false,
    }
  },
  computed: {
    ...mapState(['Theme']),
  },
  created() {
    this.value = this.Theme === 'theme1' ? false : true
  },
  methods: {
    ...mapMutations(['setTheme']),
    backHome() {
      this.$router.push({
        path: '/Index',
      })
    },
    goopen(val) {
      window.open(val, '_blank')
    },
    changeTheme(val) {
      const theme = val === true ? 'theme2' : 'theme1'
      localStorage.setItem('data-theme', theme)
      window.document.documentElement.setAttribute('data-theme', theme)
      this.setTheme(theme)
    },
  },
}
</script>

<style scoped lang="scss">
@import '../style/mixin.scss';
.box {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
}
.left {
  padding-left: 40px;
  li {
    font-size: 12px;
    font-weight: bold;
    @include font_color($font-color-theme);
    display: inline-block;
    line-height: 75px;
    margin-right: 80px;
    cursor: pointer;
  }
  li:hover {
    color: #5784c1;
  }
  .last {
    margin-right: 15px;
  }
}
.right {
  flex: 1;
  text-align: right;
  padding-right: 50px;
  li {
    display: inline-block;
    margin-right: 40px;
    cursor: pointer;
    .svg-icon {
      font-size: 24px;
    }
    .svg-icon :hover {
      color: #5784c1;
    }
  }
}
</style>
