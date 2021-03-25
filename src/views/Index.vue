<template>
  <div class="box">
    <div class="left">
      <span
        class="title"
      >Horizon Finance allows users to deposit their funds and compete for preferential payment by capping their yield, thereby outperforming or underperforming the benchmark interest rate.</span>
      <button class="logo_btn" @click="jump">SEE HORIZON MARKETS</button>
      <span>Backed By Alameda Research, Framework Ventures, Mechanism Capital, DeFiance Capital, Spartan Group, NGC, Incuba Alpha, Ruby Capital, Robot Ventures.</span>
    </div>
    <div class="right">
      <div class="imgs">
        <img src="../assets/images/homepage.png" height="100%" alt />
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
export default {
  components: {
    DialogForm,
    MetaMask,
  },
  computed: {
    ...mapState(['Dialog', 'IsExits']),
  },
  data() {
    return {}
  },
  created() {
    this.setSmile('')
    localStorage.setItem('Smile', '')
    this.setIsMar(false)
    localStorage.setItem('IsMar', false)
  },
  methods: {
    ...mapMutations(['setSmile', 'setIsMar', 'setDialog', 'setIsExits']),
    async jump() {
      const eth_accounts = await ethereum.request({
        method: 'eth_accounts',
      })
      if (this.IsExits !== 'no') {
        this.$message({
          showClose: true,
          message: 'Please click the APP to connect the wallet first.',
          type: 'warning',
          offset: 100,
        })
        return
      }
      if (NetWork === 'ropsten') {
        if (ethereum.chainId !== '0x3') {
          this.$message({
            showClose: true,
            message: 'Please change to ropsten network！',
            type: 'warning',
            offset: 100,
          })
          return
        }
      } else {
        if (ethereum.chainId !== '0x1') {
          this.$message({
            showClose: true,
            message: `You Must Change Network. We've detected that you need to switch your wallet's network from testnet to mainnet for this Dapp.`,
            type: 'warning',
            offset: 100,
          })
          return
        }
      }
      if (this.IsExits === 'no' && eth_accounts && eth_accounts.length > 0) {
        this.$router.push({
          path: '/marktes',
        })
      } else {
        this.$message({
          showClose: true,
          message: 'Please click the APP to connect the wallet first.',
          type: 'warning',
          offset: 100,
        })
      }
    },
    closeMain(val) {
      localStorage.setItem('IsExits', 'no')
      this.setIsExits('no')
      this.setDialog(false)
    },
  },
}
</script>

<style scoped lang="scss">
@import '../style/mixin.scss';
.box {
  display: flex;
  height: 100%;
}
.left {
  width: 45%;
  height: 100%;
  padding-left: 100px;
  min-height: 600px;
  min-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .title {
    font-size: 40px;
    letter-spacing: 0px;
    @include font_color($font-color-theme);
  }
  span {
    font-family: Archivo;
    font-size: 20px;
    @include font_color($font-color-theme);
  }
  .logo_btn {
    margin: 50px 0 30px 0;
    font-size: 24px;
    font-weight: bold;
    @include bg_color($background-color-theme);
    border: 2px solid;
    @include font_color($font-color-theme);
    @include btnbor_color($button-border-color-theme);
    width: 500px;
    height: 76px;
    line-height: 70px;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.06);
    text-align: center;
    border-radius: 50px;
    outline: none;
    cursor: pointer;
  }
  .logo_btn:hover {
    @include idxbtnfont_color($idxfont-button-color-theme);
    @include idxbtnbg_color($button-background-color-theme);
    border: none;
  }
}
.right {
  height: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  .imgs {
    // width: 400px;
    cursor: pointer;
    height: 100%;
    min-height: 620px;
  }
}
</style>
