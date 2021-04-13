const milliseconds = function(time) {
  if (time) {
    const t = parseInt(time / 60 / 60 / 24)
    const h = parseInt(time / 60 / 60 - t * 24)
    const m = parseInt(time / 60 - h * 60 - t * 24 * 60)
    return t + 'd  ' + h + 'h  ' + m + 'min  ' + 'left'
  }
  return 'in progress'
}

const claimTime = function(time) {
  if (time > 0) {
    const t = parseInt(time / 60 / 60 / 24)
    const h = parseInt(time / 60 / 60 - t * 24)
    const m = parseInt(time / 60 - h * 60 - t * 24 * 60)
    return t > 0
      ? t + 'd:' + h + 'h:' + m + 'min ' + 'left'
      : h > 0
      ? h + 'h:' + m + 'min ' + 'left'
      : m + 'min ' + 'left'
  }
}

const copys = function(thit, metaMaskAddress) {
  const spanText = metaMaskAddress
  const oInput = document.createElement('input')
  oInput.value = spanText
  document.body.appendChild(oInput)
  oInput.select() // 选择对象
  document.execCommand('Copy') // 执行浏览器复制命令
  oInput.className = 'oInput'
  oInput.style.display = 'none'
  document.body.removeChild(oInput)
  thit.$message({
    message: 'Copy success!',
    type: 'success',
    offset: 100,
  })
}

const ellipsis = function(value, one = 0, two = 6, three = 38, four = 42) {
  if (!value) return ''
  if (value.length > 10) {
    return value.slice(one, two) + '...' + value.slice(three, four)
  }
  return value
}

export { milliseconds, copys, claimTime, ellipsis }
