<template>
  <div class="body-box">
    <title-card :tag="tag" :steps="steps" />
    <div class="body-mian">
      <div class="main-l">
        <p>Select a period to bid on.</p>
        <button
          class="bu_btn"
          :disabled="num===0"
          :style="{color:num===0?'#909399':'',cursor:num===0?'no-drop':'','border-color':num===0?'#909399':''}"
          @click="goTrading"
        >CONFIRM</button>
      </div>
      <div class="main-r">
        <div class="table">
          <div class="table-all" @click="confirm(2)" :style="{background:num===2?'#5784C1':''}">
            <div class="table-left">2 weeks</div>
            <div class="table-center">{{timeFormat(two.time)}}</div>
            <div class="table-right">
              <el-progress
                type="circle"
                :percentage="two.onepercentage"
                :stroke-width="20"
                :width="80"
                :color="Theme==='theme1'?'#cecece':'#505050'"
                :show-text="false"
                stroke-linecap="butt"
              ></el-progress>
            </div>
          </div>
          <div class="table-all" @click="confirm(3)" :style="{background:num===3?'#5784C1':''}">
            <div class="table-left">1 month</div>
            <div class="table-center">{{timeFormat(thr.time)}}</div>
            <div class="table-right">
              <el-progress
                type="circle"
                :percentage="thr.onepercentage"
                :stroke-width="20"
                :width="80"
                :color="Theme==='theme1'?'#cecece':'#505050'"
                :show-text="false"
                stroke-linecap="butt"
              ></el-progress>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TitleCard from '@/components/TitleCard.vue'
import { mapState } from 'vuex'
import { getBlockNum, getPeriod, getPeriodInfos, getBlock } from '@/common/web3'
import { milliseconds } from '@/utils'
export default {
  components: {
    TitleCard,
  },
  computed: {
    ...mapState(['Theme', 'Smile']),
  },
  data() {
    return {
      num: 0,
      tag: 'one',
      steps: '35%',
      one: {
        time: 0,
        onepercentage: 0,
      },
      two: {
        time: 0,
        onepercentage: 0,
      },
      thr: {
        time: 0,
        onepercentage: 0,
      },
    }
  },
  created() {
    this.one = {
      time: 0,
      onepercentage: 0,
    }
    this.two = {
      time: 0,
      onepercentage: 0,
    }
    this.thr = {
      time: 0,
      onepercentage: 0,
    }
    if (this.Smile === 'yyCRV') {
      this.getDataTwo('towweek')
      this.getDataThr('onemonth')
    } else {
      this.getDataTwo('sushitwo')
      this.getDataThr('sushimonth')
    }
  },
  methods: {
    timeFormat(val) {
      return milliseconds(val)
    },
    async getData(name) {
      const blockNum = await getBlockNum(name)
      const period = await getPeriod(name)
      const periodInfo = await getPeriodInfos(period, name)
      const block = await getBlock()
      const num = Number(block) - Number(periodInfo.s)
      console.log(
        blockNum + 'blockNum',
        period + 'period',
        periodInfo,
        'periodInfo',
        block + 'block',
        num + 'num'
      )
      if (num > Number(blockNum)) {
        return {
          time: 0,
          onepercentage: 0,
        }
      } else {
        return {
          time: (Number(blockNum) - num) * 14.5,
          onepercentage: (num / Number(blockNum)) * 100,
        }
      }
    },

    async getDataOne(name) {
      const data = await this.getData(name)
      this.one = { ...data }
    },

    async getDataTwo(name) {
      const data = await this.getData(name)
      this.two = { ...data }
    },

    async getDataThr(name) {
      const data = await this.getData(name)
      this.thr = { ...data }
    },
    confirm(val) {
      this.num = val
    },
    goTrading() {
      this.$router.push({
        path: '/trading',
        query: { code: this.num },
      })
    },
  },
  destroyed() {
    this.one = {
      time: 0,
      onepercentage: 0,
    }
    this.two = {
      time: 0,
      onepercentage: 0,
    }
    this.thr = {
      time: 0,
      onepercentage: 0,
    }
  },
}
</script>

<style scoped lang="scss">
@import '../style/mixin.scss';
.body-box {
  height: calc(100% - 90px);
  min-height: 540px;
  .body-mian {
    display: flex;
    // height: calc(100% - 110px);
    height: 100%;
    margin-top: 90px;
    align-items: center;
    .main-l {
      min-width: 350px;
      display: flex;
      flex-direction: column;
      align-items: center;
      p {
        margin: 20% 10%;
        font-size: 50px;
        @include font_color($font-color-theme);
      }
      .bu_btn {
        font-size: 24px;
        font-weight: bold;
        width: 300px;
        height: 60px;
        line-height: 50px;
        @include bg_color($background-color-theme);
        border: 2px solid;
        @include font_color($font-color-theme);
        @include btnbor_color($button-border-color-theme);
        box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.06);
        text-align: center;
        border-radius: 50px;
        outline: none;
        cursor: pointer;
      }
      .bu_btn:hover {
        @include idxbtnfont_color($idxfont-button-color-theme);
        @include idxbtnbg_color($button-background-color-theme);
        border: none;
      }
    }
    .main-r {
      flex: 1;
      padding: 20px 80px;
      .table {
        height: 100%;
        display: flex;
        flex-direction: column;
        .table-all {
          min-height: 130px;
          width: 100%;
          min-width: 700px;
          margin-bottom: 30px;
          @include table_color($background-table-color-theme);
          box-shadow: 0px 3px 6px #00000029;
          border-radius: 10px;
          display: flex;
          @include font_color($font-color-theme);
          cursor: pointer;
          .table-left {
            width: 30%;
            min-width: 220px;
            display: flex;
            align-items: center;
            font-size: 44px;
            padding-left: 40px;
            min-height: 130px;
          }
          .table-center {
            display: flex;
            width: 40%;
            min-width: 260px;
            align-items: center;
            font-size: 28px;
          }
          .table-right {
            display: flex;
            width: 30%;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }
  }
  /deep/ .el-progress-circle__track {
    @include progress_color($font-color-theme);
  }
}
</style>
