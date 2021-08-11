import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    Theme: '',
    Smile: '',
    IsMar: false,
    Dialog: false,
    BalanceOf: {},
    SuBalanceOf: '0',
    NetworkId: null,
    Pending: [],
    MetaMaskAddress: '',
  },
  mutations: {
    setTheme(state, theme) {
      state.Theme = theme
    },
    setSmile(state, val) {
      state.Smile = val
    },
    setIsMar(state, val) {
      state.IsMar = val
    },
    setDialog(state, val) {
      state.Dialog = val
    },
    setBalanceOf(state, val) {
      state.BalanceOf = val
    },
    setSuBalanceOf(state, val) {
      state.SuBalanceOf = val
    },
    setNetworkId(state, val) {
      state.NetworkId = val
    },
    setPending(state, val) {
      state.Pending = val
    },
    setMetaMaskAddress(state, val) {
      state.MetaMaskAddress = val
    },
  },
  actions: {},
  modules: {},
})
