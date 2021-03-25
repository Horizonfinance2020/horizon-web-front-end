const milliseconds = function (time) {
  if (time) {
    const t = parseInt(time / 60 / 60 / 24)
    const h = parseInt(time  / 60 / 60 -t * 24)
    const m = parseInt(time  / 60 - h * 60 - t * 24 * 60)
    // const s = parseInt(time / 1000 - h * 60 * 60 - m * 60-t*24*60)
    return t +'d  '+ h + 'h  ' + m + 'min  ' + 'left'
  }
  return 'in progress'
}

export {
  milliseconds
}
