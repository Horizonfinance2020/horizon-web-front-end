<template>
  <div class="home">
    <div class="dialog-box">
      <li>CONNECT YOUR WALLET</li>
      <div class="imgs" @click="connection">
        <img src="../assets/images/metamask_logo@2X.png" alt />
        <li>METAMASK</li>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: null,
    }
  },
  methods: {
    async connection() {
      try {
        if (typeof web3 !== 'undefined') {
          if (ethereum.isMetaMask) {
            const accounts = await ethereum.request({
              method: 'eth_requestAccounts',
            })
            this.loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)',
            })
            this.onComplete()
          } else {
            this.$notify.error({
              title: 'Error',
              message: `You'll need to install MetaMask to continue. Once you have it installed, go ahead and refresh the page.`,
              offset: 100,
            })
          }
        } else {
          this.$notify.error({
            title: 'Error',
            message: `Please change web3 browser or refresh the page.`,
            offset: 100,
          })
        }
      } catch (error) {
        this.$notify.error({
          title: 'Error',
          message: error.message,
          offset: 100,
        })
      }
    },
    onComplete() {
      try {
        setTimeout(() => {
          this.loading.close()
          this.loading = null
          this.$emit('closeMain', false)
        }, 2000)
      } catch (error) {
        this.loading.close()
        this.loading = null
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.submit_button {
  width: 160px;
  border-radius: 30px;
}
.dialog-box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .imgs {
    width: 100px;
    height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 15px 0;
    border: 1px solid #aaa9a9;
    border-radius: 10px;
    cursor: pointer;
    img {
      width: 60%;
    }
    li {
      margin-top: 20px;
      font-size: 14px;
    }
  }
  .imgs:hover {
    border-color: #1f1f1f;
  }
  li {
    list-style-type: none;
    font-size: 26px;
  }
}
</style>
