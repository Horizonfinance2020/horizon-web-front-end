export default {
  methods: {
    networkNameFromSym(sym) {
      if (typeof sym !== 'string') {
        alert('networkNameFromSym: only accept string')
        return
      }
      if (sym === 'rinkeby') {
        return 'Rinkeby'
      }
      if (sym === 'ropsten') {
        return 'Ropsten'
      }
      if (sym === 'mainnet') {
        return 'Mainnet'
      }
      return
    },

    networkIDFromSym(sym) {
      if (typeof sym !== 'string') {
        alert('networkIDFromSym: only accept string')
        return
      }
      if (sym === 'rinkeby') {
        return 4
      }
      if (sym === 'ropsten') {
        return 3
      }
      if (sym === 'mainnet') {
        return 1
      }
      return
    },

    briefAddress(address) {
      if (typeof address !== 'string') {
        alert('briefAddress: only accept string')
        return ''
      }
      if (!address) return ''
      if (address.length > 10) {
        return address.slice(0, 6) + '...' + address.slice(38, 43)
      }
      return address
    }
  }
}
