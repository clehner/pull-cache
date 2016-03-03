module.exports = function (read) {
  var cbs = []
  var vals = []
  var ended

  function next(end, data) {
    if (end)
      ended = end
    else
      vals.push(data)
    cbs.splice(0).forEach(function (cb) {
      cb(end, data)
    })
  }

  return function (end, cb) {
    if (ended = end)
      return read(end, cb)
    var i = 0
    return function (end, cb) {
      if (end) return cb(end)
      if (i++ < vals.length)
        return cb(null, vals[i-1])
      if (ended)
        return cb(ended)
      cbs.push(cb)
      if (cbs.length === 1)
        read(null, next)
    }
  }
}
