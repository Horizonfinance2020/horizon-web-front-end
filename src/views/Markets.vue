<template>
  <div class="box">
    <div class="body">
      <div v-for="(val,key,idx) in BalanceOf" :key="idx" :class="`${key}-card`">
        <div class="top" @click="gooptions(key)">
          <span>{{key}} in your wallet</span>
          <br />
          <span>{{val|MathFloor}}</span>
        </div>
        <div class="center" @click="gooptions(key)">
          <svg-icon :iconClass="key" style="font-size:80px"></svg-icon>
        </div>
        <span class="bottom" @click="goOpen(key)"><span class="exchange">GET {{key}} ➜</span></span>
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
  import {
    mapState,
    mapMutations
  } from 'vuex'
  import {
    getIEBF
  } from '@/common/web3'
  import {
    BigNumber
  } from 'bignumber.js'
  export default {
    computed: {
      ...mapState(['Theme', 'BalanceOf']),
    },
    data() {
      return {
        url: {
          xSushi: 'https://app.sushi.com/stake',
          yyCRV: 'https://v1.yearn.finance/vaults',
          yvUSDC:'https://yearn.finance/vaults/0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9'
        }
      }
    },
    created() {
      this.setSmile('')
      this.setIsMar(true)
    },
    methods: {
      ...mapMutations(['setSmile', 'setIsMar', 'setBalanceOf']),
      goOpen(val) {
        const Win = window.open()
        Win.opener = null
        Win.location = this.url[val]
      },
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

      .yyCRV-card,
      .xSushi-card,
      .yvUSDC-card,
      .last-card {
        width: 20%;
        // min-width: 400px;
        width: 400px;
        margin-right: 50px;
        border-radius: 10px;
        cursor: pointer;
      }

      .yyCRV-card,
      .xSushi-card,
       .yvUSDC-card {
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

      .xSushi-card {
        background-color: #be5b5f !important;
        border: 1px solid #be5b5f;
      }
       .yvUSDC-card{
          background-color: #CBAB54 !important;
        border: 1px solid #CBAB54;
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

  .yyCRV-card:hover,
  .xSushi-card:hover,
  .last-card:hover {
    -webkit-box-shadow: 4px 4px 6px #969696;
    -moz-box-shadow: 4px 4px 6px #969696;
    box-shadow: 4px 4px 6px #969696;
  }

  .exchange:hover {
    color: #e8e8e8;
    border-bottom: 2px solid;
  }
</style>