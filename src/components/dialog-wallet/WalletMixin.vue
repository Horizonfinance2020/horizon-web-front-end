<script>
  import Web3 from 'web3'
    import Onboard from 'bnc-onboard'
  import {
    Network,Wallets,DappId
  } from '@/config.js'
  import {
    mapState,
    mapMutations
  } from 'vuex'
  import Networkutils from './Networkutils'
  import {
    copys
  } from '@/utils'
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
        networkId: null,
        onboard: null
      }
    },
    watch: {
      metaMaskAddress(cur, old) {
        this.setMetaMaskAddress(cur)
      },
      networkId(cur, old) {
        this.setNetworkId(cur)
      },
      Theme(cur, old) {
       this.onboard.config({ darkMode:cur==='theme1'?false: true })
      }
    },
    mounted() {
      this.onConnect()
    },
    methods: {
      ...mapMutations(['setMetaMaskAddress', 'setNetworkId']),

      async login() {
        await this.onboard.walletSelect();
        await this.onboard.walletCheck();
        await this.onboard.accountSelect()
        // const d = await this.onboard.getState()
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
        const wallets =Wallets 
        const dappId = DappId // [String] The API key created by step one above
       const networkId = this.networkIDFromSym(Network) // [Integer] The Ethereum network ID your Dapp uses.
        this.onboard = Onboard({
          dappId,
          hideBranding: false,
          networkId,
          //... other options
          subscriptions: {
            wallet: wallet => {
              window.web3 = typeof (wallet) === "undefined" ? null : new Web3(wallet.provider)
              window.sessionStorage.setItem('selectedWallet', typeof (wallet) === "undefined" ? null : wallet
                .name)
            },
            address: address => {
              this.metaMaskAddress = typeof (address) === "undefined" ? '' : address.toLowerCase()
            },
            network: network => {
              console.log(network, 'network')
              this.networkId = typeof (network) === "undefined" ? null : network + ''
              this.checkNetwork(this.networkId)
            },
            balance: balance => {
              console.log(balance, 'balance')
            },
          },
          walletSelect: {
            wallets: wallets
          }
        })
        // const t = localStorage.getItem('data-theme')
        this.onboard.config({
          darkMode: this.Theme === 'theme1' ? false : true
        })
        let previouslySelectedWallet = null
        previouslySelectedWallet = window.sessionStorage.getItem('selectedWallet')
        if (previouslySelectedWallet !== 'undefined' && previouslySelectedWallet !== null) {
          await this.onboard.walletSelect(previouslySelectedWallet)
        }
      },
      async resetApp() {
        this.onboard.walletReset()
      },

      checkNetwork(networkId) {
        if (networkId && Number(networkId) !== this.networkIDFromSym(Network)) {
          const s = 'Please change to ' + this.networkNameFromSym(Network) + ' network!'
          this.Warning(s, 100)
          return
        } 
      },
    }
  }
</script>
<style scoped>
</style>