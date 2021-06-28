<template>
  <div class="box">
    <div class="body" v-for="(val , key , idx ) in objData " :key="idx">
      <div :class="`${key}-card`" v-for="(item, idex) in val" :key="item" @click="updatePeriodStatuss(item)">
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
  import {
    mapMutations,
    mapState
  } from 'vuex'
  import {
    Network,
    NameMapping,
    PeriodName
  } from '../config.js'
  import {
    updatePeriodStatu
  } from '@/common/web3'
  export default {
    computed: {
      ...mapState(['MetaMaskAddress']),
    },
    data() {
      return {
        objData: {},
        objName: [],
      }
    },
    mounted() {
      this.objData = {
        ...NameMapping
      }
      this.objName = {
        ...PeriodName
      }
    },
    methods: {
      ...mapMutations(['setDialog', 'setIsExits']),
      updatePeriodStatuss(name) {
        if (this.MetaMaskAddress !== '') {
          let params = updatePeriodStatu(this.MetaMaskAddress, name)

          window.web3.eth
            .sendTransaction(params)
            .on('transactionHash', async (hash) => {
              this.Success("Operation is successful")
            })
        } else {
          this.Warning('Please click the APP to connect the wallet first.')
        }
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