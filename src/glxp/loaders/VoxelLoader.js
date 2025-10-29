// TODO: Replace `when` with `Promise`
var when = require('when/dist/browser/when.js')

function VoxelDataLoader(json) {
  this.json = json
  this.defer = when.defer()

  var that = this
  this.load().then(function (result) {
    that.data = result
    that.init()
  })

  return this.getPromise()
}

VoxelDataLoader.prototype = {
  init: function () {
    this.data = new Float32Array(this.data)
    this.defer.resolve(this.data)
  },

  getPromise: function () {
    return this.defer.promise
  },

  load: function () {
    var defer = when.defer()
    var oReq = new XMLHttpRequest()
    oReq.open('GET', this.json, true)
    oReq.responseType = 'json'
    oReq.onload = function (e) {
      defer.resolve(oReq.response)
    }
    oReq.send()
    return defer.promise
  },
}

module.exports = VoxelDataLoader
