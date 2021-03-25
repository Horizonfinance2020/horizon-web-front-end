<template>
  <div class="box">
    <div class="body">
      <!-- <div class="one-card" @click="updatePeriodStatuss('oneweek')">
        <div class="top">
          <span>yyCRV</span>
          <br />
        </div>
        <div class="center">
          <span>1 week</span>
        </div>
        <div class="bottom">UPDATE PERIOD</div>
      </div>-->
      <div class="one3-card" @click="updatePeriodStatuss('towweek')">
        <div class="top">
          <span>yyCRV</span>
          <br />
        </div>
        <div class="center">
          <span>2 weeks</span>
        </div>
        <div class="bottom">UPDATE PERIOD</div>
      </div>
      <div class="one4-card" @click="updatePeriodStatuss('onemonth')">
        <div class="top">
          <span>yyCRV</span>
          <br />
        </div>
        <div class="center">
          <span>1 month</span>
        </div>
        <div class="bottom">UPDATE PERIOD</div>
      </div>
      <div class="two-card" @click="updatePeriodStatuss('sushitwo')">
        <div class="top">
          <span>xSushi</span>
          <br />
        </div>
        <div class="center">
          <span>2 week</span>
        </div>
        <div class="bottom">UPDATE PERIOD</div>
      </div>
      <div class="two-card" @click="updatePeriodStatuss('sushimonth')">
        <div class="top">
          <span>xSushi</span>
          <br />
        </div>
        <div class="center">
          <span>1 month</span>
        </div>
        <div class="bottom">UPDATE PERIOD</div>
      </div>
    </div>
    <dialog-form :dialogVisible="Dialog" @closeMain="closeMain" v-if="Dialog">
      <meta-mask @closeMain="closeMain" />
    </dialog-form>
  </div>
</template>

<script>
import MetaMask from './MetaMask.vue'
import DialogForm from '../components/dialog-form.vue'
import { mapMutations, mapState } from 'vuex'
import { NetWork } from '../config.js'
import { updatePeriodStatu } from '@/common/web3'
export default {
  components: {
    DialogForm,
    MetaMask,
  },
  computed: {
    ...mapState(['Dialog', 'IsExits']),
  },
  data() {
    return {
      metaMaskAddress: '',
    }
  },
  async mounted() {
    const eth_accounts = await ethereum.request({
      method: 'eth_accounts',
    })
    this.metaMaskAddress =
      eth_accounts && eth_accounts.length > 0 ? eth_accounts[0] : ''
  },
  methods: {
    updatePeriodStatuss(name) {
      let params = updatePeriodStatu(this.metaMaskAddress, name)
      ethereum.sendAsync(
        {
          method: 'eth_sendTransaction',
          params: params,
          loadingDefaults: true,
          from: this.metaMaskAddress, // Provide the user's account to use.
        },
        (err, result) => {
          if (result.result) {
          } else {
            this.$notify.error({
              title: 'Error',
              message: 'Transaction failure.',
              offset: 100,
            })
          }
        }
      )
    },
    async jump() {
      const eth_accounts = await ethereum.request({
        method: 'eth_accounts',
      })
      if (NetWork === 'ropsten') {
        if (ethereum.chainId !== '0x3') {
          this.$notify.error({
            title: 'Error',
            message: 'Please change to ropsten network！',
            offset: 100,
          })
          return
        }
      } else {
        if (ethereum.chainId !== '0x1') {
          this.$notify.error({
            title: 'Error',
            message: `You must change networks. We've detected that you need to switch your wallet's network from test network to mainnet network for this Dapp.`,
            offset: 100,
          })
          return
        }
      }
    },
    closeMain(val) {
      this.setDialog(false)
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
    height: 60%;
    display: flex;
    .one-card,
    .two-card,
    .last-card,
    .one3-card,
    .one4-card {
      width: 20%;
      // min-width: 400px;
      width: 400px;
      margin-right: 50px;
      border-radius: 10px;
      cursor: pointer;
    }
    .one-card,
    .two-card,
    .one3-card,
    .one4-card {
      background-color: #5784c1 !important;
      border: 1px solid #5784c1;
      display: flex;
      flex-direction: column;
      .center {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 48px;
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
