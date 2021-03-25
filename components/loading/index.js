import LoadingComponent from './Loading.vue'
let $vm
// 使用install方法来全局注册该组件，
//这个方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象(可选)
const Loading = {
  install: (Vue, options = {}) => {
    if (!$vm) {
      const LoadingPlugin = Vue.extend(LoadingComponent) // extend是构造一个组件的语法器
      $vm = new LoadingPlugin(options).$mount() //$mount方法是用来挂载我们的Vue.extend扩展的元素
      document.body.appendChild($vm.$el)
    }
    $vm.show = false
    let count = 0
    let loading = {
      show () {
        count++
        $vm.show = true
      },
      hide () {
        count--
        if (count <= 0) {
          $vm.show = false
        }
      }
    }
    if (!Vue.$loadings) {
      Vue.$loadings = loading
    }
	// mixin全局混入
    Vue.mixin({
      created () {
        this.$loadings = Vue.$loadings
      }
    })
  }

}
export default Loading