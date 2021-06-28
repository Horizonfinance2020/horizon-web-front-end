<template>
  <div class="box">
    <div class="left">
      <img @click="backHome" class="logo" :src="require('../assets/images/horizon_logo_full_'+Theme+'.png')" alt />
      <span class="tag">{{tag}}</span>
    </div>
    <div class="center">
      <div class="center-box" v-show="Smile!==''">
        <span class="title_e">{{Smile}} IN YOUR WALLET</span>
        <span class="title_n">{{BalanceOf[Smile] |MathFloor}}</span>
        <div class="titleicon" @click="goOptions">
          <svg-icon :iconClass="Smile"></svg-icon>
        </div>
      </div>
    </div>
    <div class="right">
      <button class="app_btn" @click="jump" v-if="metaMaskAddress===''">APP</button>
      <div class="header-right-user" v-show="Pending.length===0&&metaMaskAddress!==''">
        <el-dropdown @command="handleCommand" trigger="click" placement="bottom-start" size="small">
          <span class="user-menu-button">
            <span class="username">{{Ellipsis(metaMaskAddress)}}</span>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="copy">Copy</el-dropdown-item>
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
  import {
    mapState,
    mapMutations
  } from 'vuex'
  import {
    getIEBF,
    getSUIEBF,
    getPadding
  } from '@/common/web3'
  import {
    BigNumber
  } from 'bignumber.js'
  import {
    Network,
    Tag,
    NameMapping,
    PENDINGNUM
  } from '../config.js'
  import {
    ellipsis
  } from '@/utils'
  import WalletMixin from './dialog-wallet/WalletMixin'
  export default {
    mixins: [WalletMixin],
    data() {
      return {
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
        'BalanceOf',
        'Pending',
        'MetaMaskAddress',
        'NetworkId'
      ])
    },
    watch: {
      $route(to, from) {
        // if (to.path === '/Index') {
        //   clearInterval(this.timer)
        //   this.timer = null
        // }
        this.path = to.path
      },
      MetaMaskAddress(cur, old) {
          this.getTimerData()
          this.backHome()
      },
      NetworkId(cur, old) {
          this.getTimerData()
          this.backHome()
      },
    },
    created(){
      this.Ellipsis = ellipsis
    },
    mounted() {
      this.getPadings()
      if (Tag) {
        this.tag = Tag
      }
    },
    methods: {
      ...mapMutations([
        'setBalanceOf',
        'setPending',
        'setMetaMaskAddress',
      ]),
      getTimerData() {
        if (
         this.networkIDFromSym(Network) === Number(this.NetworkId) 
        ) {
          this.getTimer()
        }else{
          clearInterval(this.timer)
        this.timer3 = null
        }
      },
      getPadings() {
        clearInterval(this.timer)
        this.timer3 = null
        this.timer3 = setInterval(() => {
          this.Pending.forEach((item, idx) => {
            if ((new Date().getTime() - item.time) <= PENDINGNUM) {
              getPadding(item.id).then((res) => {
                if (res) {
                  let msg = ''
                  let type = ''
                  if (res.status) {
                    msg =
                      item.name === 'approves' ?
                      'Authorization success!' : // : `成功${item.msg}${item.number}${item.name}`
                      'Transaction submitted!'
                    type = 'success'
                  } else {
                    msg =
                      item.name === 'approves' ?
                      'Privilege grant failed!' :
                      'The deal failed!'
                    type = 'error'
                  }
                  this.openMessageTips(msg, res.transactionHash, type)
                  const arr = [...this.Pending]
                  arr.splice(idx, 1)
                  localStorage.setItem('PendingHorizon', JSON.stringify(arr))
                  this.setPending(arr)
                }
              })
            } else {
              const arr = [...this.Pending]
              arr.splice(idx, 1)
              localStorage.setItem('PendingHorizon', JSON.stringify(arr))
              this.setPending(arr)
            }

          })
        }, 1000)
      },

      openMessageTips(msg, id, type) {
        const _this = this
        const h = this.$createElement
        const notifications = this.$notify({
          position: 'top-right',
          dangerouslyUseHTMLString: true,
          title: msg,
          type,
          offset: 100,
          duration: 10000,
          message: h('div', {
            class: 'message'
          }, [
            h(
              'span', {
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
        const Win = window.open()
        Win.opener = null
        Win.location = this.tag ?
          `https://ropsten.etherscan.io/tx/${id}` :
          `https://etherscan.io/tx/${id}`
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
          if (this.MetaMaskAddress !== '') {
            this.getBalanceOf()
          }
        }, 1000)
      },
      async getBalanceOf() {
        const BalanceOfs = {}
        for (const key in NameMapping) {
          const balanceOf = await getIEBF(this.MetaMaskAddress, key)
          const balanceOfBig = new BigNumber(balanceOf)
            .dividedBy(1e18)
            .toString(10)
          BalanceOfs[key] = balanceOfBig
        }
        if (JSON.stringify(this.BalanceOf) !== JSON.stringify(BalanceOfs)) {
          this.setBalanceOf(BalanceOfs)
        }
      },
      backHome() {
        this.$router.push({
          path: '/Index',
        })
      },
      jump() {
        this.login()
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
      clearInterval(this.timer3)
      this.timer3 = null
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
        font-size: 40px;
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