<template>
  <div class="body-box">
    <title-card :tag="tag" :steps="steps" />
    <div class="body-mian">
      <div class="main-l" v-if="btnName==='CONFIRM'">
        <p v-if="allow===0">You need to agree to allow linking your wallet.</p>
        <p v-else>Select the size and IR you want to bid over a {{periodName[$route.query.code-1]}} period.</p>
        <button class="bu_btn" @click="setApproves" :disabled="approves" v-if="allow===0">APPROVE</button>
        <button v-else class="bu_btn" @click="setOrder">CONFIRM</button>
        <span @click="goPeriod">CANCEL AND CHOOSE OTHER PERIOD</span>
      </div>
      <div class="main-l" v-else>
        <p>
          You have placed a bid at
          <span style="border-bottom:none;;font-family: 'Bold';">{{list[calssNum].ratio}}</span> in
          <span style="border-bottom:none;font-family: 'Bold';">{{money}} {{Smile}}</span>
          for the {{periodName[$route.query.code-1]}} market.
        </p>
        <button class="bu_btn" @click="goPeriod">BID AGAIN</button>
        <span @click="goHistory">SEE ON THE HISTORY</span>
      </div>
      <div class="main-c" v-if="btnName==='CONFIRM'">
        <div class="main-c-top">
          <span class="title">SIZE</span>
          <br />
          <el-input v-model="money" @input="setMoney" onkeyup="value=value.replace(/[^\d^\.]/g,'')"></el-input>
          <el-slider v-model="slider" :show-tooltip="false" :min="0" :max="maxMoney" @input="setSlider" style="margin-left: 10px;" />
          <span class="yusd">
            <span class="sizemany">{{maxMoney }}</span>
            {{Smile}} AVAILABLE
            <span class="max" @click="setMaxMoney">MAX</span>
          </span>
        </div>
        <div class="main-c-bottom">
          <span>IR -INTEREST RATES</span>
          <br />
          <button class="bu_btn" v-if="list.length!==0" @click="setFloating" :style="{'background-color':flo===true?'#5784C1':''}">FLOATING</button>
          <br />
          <button class="bu_num" v-for="(item , idx) in list" v-show="item.ratio!=='FLOATING'" :key="idx" :style="{'background-color':calssNum===idx?'#5784C1':''}" @click="setNum(idx)">{{item.ratio}}</button>
        </div>
      </div>
      <div class="main-r" :style="{width:btnName==='CONFIRM'?'30%':'65%'}">
        <div class="r-title">
          <span :style="{color:tags==='upcoming'?'#5784c1':cycle==='upcoming'?'':'#707070'}" @click="setCycle('upcoming')" @mousemove="setColor('upcoming')" @mouseleave="remColor('upcoming')">UPCOMING QUANTA</span>
          <span class="title-r" :style="{color:tags==='previous'?'#5784c1':cycle==='previous'?'':'#707070'}" @click="setCycle('previous')" @mousemove="setColor('previous')" @mouseleave="remColor('previous')">SEE PREVIOUS QUANTA</span>
        </div>
        <div class="main-r-box" v-if="cycle==='upcoming'">
          <div v-for="(item , idx) in listData" :key="idx" style="width:100%;display: flex;">
            <div class="r-box-item">
              <div class="item-num">{{item.ratio}}</div>
              <div class="item-body">
                <div class="item-idx" v-if="item.ratio!=='FLOATING'" :style="{width:item.bids+ '%',display:item.bids===0?'none':''}"></div>
                <div class="item-box" v-if="item.ratio!=='FLOATING'" :style="{width:item.for+'%',display:item.for<=0?'none':''}"></div>
                <div class="item-idx-lest" v-if="item.ratio==='FLOATING'" :style="{width:item.bids+ '%' ,display:item.bids===0?'none':''}"></div>
                <div class="item-idxlest" v-if="item.ratio==='FLOATING'" :style="{width:item.for+'%',display:item.for<=0?'none':''}"></div>
              </div>
              <div>{{fixedFloat(item.value)}}</div>
            </div>
            <div class="right_text">
              <div :style="{width:divWidth(listData[listData.length-1].value_sum,item.value_sum)}" style="margin-left: auto;">
                <span style="float: right;">{{fixedFloat(item.value_sum)}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="main-r-box" v-else>
          <div v-for="(item , idx) in listDataTo" :key="idx" style="width:100%;display: flex;">
            <div class="r-box-item">
              <div class="item-num">{{item.ratio}}</div>
              <div class="item-body">
                <div class="item-idx" v-if="item.ratio!=='FLOATING'" :style="{width:item.bids+ '%'}"></div>
                <div class="item-box" v-if="item.ratio!=='FLOATING'" :style="{width:item.for+'%'}"></div>
                <div class="item-idx-lest" v-if="item.ratio==='FLOATING'" :style="{width:item.bids+ '%' ,display:item.bids===0?'none':''}"></div>
                <div class="item-idxlest" v-if="item.ratio==='FLOATING'" :style="{width:item.for+'%',display:item.for<=0?'none':''}"></div>
              </div>
              <div>{{fixedFloat(item.value)}}</div>
            </div>
            <div class="right_text">
              <div :style="{width:divWidth(listDataTo[listDataTo.length-1].value_sum,item.value_sum)}" style="margin-left: auto;">
                <span style="float: right;">{{fixedFloat(item.value_sum)}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="main-bottom" v-if="cycle==='upcoming'">
          <div style="width:16%">
            <div class="bottom-one"></div>
          </div>
          <div>
            <span>UPCOMING</span>
            <span>QUANTA</span>
          </div>
          <div>
            <span>SYSTEM INCOME</span>
            <span>{{dataType.SystemIncome}}</span>
          </div>
          <div>
            <span>SYSTEM APY</span>
            <span>{{dataType.SystemAPY}}</span>
          </div>
        </div>
        <div class="main-bottom" v-else>
          <div style="width:16%">
            <div class="bottom-one"></div>
          </div>
          <div>
            <span>PREVIOUS</span>
            <span>QUANTA</span>
          </div>
          <div>
            <span>SYSTEM INCOME</span>
            <span>{{dataType.SystemIncome}}</span>
          </div>
          <div>
            <span>SYSTEM APY</span>
            <span>{{dataType.SystemAPY}}</span>
          </div>
        </div>
        <div class="main-bottom">
          <div style="width:16%">
            <div class="bottom-two"></div>
          </div>
          <div>
            <span>FLOATING</span>
            <span>POOL</span>
          </div>
          <div>
            <span>FLOATING INCOME</span>
            <span>{{dataType.FloatingIncome}}</span>
          </div>
          <div>
            <span>FLOATING APY</span>
            <span>{{dataType.FloatingAPY}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TitleCard from '@/components/TitleCard.vue';
import {
  getAllowance,
  setApprove,
  getDashboard,
  getHGateKeeper,
} from '@/common/web3';
import { mapState, mapMutations } from 'vuex';
import { BigNumber } from 'bignumber.js';
import { NameMapping, PeriodName, DayMapping } from '../config.js';

export default {
  components: {
    TitleCard,
  },
  data () {
    return {
      tag: 'one',
      tags: null,
      money: '0',
      slider: 0,
      cycle: 'upcoming',
      calssNum: null,
      flo: false,
      btnName: 'CONFIRM',
      list: [],
      previous: {
        SystemIncome: 0,
        SystemAPY: 0,
        FloatingIncome: 0,
        FloatingAPY: 0,
        Dashboard: [],
      },
      approves: false,
      upcoming: {
        SystemIncome: 0,
        SystemAPY: 0,
        FloatingIncome: 0,
        FloatingAPY: 0,
        Dashboard: [],
      },
      allow: 0,
      periodName: [],
    };
  },
  computed: {
    ...mapState([
      'Smile',
      'BalanceOf',
      'Pending',
      'MetaMaskAddress',
    ]),
    dataType () {
      const Data = this.cycle === 'upcoming' ? this.upcoming : this.previous;
      return Data;
    },
    maxValue () {
      return Number(this.dataType.MaxValue) === 0
        ? 100
        : Number(this.dataType.MaxValue);
    },
    listData () {
      const data = JSON.parse(JSON.stringify(this.list)).map((item) => ({
        ...item,
      }));
      if (this.calssNum !== null) {
        // const max = Number(data[this.calssNum].value) + this.money
        return data.map((item) => {
          item.for = Math.ceil(
            ((Number(item.value) - Number(item.bids)) / this.maxValue) * 100,
          );
          item.bids = Math.ceil((Number(item.bids) / this.maxValue) * 100);
          data[this.calssNum].bids = Math.ceil(
            (this.money / this.maxValue) * 100,
          );
          return { ...item };
        });
      }
      return data.map((item) => {
        item.for = Math.ceil(
          ((Number(item.value) - Number(item.bids)) / this.maxValue) * 100,
        );
        item.bids = Math.ceil((Number(item.bids) / this.maxValue) * 100);
        return { ...item };
      });
    },
    listDataTo () {
      const data = JSON.parse(JSON.stringify(this.dataType.Dashboard)).map(
        (item) => ({
          ...item,
        }),
      );
      return data.map((item) => {
        item.for = Math.ceil(
          ((Number(item.value) - Number(item.bids)) / this.maxValue) * 100,
        );
        item.bids = item.bids
          ? Math.ceil((Number(item.bids) / this.maxValue) * 100)
          : 0;
        return { ...item };
      });
    },
    steps () {
      return this.btnName === 'BID AGAIN' ? '100%' : '67%';
    },
    maxMoney () {
      return Number(this.BalanceOf[this.Smile]);
    },
  },
  async mounted () {
    this.periodName = PeriodName;
    this.getAllowances();
    this.getData();
  },
  watch: {
    Pending (cur, old) {
      const arr = old.filter((item) => item.name === 'approves');
      if (arr.length > 0) {
        this.getAllowances();
      }
    },
  },
  methods: {
    ...mapMutations(['setPending']),
    setSlider (val) {
      this.money = isNaN(val) ? 0 : Number(val);
    },
    setColor (item) {
      if (item !== this.tags) {
        this.tags = item;
      }
    },
    remColor (item) {
      if (item === this.tags) {
        this.tags = null;
      }
    },
    divWidth (max, num) {
      return parseInt(max) === 0 ? '0%' : `${(num / max).toFixed(2) * 100}%`;
    },
    fixedFloat (num) {
      return parseFloat(num.toString().match(/^\d+(?:\.\d{0,2})?/)[0]);
    },
    setMoney (val) {
      const strArr = val.toString().split('.');
      if (strArr.length > 2) {
        this.money = `${strArr[0]}.${strArr[1]}`;
      } else {
        this.slider = !val || typeof val === 'undefined' || isNaN(Number(val))
          ? 0
          : Number(val);
      }
    },
    getData () {
      getDashboard(
        this.MetaMaskAddress,
        DayMapping[this.$route.query.code - 1],
        this.Smile,
      ).then((res) => {
        if (res.status === 200) {
          this.previous = res.data.Previous ? res.data.Previous : this.previous;
          this.upcoming = res.data.Upcoming ? res.data.Upcoming : this.upcoming;
          this.list = this.upcoming.Dashboard ? this.upcoming.Dashboard : [];
        }
      });
    },
    setApproves () {
      try {
        this.approves = true;
        const name = NameMapping[this.Smile][this.$route.query.code - 1];
        const params = setApprove(
          new BigNumber(1e28).toString(10),
          name,
          this.MetaMaskAddress,
          this.Smile,
        );
          window.web3.eth
            .sendTransaction(params)
            .on('transactionHash',  (hash) => {
              if(hash){
              const obj = {
                number: 0,
                name: 'approves',
                id: hash,
                msg: 'Approve',
                time: new Date().getTime()
              };
              this.setPendings(obj);
              this.approves = false;
              }
            })
        } catch (error) {
          this.approves = false;
              this.$notify.error({
                message: error,
                title: 'Error',
                offset: 100,
              });
        }
    },
    async getAllowances () {
      const name = NameMapping[this.Smile][this.$route.query.code - 1];
      this.allow = Number(
        await getAllowance(this.MetaMaskAddress, name, this.Smile),
      );
    },
    setMaxMoney () {
      this.slider = this.maxMoney;
    },
    setCycle (val) {
      this.cycle = val;
    },
    setNum (val) {
      if (this.cycle === 'upcoming') {
        this.flo = false;
        this.calssNum = val;
      }
    },
    setFloating () {
      if (this.cycle === 'upcoming' && this.list) {
        this.calssNum = this.list.length - 1;
        this.flo = true;
      }
    },
    setOrder () {
      if (this.money === 0) {
        this.Warning('Please choose size first.')
        return;
      }
      if (this.calssNum === null) {
        this.Warning('Please choose interest rates.')
        return;
      }
      const num = this.slider === this.maxMoney?this.BalanceOf[this.Smile]:this.money
      const number = new BigNumber(num).multipliedBy(1e18).toFixed(0);
      const name = NameMapping[this.Smile][this.$route.query.code - 1];
      const params = getHGateKeeper(
        number,
        this.MetaMaskAddress,
        name,
        this.list[this.calssNum].ratio_for_bid,
      );
      try {
        
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
          this.btnName = 'BID AGAIN';
          }
        })
      } catch (error) {
          this.$notify.error({
                message: error,
                title: 'Error',
                offset: 100,
              });
      }
    },
    setPendings (val) {
      const list = [...this.Pending];
      list.push(val);
      this.setPending(list);
      localStorage.setItem('PendingHorizon', JSON.stringify(list));
    },
    goPeriod () {
      this.$router.push({
        path: '/period',
      });
    },
    goHistory () {
      this.$router.push({
        path: '/history',
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "../style/mixin.scss";
.body-box {
  height: calc(100% - 120px);
  .body-mian {
    display: flex;
    height: calc(100% - 50px);
    margin-right: 50px;
    margin-top: 120px;
    .main-l {
      width: 30%;
      min-width: 350px;
      display: flex;
      flex-direction: column;
      align-items: center;
      p {
        margin: 10%;
        font-size: 50px;
        // word-wrap: break-word;
        // word-break: break-all;
        @include font_color($font-color-theme);
        span {
          cursor: revert;
        }
      }
      .bu_btn {
        font-size: 24px;
        width: 300px;
        height: 60px;
        line-height: 50px;
        // @include idxbtnbg_color($button-background-color-theme);
        @include bg_color($background-color-theme);
        border: 2px solid;
        @include font_color($font-color-theme);
        @include btnbor_color($button-border-color-theme);
        color: #e8e8e8;
        box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.06);
        text-align: center;
        border-radius: 50px;
        outline: none;
        cursor: pointer;
        margin-bottom: 20px;
      }
      .bu_btn:hover {
        @include idxbtnfont_color($idxfont-button-color-theme);
        @include idxbtnbg_color($button-background-color-theme);
        border: 2px solid;
      }
      span {
        border-bottom: 1px solid;
        @include btnbor_color($button-border-color-theme);
        cursor: pointer;
        @include font_color($font-color-theme);
      }
      span:hover {
        color: #5784c1;
        border-color: #5784c1;
      }
    }
    .main-c {
      /deep/ .el-slider__button-wrapper {
        z-index: 100;
      }
      flex: 1;
      min-width: 420px;
      padding: 0 10px;
      display: flex;
      flex-direction: column;
      .main-c-top {
        height: 30%;
        min-height: 240px;
        width: 80%;
        /deep/ .el-input__inner {
          padding: 0 !important;
          text-align: inherit !important;
          // background-color: #e8e8e8 !important;
          @include bg_color($background-color-theme);
          border: none !important;
          font-size: 50px;
          display: block;
          margin: 15px 0;
          color: #5784c1;
        }
        // /deep/ .el-input-number {
        //   width: 100% !important;
        // }
        .money {
          font-size: 50px;
          display: block;
          margin: 15px 0;
          color: #5784c1;
        }
        .title {
          font-size: 24px;
          @include font_color($font-color-theme);
        }
        .yusd {
          color: #707070;
          display: flex;
          .sizemany {
            max-width: 120px;
            margin-right: 5px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .max {
          margin-left: auto;
          font-size: 16px;
          color: #707070;
          cursor: pointer;
        }
        .max:hover {
          color: #5784c1;
        }
      }
      .main-c-bottom {
        flex: 1;
        // min-height: 260px;
        overflow-y: auto;
        .bu_btn {
          font-size: 18px;
          @include font_color($font-color-theme);
          width: 90%;
          min-width: 350px;
          height: 42px;
          line-height: 30px;
          @include btn_bg_color($button-bg-color-theme);
          border: none;
          box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.06);
          text-align: center;
          border-radius: 50px;
          outline: none;
          cursor: pointer;
          margin: 20px 0;
        }
        .bu_num {
          font-size: 18px;
          @include font_color($font-color-theme);
          min-width: 50px;
          min-height: 50px;
          line-height: 30px;
          border: none;
          @include btn_bg_color($button-bg-color-theme);
          box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.06);
          text-align: center;
          border-radius: 50px;
          outline: none;
          cursor: pointer;
          margin: 10px;
        }
        .bu_num:hover,
        .bu_btn:hover {
          background-color: #5784c1;
        }
        span {
          font-size: 24px;
          padding-left: 5px;
          @include font_color($font-color-theme);
        }
      }
    }
    .main-r {
      min-width: 600px;
      overflow-y: auto;
      .r-title {
        width: 100%;
        font-size: 24px;
        span {
          padding: 0 10px;
          @include font_color($font-color-theme);
          cursor: pointer;
        }
        .title-r {
          float: right;
        }
      }
      .main-r-box {
        margin-top: 25px;
        .r-box-item {
          width: 76%;
          height: 20px;
          margin-bottom: 10px;
          @include btn_bg_color($button-bg-color-theme);
          border-radius: 3px;
          @include font_color($font-color-theme);
          padding: 0 10px;
          display: flex;
          align-items: center;
          .item-num {
            width: 80px;
          }
          .item-body {
            flex: 1;
            display: flex;
            .item-idx {
              height: 3px;
              background-color: #5784c1;
              border-radius: 2px;
            }
            .item-box {
              height: 3px;
              @include tb_bg_color($tb-bgcolor-theme);
              border-radius: 2px;
            }
            .item-idxlest {
              height: 0.5px;
              border: 2px dashed;
              @include tb_bd_color($tb-bgcolor-theme);
              border-radius: 2px;
            }
            .item-idx-lest {
              height: 0.5px;
              border: 2px dashed;
              border-color: #5784c1;
              border-radius: 2px;
              margin-right: 2px;
            }
          }
        }
        .right_text {
          flex: 1;
          @include btn_bg_color($button-bg-color-theme);
          height: 20px;
          margin: 0 10px;
          margin-left: 10px;
          display: flex;
          align-items: center;
          padding: 0 4px;
          @include font_color($font-color-theme);
          line-height: 15px;
          div {
            width: 0px;
            background-color: rgba(87, 132, 193, 0.45);
            height: 15px;
          }
        }
      }
      .main-bottom {
        height: 60px;
        width: 100%;
        border-radius: 3px;
        margin-bottom: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        @include font_color($font-color-theme);
        @include btn_bg_color($button-bg-color-theme);
        div {
          width: 25%;
          span {
            display: block;
          }
        }
        .bottom-one {
          width: 40px;
          height: 3px;
          @include tb_bg_color($tb-bgcolor-theme);
          border-radius: 2px;
          margin-left: 30px;
        }
        .bottom-two {
          width: 35px;
          margin-left: 30px;
          height: 0.5px;
          border: 2px dashed;
          @include tb_bd_color($tb-bgcolor-theme);
          border-radius: 2px;
          margin-right: 2px;
        }
      }
    }
  }
}
/deep/ .el-slider__button {
  background-color: #5784c1 !important;
  border: 0 !important;
}
/deep/ .el-slider__bar {
  background-color: #5784c1 !important;
}
/deep/ .el-slider__runway {
  background-color: #aaa9a9 !important;
}
</style>
