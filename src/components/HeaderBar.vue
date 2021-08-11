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
      <div class="header-right-user" v-show="metaMaskAddress!==''&&Pending.length===0">
        <el-dropdown @command="handleCommand" trigger="click" placement="bottom-start" size="small">
          <span class="user-menu-button">
            <span class="username">{{Ellipsis(metaMaskAddress)}}</span>
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item command="copy"> <button class="refund" @click.stop="getRefund">REFUND</button></el-dropdown-item> -->
            <el-dropdown-item command="copy">Copy</el-dropdown-item>
            <el-dropdown-item command="exit">Disconnect</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="pending" v-show="metaMaskAddress!==''&&Pending.length>0">
        <i class="el-icon-loading"></i>
        {{Pending.length}} Pending
      </div>
      <button class="mar_btn" v-show="IsMar" v-if="path==='/markets'">MARKETS</button>
      <button class="kets_btn" v-show="IsMar" @click="goMarkets" v-else>MARKETS</button>
    </div>

    <dialog-form :dialogVisible="Dialog" @closeMain="closeMain" v-if="Dialog" :diaWidth="'400px'">
      <el-row>
        <el-col :span="12"><span :class="{acitve:isbtn==='yyCRV'}" @click="setBtn('yyCRV')">yyCRV</span></el-col>
        <el-col :span="12"><span :class="{acitve:isbtn==='xSushi'}" @click="setBtn('xSushi')">xSushi</span></el-col>
      </el-row>
      <div class="dbody">
        <el-tooltip class="item" effect="dark" placement="right">
          <div slot="content">HORIZON lorem ipsum dolor sit amet, consectetur adipiscing elit,sed do.HORIZON lorem ipsum dolor sit amet</div>
          <span class="t1">Refund <i class="el-icon-question"></i></span>
        </el-tooltip>
        <span class="t2">{{tableData[isbtn].amount | AmountFilter(isbtn)}} </span>
        <span class="t3">{{isbtn}}</span>
      </div>
      <button class="dbbtn" v-show="Number(tableData[isbtn].amount)!==0" @click.stop="claim(tableData[isbtn])">REFUND</button>
    </dialog-form>
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
  getPending,
  getClaimInfo,
  refundClaim
} from '@/common/web3'
import {
  BigNumber
} from 'bignumber.js'
import {
  Network,
  Tag,
  NameMapping,
  PENDINGNUM,
  Digits
} from '../config.js'
import {
  ellipsis
} from '@/utils'
import WalletMixin from './dialog-wallet/WalletMixin'
import DialogForm from './DialogForm.vue'
export default {
  components: {
    DialogForm,
  },
  mixins: [WalletMixin],
  data () {
    return {
      timer: null,
      path: '',
      timer3: null,
      network: '',
      tag: '',
      Dialog: false,
      isbtn: 'yyCRV',
      tableData: {
        yyCRV: {},
        xSushi: {}
      },
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
    ]),
    PendingsAll () {
      return this.Pending.filter(item => item.id === this.MetaMaskAddress)
    }
  },
  watch: {
    $route (to, from) {
      // if (to.path === '/Index') {
      //   clearInterval(this.timer)
      //   this.timer = null
      // }
      this.path = to.path
    },
    MetaMaskAddress (cur, old) {
      this.getTimerData()
      this.backHome()
    },
    NetworkId (cur, old) {
      this.getTimerData()
      this.backHome()
    },
  },
  created () {
    this.Ellipsis = ellipsis
  },
  mounted () {
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
    getTimerData () {
      if (
        this.networkIDFromSym(Network) === Number(this.NetworkId)
      ) {
        this.getTimer()
      } else {
        clearInterval(this.timer)
        this.timer3 = null
      }
    },
    getPadings () {
      clearInterval(this.timer)
      this.timer3 = null
      this.timer3 = setInterval(() => {
        var cont = 0
        if (this.MetaMaskAddress && this.MetaMaskAddress !== '' && this.PendingsAll.length > 0) {
          let item = this.PendingsAll[0]
          let time = new Date().getTime() - item.time
          if (time <= PENDINGNUM) {
            getPending(item.hash).then(res => {
              cont++
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
                if (cont > 0) {
                  cont = 0
                  this.openMessageTips(msg, res.transactionHash, type)

                }
                const arr = [...this.PendingsAll]
                arr.splice(0, 1)
                localStorage.setItem('PendingHorizon', JSON.stringify(arr))
                this.setPending(arr)
              }
            })
            return
          } else {
            const arr = [...this.PendingsAll]
            arr.splice(0, 1)
            localStorage.setItem('PendingHorizon', JSON.stringify(arr))
            this.setPending(arr)
            return
          }
        }
      }, 2000)
    },

    openMessageTips (msg, id, type) {
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

    openHash (id) {
      const Win = window.open()
      Win.opener = null
      Win.location = this.tag ?
        `https://ropsten.etherscan.io/tx/${id}` :
        `https://etherscan.io/tx/${id}`
    },
    goMarkets () {
      this.$router.push({
        path: '/markets',
      })
    },
    getTimer () {
      clearInterval(this.timer)
      this.timer = null
      this.timer = setInterval(() => {
        if (this.MetaMaskAddress && this.MetaMaskAddress !== '') {
          this.getBalanceOf()
        }
      }, 1000)
    },
    async getBalanceOf () {
      const BalanceOfs = {}
      for (const key in NameMapping) {
        const balanceOf = await getIEBF(this.MetaMaskAddress, key)
        const balanceOfBig = new BigNumber(balanceOf)
          .dividedBy(Digits[key])
          .toString(10)
        BalanceOfs[key] = balanceOfBig
      }
      if (JSON.stringify(this.BalanceOf) !== JSON.stringify(BalanceOfs)) {
        this.setBalanceOf(BalanceOfs)
      }
    },
    backHome () {
      this.$router.push({
        path: '/Index',
      })
    },
    jump () {
      this.login()
    },
    goOptions () {
      this.$router.push({
        path: '/options',
      })
    },
    closeMain (val) {
      this.Dialog = val
    },
    getRefund () {
      getClaimInfo(this.MetaMaskAddress).then(res => {
        if (res.data.length > 0) {
          console.log(res, '=-==-')
          let xSushiData = res.data.filter(item => item.token === 'xSushi')
          this.tableData.xSushi = xSushiData.length > 0 ? { ...xSushiData[0] } : { amount: 0 }
          let yyCRVData = res.data.filter(item => item.token === 'yyCRV')
          this.tableData.yyCRV = yyCRVData.length > 0 ? { ...yyCRVData[0] } : { amount: 0 }
          this.Dialog = true
        } else {
          this.Warning('You are not eligible for this refund.')
        }
      }
      )
    },
    setBtn (val) {
      this.isbtn = val
    },
    claim (data) {
      console.log(data.token, 'data.proof')
      // const a =data.proof.replace("[","").replace("]","").split(",")
      // console.log(a)
      let params = refundClaim(
        data.token,
        this.MetaMaskAddress,
        data.address,
        data.amount,
        data.proof
      )
      console.log(params, 'params')
      window.web3.eth
        .sendTransaction(params)
        .on('transactionHash', async (hash) => {
          if (hash) {
            this.Dialog = false
            const obj = {
              id: this.MetaMaskAddress,
              number: data.amount,
              name: data.token,
              hash: hash,
              msg: 'Refund',
              time: new Date().getTime()
            };
            this.setPendings(obj);
          }
        })
    },
    setPendings (val) {
      let list = [...this.Pending]
      list.push(val)
      this.setPending(list)
      localStorage.setItem('PendingHorizon', JSON.stringify(list))
    },
  },
  destroyed () {
    clearInterval(this.timer)
    this.timer = null
    clearInterval(this.timer3)
    this.timer3 = null
  },
}
</script>

<style scoped lang="scss">
@import "../style/mixin.scss";
html {
  /deep/ .el-tooltip__popper.is-dark {
    width: 200px;
  }
}
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
    width: 132px;
    height: 36px;
    border: 2px solid #60aa8b;
    border-radius: 50px;
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
    width: 136px;
    height: 36px;
    line-height: 35px;
    @include bg_color($background-color-theme);
    // border: 2px solid #60aa8b;
    // box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.06);
    text-align: center;

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

.refund {
  font-size: 12px;
  background-color: #5784c1;
  color: #fff;
  border: none;
  width: 100px;
  height: 25px;
  line-height: 26px;
  border-radius: 20px;
  cursor: pointer;
}
.app_btn,
.mar_btn {
  font-size: 18px;
  font-weight: bold;
  @include font_color($font-color-theme);
  float: right;
  width: 136px;
  height: 40px;
  line-height: 30px;
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
  width: 136px;
  height: 40px;
  line-height: 30px;
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
  // box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.06);
  text-align: center;
  border-radius: 50px;
  margin: 5px 10px;
  outline: none;
  color: #f4f4f4;
  background-color: #5784c1;
  // border: 1px solid #5784c1;
  // box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.06);
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
  text-align: center;
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
.el-col-12 {
  text-align: center;
  span {
    font-size: 18px;
    display: block;
    width: 100%;
    padding-bottom: 10px;
    cursor: pointer;
  }
}
.acitve {
  border-bottom: 3px solid #5784c1;
}
.dbody {
  @include dbody_background_color($button-background-color-theme);
  padding: 20px;
  margin: 20px 0;
  border-radius: 10px;
  .t1 {
    font-size: 16px;
    color: #9a9a9a;
    display: block;
    margin-bottom: 10px;
    width: 80px;
  }
  .t2 {
    font-size: 32px;
    color: #5784c1;
  }
  .t3 {
    font-size: 16px;
    color: #9a9a9a;
  }
}

.dbbtn {
  font-size: 12px;
  background-color: #5784c1;
  color: #fff;
  border: none;
  width: 120px;
  height: 35px;
  line-height: 30px;
  border-radius: 20px;
  cursor: pointer;
  display: block;
  margin: 0 auto;
}
</style>