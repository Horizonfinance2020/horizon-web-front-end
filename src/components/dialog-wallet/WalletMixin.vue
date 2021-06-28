<script>
import Web3 from 'web3'
import { Network, ProviderOptions, HashCode } from '@/config.js'
import Web3Modal from 'web3modal'
import { mapMutations } from 'vuex'
import Networkutils from './Networkutils'
import { copys } from '@/utils'
  import {
    mapState,
  } from 'vuex'
export default {
  mixins: [Networkutils],
    computed: {
      ...mapState([
        'Theme',
      ])
    },
  data() {
    return {
      metaMaskAddress: '',
      isLogin: false,
      networkId: '',
      web3Modal: null,
      isEthereum: null
    }
  },
  watch: {
    metaMaskAddress(cur, old) {
      this.setMetaMaskAddress(cur)
    },
    networkId(cur,old){
      this.setNetworkId(cur)
    },
    Theme(cur,old){
      if(cur==='theme2'){
        this.initweb3Modal('dark')
      }else{
         this.initweb3Modal('light')
      }
    }
  },
  created() {
    const theme = localStorage.getItem('data-theme')==='theme1'?'light':'dark'
    this.isEthereum = sessionStorage.getItem('isEthereum') // TODO should we change 'isEthereum'?
      ? sessionStorage.getItem('isEthereum')
      : 'no'
    sessionStorage.setItem('isEthereum', this.isEthereum)
    this.initweb3Modal(theme)
  },
   mounted() {
    this.onConnect()
  },
  methods: {
    ...mapMutations(['setMetaMaskAddress','setNetworkId']),
    login() {
      this.isLogin = true
      this.isEthereum = HashCode
      sessionStorage.setItem('isEthereum', this.isEthereum)
      this.onConnect()
    },

    handleCommand(command) {
      switch (command) {
        case 'copy':
          copys(this, this.metaMaskAddress)
          break
        case 'exit':
          this.resetApp()
          break
        default:
          break
      }
    },
    async onConnect() {
      let provider = null
      if (
        this.web3Modal.cachedProvider &&
        this.web3Modal.cachedProvider === 'injected'
      ) {
        if (window.ethereum && window.ethereum.isMetaMask) {
          if (this.isEthereum === HashCode) {
            await window.ethereum.request({
              method: 'eth_accounts'
            })
            provider = await this.web3Modal.connectTo(
              this.web3Modal.cachedProvider
            )
          } else {
            this.resetApp()
          }
        } else {
          this.Warning('Install MetaMask first!', 100)
        }
      } else {
        if (this.isLogin) {
          provider = await this.web3Modal.connect()
        }
      }
      if (provider) {
        await this.subscribeProvider(provider)
        window.web3 = await this.initWeb3(provider)
        const accounts = await window.web3.eth.getAccounts()
        this.metaMaskAddress = accounts[0].toLowerCase()
        this.networkId = await window.web3.eth.getChainId()
        this.checkNetwork(this.networkId)
      }
    },

    async subscribeProvider(provider) {
      if (!provider.on) {
        return
      }
      provider.on('close', () => this.resetApp())
      provider.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          this.isEthereum = 'no'
          sessionStorage.setItem('isEthereum', this.isEthereum)
        }
        this.metaMaskAddress =
          accounts.length > 0 ? accounts[0].toLowerCase() : '' // TODO should we change this to briefAddress?
      })
      // provider.on('chainChanged', (chainId) => {
      //   console.log(chainId, 'chainId')
      //   // const networkId = await web3.eth.net.getId()
      // })
      provider.on('networkChanged', (networkId) => {
        this.networkId=networkId
        setTimeout(() => {
          this.checkNetwork(Number(networkId))
        }, 300)
      })
    },
    checkNetwork(networkId) {
      if (networkId !== this.networkIDFromSym(Network)) {
        const s = 'Please change to ' + this.networkNameFromSym(Network) + ' network!'
        this.Warning(s, 100)
        return
      } else {
        if (networkId !== '1') {
          // this.Success('You can start testing！', 100)
          return
        }
      }
    },

    initWeb3(provider) {
      const web3 = new Web3(provider)
      web3.eth.extend({
        methods: [
          {
            name: 'chainId',
            call: 'eth_chainId',
            outputFormatter: web3.utils.hexToNumber
          }
        ]
      })
      return web3
    },

    async resetApp() {
      console.log('tuichu')
      if (
        window.web3 &&
        window.web3.currentProvider &&
        window.web3.currentProvider.close
      ) {
        await window.web3.currentProvider.close()
      }
      await this.web3Modal.clearCachedProvider()
      this.isLogin = false
      this.isEthereum = 'no'
      sessionStorage.setItem('isEthereum', this.isEthereum)
      this.metaMaskAddress = ''
    },

    initweb3Modal(theme) {
      if(this.web3Modal){
      this.web3Modal.clearCachedProvider()
      }
      this.web3Modal = new Web3Modal({
        network: Network,
        cacheProvider: true,
        providerOptions: ProviderOptions,
        theme: theme
      })
    }
  }
}
</script>
<style scoped>
</style>
