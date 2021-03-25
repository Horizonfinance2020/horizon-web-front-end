<template>
  <div class="box">
    <div class="body">
      <div class="one-card" @click="gooptions('yyCRV')">
        <div class="top">
          <span>yyCRV in your wallet</span>
          <br />
          <span>{{BalanceOf}}</span>
        </div>
        <div class="center">
          <svg-icon iconClass="yyCRV"></svg-icon>
        </div>
        <div class="bottom">yyCRV market ➜</div>
      </div>
      <div class="two-card" @click="gooptions('xSushi')">
        <div class="top">
          <span>xSushi in your wallet</span>
          <br />
          <span>{{SuBalanceOf}}</span>
        </div>
        <div class="center">
          <svg-icon iconClass="xSushi" style="font-size:104px"></svg-icon>
        </div>
        <div class="bottom">xSushi market ➜</div>
      </div>
      <div class="last-card" @click="addMarkte">
        <div class="top"></div>
        <div class="center">
          <img class="logo" :src="require('../assets/images/add-'+Theme+'.png')" alt />
        </div>
        <div class="bottom">
          <span>Vote for the next</span>
          <br />
          <span>market on Horizon</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { getIEBF } from '@/common/web3'
import { BigNumber } from 'bignumber.js'
export default {
  computed: {
    ...mapState(['Theme', 'BalanceOf', 'SuBalanceOf']),
  },
  data() {
    return {
      balanceOf: 0,
    }
  },
  created() {
    this.setSmile('')
    this.setIsMar(true)
  },
  methods: {
    ...mapMutations(['setSmile', 'setIsMar', 'setBalanceOf']),
    gooptions(val) {
      localStorage.setItem('Smile', val)
      this.setSmile(val)
      this.$router.push({
        path: '/options',
      })
    },
    addMarkte() {
      this.$router.push({
        path: '/addMarket',
      })
    },
  },
}
</script>

<style scoped lang="scss">
@import '../style/mixin.scss';
.box {
  box-sizing: border-box;
  margin: 40px 70px;
  height: calc(100% - 80px);
  width: calc(100% - 140px);
  @include bg_color($background-color-theme);
  .body {
    height: 100%;
    display: flex;
    .one-card,
    .two-card,
    .last-card {
      width: 20%;
      // min-width: 400px;
      width: 400px;
      margin-right: 50px;
      border-radius: 10px;
      cursor: pointer;
    }
    .one-card,
    .two-card {
      background-color: #5784c1 !important;
      border: 1px solid #5784c1;
      display: flex;
      flex-direction: column;
      .center {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 150px;
      }
      .bottom {
        height: 60px;
        text-align: center;
        font-size: 24px;
      }
      .iconfont {
        font-size: 120px;
      }
    }
    .two-card {
      background-color: #be5b5f !important;
      border: 1px solid #be5b5f;
    }
    .last-card {
      border: 2px solid #aaa9a9;
      display: flex;
      flex-direction: column;
      .center {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .bottom {
        height: 80px;
        text-align: center;
        font-size: 24px;
        @include font_color($font-color-theme);
      }
      .iconfont {
        font-size: 120px;
      }
    }
  }
}
.top {
  height: 40px;
  padding: 30px 0 0 30px;
  span {
    font-size: 24px;
  }
}
.logo {
  width: 95px;
}
.one-card:hover,
.two-card:hover,
.last-card:hover {
  -webkit-box-shadow: 4px 4px 6px #969696;
  -moz-box-shadow: 4px 4px 6px #969696;
  box-shadow: 4px 4px 6px #969696;
}
</style>
