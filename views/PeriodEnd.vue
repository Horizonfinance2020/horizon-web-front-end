<template>
  <div class="box">
    <div class="body" v-for="(val , key , idx ) in objData " :key="idx">
      <div
        :class="`${key}-card`"
        v-for="(item, idex) in val"
        :key="item"
        @click="updatePeriodStatuss(item)"
      >
        <div class="top">
          <span>{{key}}</span>
          <br />
        </div>
        <div class="center">
          <span>{{objName[idex]}}</span>
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
import DialogForm from '../components/DialogForm.vue'
import { mapMutations, mapState } from 'vuex'
import { NetWork, NameMapping, PeriodName } from '../config.js'
import { updatePeriodStatu } from '@/common/web3'
export default {
  components: {
    DialogForm,
    MetaMask,
  },
  computed: {
    ...mapState(['Dialog', 'IsExits', 'MetaMaskAddress']),
  },
  data() {
    return {
      objData: {},
      objName: [],
    }
  },
  mounted() {
    this.objData = { ...NameMapping }
    this.objName = { ...PeriodName }
  },
  methods: {
    ...mapMutations(['setDialog', 'setIsExits']),
    updatePeriodStatuss(name) {
      console.log(this.MetaMaskAddress, this.IsExits)
      if (this.MetaMaskAddress !== '' && this.IsExits === 'no') {
        let params = updatePeriodStatu(this.MetaMaskAddress, name)
        ethereum.sendAsync(
          {
            method: 'eth_sendTransaction',
            params: params,
            loadingDefaults: true,
            from: this.MetaMaskAddress, // Provide the user's account to use.
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
      } else {
        this.$message({
          showClose: true,
          message: 'Please click the APP to connect the wallet first.',
          type: 'warning',
          offset: 100,
        })
      }
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
      this.setIsExits('no')
      this.setDialog(false)
      this.MetaMaskAddress = ethereum.selectedAddress
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
  display: flex;
  .body {
    height: 50%;
    width: 50%;
    display: flex;
    .yyCRV-card,
    .xSushi-card {
      width: 20%;
      // min-width: 400px;
      width: 400px;
      margin-right: 50px;
      border-radius: 10px;
      cursor: pointer;
    }
    .yyCRV-card,
    .xSushi-card {
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
    .yyCRV-card {
      background-color: #5784c1 !important;
      border: 1px solid #5784c1;
    }
    .xSushi-card {
      background-color: #be5b5f !important;
      border: 1px solid #be5b5f;
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
.xSushi-card:hover {
  -webkit-box-shadow: 4px 4px 6px #969696;
  -moz-box-shadow: 4px 4px 6px #969696;
  box-shadow: 4px 4px 6px #969696;
}
</style>
