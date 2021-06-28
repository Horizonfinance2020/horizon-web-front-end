<template>
  <div class="body-box">
    <title-card :tag="tag" :steps="steps" />
    <div class="top">
      <span>ACTIVE</span>
      <div class="top-table">
        <ul class="one-ul">
          <li>Txn Hash</li>
          <li>PERIOD</li>
          <li>IR (%)</li>
          <li>SIZE ({{Smile}})</li>
          <li style="text-align: center;width:220px">
            <el-tooltip class="item" effect="dark" placement="top-start">
              <div slot="content">
                The time is accounted by the block height.
                <br />Note: This is an estimated time.
              </div>
              <span>
                CLAIMABLE
                <i class="el-icon-question" style="display:initial;"></i>
              </span>
            </el-tooltip>
          </li>
          <li style="text-align: center;">REBID</li>
        </ul>
        <ul v-for="(item , idx ) in tableTop" :key="idx">
          <li style="cursor: pointer;">
            <span class="txHash" @click="copy(item.txhash)">{{Ellipsis(item.txhash,0,5,62, 66)}}</span>
            <span class="txIcon" @click="openEch(item.txhash)">
              <svg-icon iconClass="forwarding" style="font-size: 14px"></svg-icon>
            </span>
          </li>
          <li>{{item.period}}</li>
          <li>{{item.IR}}</li>
          <li style="text-align: center">{{parFloat(item.Size)}}</li>
          <li style="text-align: center;width:220px">{{ClaimTime(item.claim_time_left)}}</li>
          <!-- <el-tooltip class="item" effect="dark" :content="dateFormat(item.Timer)" placement="top">
            <li style="cursor: pointer">{{dateFormat(item.Timer)}}</li>
          </el-tooltip>-->
          <li>
            <button class="u_btn" @click="setRebid(item)">REBID</button>
          </li>
        </ul>
        <div v-if="tableTop.length===0" class="noData">
          <img src="../assets/images/horizon.png" height="100%" alt />
          <span>You have no active bid!</span>
        </div>
      </div>
      <button class="m_btn" @click="getListTop" v-if="activeBid.length>3">
        {{top}}
        <svg-icon :iconClass="top==='MORE'?'more':'fold'"></svg-icon>
      </button>
    </div>
    <div class="bom">
      <span>HISTORY</span>
      <div class="bom-table">
        <ul class="one-ul">
          <li>PERIOD</li>
          <li>IR (%)</li>
          <li style="text-align: center;">SIZE ({{Smile}})</li>
          <li style="text-align: center;">PNL({{Smile}})</li>
          <li style="text-align: center;">CLAIM</li>
        </ul>
        <ul v-for="(item , idx ) in tableBom" :key="idx">
          <li>{{item.period}}</li>
          <li>{{item.IR}}</li>
          <li style="text-align: center;">{{parFloat(item.Size)}}</li>
          <li style="text-align: center;">{{parFloat(item.pnls)}}</li>
          <li>
            <button class="u_btn" @click="claim(item)">CLAIM</button>
          </li>
        </ul>
        <div v-if="tableBom.length===0" class="noData">
          <img src="../assets/images/horizon.png" height="100%" alt />
          <span>You have no bid to claim!</span>
        </div>
      </div>
      <button class="m_btn" @click="getListBom" style="margin-bottom:20px" v-if="historyBid.length>3">
        {{bom}}
        <svg-icon :iconClass="bom==='MORE'?'more':'fold'"></svg-icon>
      </button>
    </div>
    <dialog-form :dialogVisible="Dialog" @closeMain="closeMain" v-if="Dialog" :diaWidth="'740px'">
      <div class="shou">
        <p style="font-size:24px;margin-bottom: 30px;">{{msg}}</p>
        <p>
          <button class="u_btn" @click="setShou()" v-if="btn==='REBID'">{{btn}}</button>
          <button class="u_btn" @click="setClaim()" v-else>{{btn}}</button>
        </p>
      </div>
    </dialog-form>
  </div>
</template>

<script>
import TitleCard from '@/components/TitleCard.vue'
import {
  getActiveBid,
  getHistoryBid,
  getClaim,
  getHGateKeeper,
  getMyBF,
} from '@/common/web3'
import {
  Tag,
  PeriodMapping
} from '../config.js'
import DialogForm from '../components/DialogForm.vue'
import {
  BigNumber
} from 'bignumber.js'
import {
  mapState,
  mapMutations
} from 'vuex'
import dayjs from 'dayjs'
import {
  copys,
  claimTime,
  ellipsis
} from '@/utils'
export default {
  components: {
    TitleCard,
    DialogForm,
  },
  data () {
    return {
      tag: 'two',
      steps: '0%',
      activeBid: [],
      historyBid: [],
      top: 'MORE',
      bom: 'MORE',
      Dialog: false,
      msg: '',
      btnbid: false,
      bidData: {},
      btn: '',
      claimData: {},
      loading: null,
      ClaimTime: null,
    }
  },
  computed: {
    ...mapState([
      'BalanceOf',
      'Smile',
      'Pending',
      'MetaMaskAddress',
    ]),
    tableTop () {
      if (this.activeBid.length > 3) {
        if (this.top === 'MORE') {
          return this.activeBid.slice(0, 3)
        } else {
          return this.activeBid
        }
      } else {
        return this.activeBid
      }
    },
    tableBom () {
      if (this.historyBid.length > 3) {
        console.log(this.historyBid)
        if (this.bom === 'MORE') {
          return this.historyBid.slice(0, 3)
        } else {
          return this.historyBid
        }
      } else {
        return this.historyBid
      }
    },
  },
  watch: {
    BalanceOf (cur, old) {
      if (cur[this.Smile] !== old[this.Smile]) {
        this.getTable()
      }
    },
  },
  created () {
    this.ClaimTime = claimTime
    this.Ellipsis = ellipsis
  },
  async mounted () {
    this.getTable()
  },
  methods: {
    ...mapMutations(['setPending']),
    parFloat (num) {
      return parseFloat(num)
    },
    pnlColor (ir, pnl) {
      return ir === 'FLOATING' ?
        'none' :
        parseFloat(ir) > parseFloat(pnl) ?
          '#5784C1' :
          '#2681FF'
    },
    dateFormat (val) {
      return new Date(val * 1000).toLocaleString()
    },
    async claim (item) {
      this.claimData = item
      this.btn = 'CLAIM'
      this.msg = 'Do you want to claim ?'
      this.Dialog = true
    },
    async setClaim () {
      const num = await getMyBF(this.MetaMaskAddress, this.claimData.lp_addr)
      const name = PeriodMapping[this.Smile][this.claimData.period]
      let params = getClaim(
        num,
        this.MetaMaskAddress,
        name,
        this.claimData.lp_addr
      )
      this.Dialog = false

      window.web3.eth
        .sendTransaction(params)
        .on('transactionHash', async (hash) => {
          if(hash){
          const obj = {
            number: this.money,
            name: this.Smile,
            id: hash,
            msg: 'Claim',
            time: new Date().getTime()
          };
          this.setPendings(obj);
          }
        })
    },
    openEch (id) {
      let Win = window.open()
      Win.opener = null
      Win.location = Tag ?
        `https://ropsten.etherscan.io/tx/${id}` :
        `https://etherscan.io/tx/${id}`
    },
    setShou () {
      if (this.btnbid) {
        const name = PeriodMapping[this.Smile][this.bidData.period]
        this.Dialog = false
        const number = new BigNumber(this.bidData.Size)
          .multipliedBy(1e18)
          .toString(10)
        let params = getHGateKeeper(
          number,
          this.MetaMaskAddress,
          name,
          this.bidData.ratio_for_bid
        )
        window.web3.eth
          .sendTransaction(params)
          .on('transactionHash', async (hash) => {
           if(hash){

           const obj = {
              number: this.money,
              name: this.Smile,
              id: hash,
              msg: 'Bid',
              time: new Date().getTime()
            };
            this.setPendings(obj);
           }
          })
      } else {
        const code = this.bidData.period === '2 weeks' ? 2 : 3
        this.$router.push({
          path: '/trading',
          query: {
            code: code
          },
        })
      }
    },
    setPendings (val) {
      let list = [...this.Pending]
      list.push(val)
      this.setPending(list)
      localStorage.setItem('PendingHorizon', JSON.stringify(list))
    },
    copy (item) {
      copys(this, item)
    },
    closeMain (val) {
      this.Dialog = false
    },
    setRebid (item) {
      this.bidData = item
      this.btn = 'REBID'
      const bf = this.BalanceOf[this.Smile]
      if (Number(bf) > Number(item.Size)) {
        this.msg = `You selected ${item.Size} size and ${item.IR}(IR) over ${item.period}`
        this.btnbid = true
      } else {
        this.btnbid = false
        this.msg = 'Your balance is insufficient'
      }
      this.Dialog = true
    },
    async getTable () {
      console.log('get')
      this.loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)',
      })
      const activeBid = await getActiveBid(this.MetaMaskAddress, this.Smile)
      const historyBid = await getHistoryBid(this.MetaMaskAddress, this.Smile)
      this.activeBid = activeBid.data.error_code ? [] : activeBid.data
      this.historyBid = historyBid.data.error_code ? [] : historyBid.data
      this.historyBid.forEach(item => {
        this.getMyBFs(item)
      });
      if (this.loading) {
        this.loading.close()
        this.loading = null
      }
    },
    getMyBFs (item) {
      if (item.total_supply === 0) {
        const c = '-' + new BigNumber(item.value_for_claim).dividedBy(1e18).toString(10)
        this.$set(item, 'pnls', c)
      } else {
        getMyBF(this.MetaMaskAddress, item.lp_addr).then(res => {
          const mybf = res
          const a = new BigNumber(mybf).multipliedBy(item.underlying_balance).dividedBy(item.total_supply)
            .toString(10)
          const b = new BigNumber(a).minus(item.value_for_claim).dividedBy(1e18).toString(10)
          this.$set(item, 'pnls', b)
        })
      }
    },
    getListTop () {
      if (this.top === 'FOLD') {
        this.top = 'MORE'
      } else {
        this.top = 'FOLD'
      }
    },
    getListBom () {
      if (this.bom === 'FOLD') {
        this.bom = 'MORE'
      } else {
        this.bom = 'FOLD'
      }
    },
  },
}
</script>

<style scoped lang="scss">
@import "../style/mixin.scss";

.body-box {
  height: calc(100% - 110px);

  .txHash:hover {
    color: #5784c1;
  }

  .txIcon:hover {
    color: #5784c1;
  }

  @include font_color($font-color-theme);

  .top {
    min-height: calc(50% - 60px);
    margin: 30px 200px;
    width: calc(100% - 400px);
    margin-top: 110px;
    min-width: 1024px;

    span {
      font-size: 18px;
    }

    .top-table {
      margin-bottom: 10px;

      .one-ul {
        background-color: rgba(255, 255, 255, 0) !important;
        margin-bottom: 10px;
        font-weight: bold;
        border-radius: 0px;
        box-shadow: none;
      }

      li {
        display: block;
        width: 16%;
        float: left;
        text-indent: 2em;
        height: 50px;
        line-height: 50px;
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        overflow: hidden;

        span {
          font-size: 18px;
          font-weight: inherit;
          padding-right: 5px;
        }
      }

      li:last-child {
        width: 140px;
        float: right;
      }
    }
  }

  .bom {
    min-height: calc(50% - 80px);
    margin: 0 200px;
    width: calc(100% - 400px);
    min-width: 1024px;

    span {
      font-size: 18px;
    }

    .bom-table {
      margin-bottom: 10px;

      .one-ul {
        background-color: rgba(255, 255, 255, 0) !important;
        margin-bottom: 10px;
        font-weight: bold;
        border-radius: 0px;
        box-shadow: none;
      }

      li {
        display: block;
        width: 20%;
        float: left;
        text-indent: 2em;
        height: 50px;
        line-height: 50px;
      }

      li:last-child {
        width: 140px;
        float: right;
      }
    }
  }

  .m_btn {
    font-size: 14px;
    width: 100px;
    height: 30px;
    line-height: 25px;
    @include bg_color($background-color-theme);
    border: 1px solid #1f1f1f;
    @include btnbor_color($button-border-color-theme);
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.06);
    @include font_color($font-color-theme);
    text-align: center;
    border-radius: 50px;
    outline: none;
    cursor: pointer;

    .svg-icon {
      font-size: 9px;
    }
  }

  ul {
    list-style: none;
    height: 50px;
    line-height: 20px;
    font-size: 18px;
    margin-top: 10px;
    @include btn_bg_color($button-bg-color-theme);
    border-radius: 10px;
    box-shadow: 1px 7px 6px #0000001a;
  }

  .u_btn {
    font-size: 14px;
    width: 100px;
    height: 30px;
    line-height: 25px;
    @include btn_bg_color($button-bg-color-theme);
    border: 1px solid #1f1f1f;
    @include btnbor_color($button-border-color-theme);
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.06);
    @include font_color($font-color-theme);
    text-align: center;
    border-radius: 50px;
    outline: none;
    cursor: pointer;
    @include btn_bg_color($button-bg-color-theme);
  }

  .m_btn:hover,
  .u_btn:hover {
    @include idxbtnfont_color($idxfont-button-color-theme);
    @include idxbtnbg_color($button-background-color-theme);
    border: none;
  }

  .shou {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    word-wrap: break-word;

    .el-button {
      width: 160px;
      border-radius: 30px;
    }
  }

  .noData {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    margin-top: 70px;
    color: #aaa9a9;

    img {
      margin-bottom: 20px;
      width: 300px;
    }
  }
}
</style>