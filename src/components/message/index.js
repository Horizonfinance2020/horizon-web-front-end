const msg = {
  methods: {
    Success(msg, offset = 100, duration = 3000) {
      this.$message({
        type: 'success',
        message: msg,
        offset: offset,
        duration: duration
      })
    },
    Warning(msg, offset = 100, duration = 3000) {
      this.$message({
        type: 'warning',
        message: msg,
        offset: offset,
        duration: duration
      })
    },
    Error(msg, offset = 100, duration = 3000) {
      this.$message({
        type: 'error',
        message: msg,
        offset: offset,
        duration: duration
      })
    }
  }
}
export { msg }
