<template>
  <div class="box">
    <div class="left">
      <img
        @click="backHome"
        class="logo"
        :src="require('../assets/images/horizon_logo_full_'+Theme+'.png')"
        alt
      />
      <span class="tag">{{tag}}</span>
    </div>
    <div class="center">
      <div class="center-box" v-show="Smile!==''">
        <span class="title_e">{{Smile}} IN YOUR WALLET</span>
        <!-- <el-tooltip
          class="item"
          :effect="Theme==='theme1'?'dark':'light'"
          :content="Smile==='yyCRV'?BalanceOf:SuBalanceOf"
          placement="bottom"
        >
        </el-tooltip>-->

        <span class="title_n">{{Smile==='yyCRV'?BalanceOf:SuBalanceOf}}</span>
        <div class="titleicon" @click="goOptions">
          <svg-icon :iconClass="Smile==='yyCRV'?'yyCRV':'xSushi'"></svg-icon>
        </div>
      </div>
    </div>
    <div class="right">
      <button class="app_btn" @click="jump" v-if="metaMaskAddressC===''">APP</button>
      <!-- <button class="acc_btn" v-else>{{ellipsis(metaMaskAddress)}}</button> -->
      <div class="header-right-user" v-show="Pending.length===0&&metaMaskAddressC!==''">
        <el-dropdown @command="handleCommand" trigger="click" placement="bottom-start" size="small">
          <span class="user-menu-button">
            <span class="username">{{ellipsis(metaMaskAddressC)}}</span>
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item command="copy">复制地址</el-dropdown-item> -->
            <el-dropdown-item command="exit">Disconnect</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="pending" v-show="Pending.length>0">
        <i class="el-icon-loading"></i>
        {{Pending.length}} Pending
      </div>
      <button class="mar_btn" v-show="IsMar" v-if="path==='/markets'">MARKETS</button>
      <button class="kets_btn" v-show="IsMar" @click="goMarkets" v-else>MARKETS</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { getIEBF, getSUIEBF, getPadding } from '@/common/web3'
import { BigNumber } from 'bignumber.js'
import { NetWork, Tag } from '../config.js'
export default {
  data() {
    return {
      metaMaskAddress: '',
      timer: null,
      path: '',
      timer3: null,
      network: '',
      tag: '',
    }
  },
  computed: {
    ...mapState([
      'Theme',
      'Smile',
      'IsMar',
      'IsExits',
      'BalanceOf',
      'SuBalanceOf',
      'Pending',
    ]),
    metaMaskAddressC() {
      if (this.IsExits === 'no') {
        return this.metaMaskAddress
      } else {
        return ''
      }
    },
  },
  watch: {
    $route(to, from) {
      if (to.path === '/Index') {
        clearInterval(this.timer)
        this.timer = null
      }
      this.path = to.path
    },
    metaMaskAddress(cur, old) {
      if (cur) {
        this.setAddress()
        this.getTimerData()
      }
    },
    network(cur, old) {
      if (cur) {
        this.setAddress()
        this.getTimerData()
      }
    },
    IsExits(cur) {
      if (cur === 'no') {
        this.setAddress()
        this.getTimerData()
      }
    },
  },
  mounted() {
    this.setAddress()
    this.getPadings()
    if (Tag) {
      this.tag = Tag
    }
  },
  methods: {
    ...mapMutations([
      'setDialog',
      'setIsExits',
      'setBalanceOf',
      'setSuBalanceOf',
      'setPending',
    ]),
    getTimerData() {
      if (
        (NetWork === 'ropsten' && ethereum.chainId === '0x3') ||
        (NetWork !== 'ropsten' && ethereum.chainId === '0x1')
      ) {
        this.getTimer()
      }
    },
    getPadings() {
      this.timer3 = setInterval(() => {
        this.Pending.forEach((item, idx) => {
          getPadding(item.id).then((res) => {
            if (res) {
              let msg = ''
              let type = ''
              if (res.status) {
                msg =
                  item.name === 'approves'
                    ? `Authorization success!`
                    : // : `成功${item.msg}${item.number}${item.name}`
                      'Transaction submitted!'
                type = 'success'
              } else {
                msg =
                  item.name === 'approves'
                    ? `Privilege grant failed!`
                    : `The deal failed!`
                type = 'error'
              }
              this.openMessageTips(msg, res.transactionHash, type)
              let arr = [...this.Pending]
              arr.splice(idx, 1)
              localStorage.setItem('Pending', JSON.stringify(arr))
              this.setPending(arr)
              console.log(this.Pending, 'Pending')
            }
          })
        })
      }, 3000)
    },

    openMessageTips(msg, id, type) {
      const _this = this
      const h = this.$createElement
      let notifications = this.$notify({
        position: 'top-right',
        dangerouslyUseHTMLString: true,
        title: msg,
        type: type,
        offset: 100,
        duration: 10000,
        message: h('div', { class: 'message' }, [
          h(
            'span',
            {
              class: 'later',
              on: {
                click: _this.openHash.bind(_this, id),
              },
            },
            'View on Etherscan'
          ),
        ]),
      })
    },

    openHash(id) {
      if (this.tag) {
        window.open(`https://ropsten.etherscan.io/tx/${id}`, '_blank')
      } else {
        window.open(`https://etherscan.io/tx/${id}`, '_blank')
      }
      //  window.open(`https://etherscan.io/tx/${id}`, '_blank')
    },
    goMarkets() {
      this.$router.push({
        path: '/markets',
      })
    },
    getTimer() {
      clearInterval(this.timer)
      this.timer = null
      this.timer = setInterval(() => {
        if (this.metaMaskAddress !== '') {
          this.getBalanceOf()
        }
      }, 5000)
    },
    async getBalanceOf() {
      const balanceOf = await getIEBF(this.metaMaskAddress, 'yyCRV')
      const balanceOfBig = new BigNumber(balanceOf).dividedBy(1e18).toString(10)
      this.setBalanceOf(balanceOfBig)
      //sushi
      const subalanceOf = await getSUIEBF(this.metaMaskAddress, 'xSushi')
      const subalanceOfBig = new BigNumber(subalanceOf)
        .dividedBy(1e18)
        .toString(10)
      this.setSuBalanceOf(subalanceOfBig)
    },
    handleCommand(command) {
      switch (command) {
        case 'copy':
          const spanText = this.metaMaskAddress
          const oInput = document.createElement('input')
          oInput.value = spanText
          document.body.appendChild(oInput)
          oInput.select() // 选择对象
          document.execCommand('Copy') // 执行浏览器复制命令
          oInput.className = 'oInput'
          oInput.style.display = 'none'
          document.body.removeChild(oInput)
          this.$notify({
            title: 'Success',
            message: 'Copy success!',
            type: 'success',
            offset: 100,
          })
          break
        case 'exit':
          localStorage.setItem('IsExits', 'yes')
          this.setIsExits('yes')
          if (this.$route.path !== '/Index') {
            this.backHome()
          }
          break
        default:
          break
      }
    },
    async setAddress() {
      if (typeof web3 !== 'undefined' && ethereum.isMetaMask) {
        if (this.IsExits === 'no') {
          const eth_accounts = await ethereum.request({
            method: 'eth_accounts',
          })
          this.metaMaskAddress =
            eth_accounts && eth_accounts.length > 0 ? eth_accounts[0] : ''
          this.network = ethereum.chainId
        } else {
          this.metaMaskAddress = ''
        }
        ethereum.autoRefreshOnNetworkChange = false
        ethereum.on('accountsChanged', (accounts) => {
          if (this.IsExits === 'no') {
            this.metaMaskAddress = accounts.length === 0 ? '' : accounts[0]
            this.$router.push({
              path: '/Index',
            })
          }
        })
        ethereum.on('chainChanged', (network) => {
          this.network = network
          switch (network) {
            case '0x1':
              if (this.$route.path !== '/Index') {
                this.backHome()
              }
              return
            case '0x2a':
              if (this.$route.path !== '/Index') {
                this.backHome()
              }
              return
            case '0x3':
              if (this.$route.path !== '/Index') {
                this.backHome()
              }
              break
            case '0x4':
              if (this.$route.path !== '/Index') {
                this.backHome()
              }
              return
            case '0x5':
              if (this.$route.path !== '/Index') {
                this.backHome()
              }
              return
            default:
              if (this.$route.path !== '/Index') {
                this.backHome()
              }
              return
          }
        })
      }
    },
    ellipsis(value) {
      if (!value) return ''
      if (value.length > 10) {
        return value.slice(0, 6) + '...' + value.slice(38, 42)
      }
      return value
    },
    backHome() {
      this.$router.push({
        path: '/Index',
      })
    },
    jump() {
      this.setDialog(true)
      // this.$router.push({
      //   path: '/marktes',
      // })
    },
    goOptions() {
      this.$router.push({
        path: '/options',
      })
    },
  },
  destroyed() {
    clearInterval(this.timer)
    this.timer = null
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
  min-width: 1290px;
}

/deep/ .popper__arrow {
  top: -7px !important;
}
.left {
  width: 30%;
  padding-left: 40px;
  cursor: pointer;
  .tag {
    font-size: 36px;
    color: red;
  }
}
.center {
  z-index: 102;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .center-box {
    width: 394px;
    height: 197px;
    background-color: #5784c1;
    border-radius: 0 0 197px 197px;
    z-index: 9;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    .title_e {
      font-size: 16px;
      padding-top: 60px;
    }
    .title_n {
      font-size: 24px;
      width: 160px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .titleicon {
      font-size: 55px;
      cursor: pointer;
    }
  }
}
.right {
  width: 30%;
  text-align: right;
  padding-right: 40px;
  .el-dropdown {
    width: 100%;
    height: 100%;
    color: #60aa8b;
  }

  .el-dropdown:hover {
    background-color: #60aa8b;
    color: #f4f4f4;
    border-radius: 50px;
  }
  .header-right-user {
    font-size: 18px;
    color: #60aa8b;
    float: right;
    width: 140px;
    height: 40px;
    line-height: 35px;
    @include bg_color($background-color-theme);
    border: 2px solid #60aa8b;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.06);
    text-align: center;
    border-radius: 50px;
    margin: 5px 10px;
    outline: none;
    cursor: pointer;
    .user-menu-button {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      cursor: pointer;
      .username {
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
.logo {
  height: 39px;
}
.app_btn,
.mar_btn {
  font-size: 18px;
  font-weight: bold;
  @include font_color($font-color-theme);
  float: right;
  width: 144px;
  height: 44px;
  line-height: 35px;
  @include bg_color($background-color-theme);
  border: 2px solid;
  @include btnbor_color($button-border-color-theme);
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.06);
  text-align: center;
  border-radius: 50px;
  margin: 5px 10px;
  outline: none;
  cursor: pointer;
}
.kets_btn {
  font-size: 18px;
  float: right;
  width: 144px;
  height: 44px;
  line-height: 35px;
  @include bg_color($background-color-theme);
  border: 2px solid #1f1f1f;
  @include btnbor_color($button-border-color-theme);
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.06);
  @include font_color($font-color-theme);
  text-align: center;
  border-radius: 50px;
  outline: none;
  margin: 5px 10px;
  cursor: pointer;
  // @include btn_bg_color($button-bg-color-theme);
}
.kets_btn:hover {
  @include idxbtnfont_color($idxfont-button-color-theme);
  @include idxbtnbg_color($button-background-color-theme);
  border: none;
}
.pending {
  font-size: 14px;
  float: right;
  width: 140px;
  height: 40px;
  line-height: 38px;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.06);
  text-align: center;
  border-radius: 50px;
  margin: 5px 10px;
  outline: none;
  color: #f4f4f4;
  background-color: #5784c1;
  border: 1px solid #5784c1;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.06);
}
.acc_btn {
  font-size: 18px;
  color: #60aa8b;
  float: right;
  width: 140px;
  height: 40px;
  line-height: 35px;
  @include bg_color($background-color-theme);
  border: 2px solid #60aa8b;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.06);
  text-align: center;
  border-radius: 50px;
  margin: 5px 10px;
  outline: none;
  cursor: pointer;
}
.app_btn:hover {
  @include idxbtnfont_color($idxfont-button-color-theme);
  @include idxbtnbg_color($button-background-color-theme);
  border: none;
}
.mar_btn {
  @include idxbtnfont_color($idxfont-button-color-theme);
  @include idxbtnbg_color($button-background-color-theme);
}
.el-dropdown-menu {
  @include table_color($background-table-color-theme);
}
.el-dropdown-menu__item {
  @include font_color($font-color-theme);
}
.later {
  font-size: 12px;
  color: rgba(33, 150, 243, 1);
  padding: 0 10px;
  cursor: alias;
}
/deep/ .popper__arrow::after {
  border-bottom-color: #f4f4f4 !important;
}
</style>
