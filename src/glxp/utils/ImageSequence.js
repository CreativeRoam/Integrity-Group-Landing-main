// TODO: Replace `when` with `Promise`
var when = require('when')

function ImageSequence(canvas, json, bin) {
  this.canvas = canvas
  this.ctx = canvas.getContext('2d')
  this.json = json
  this.bin = bin
  this.itemLoaded = 0
  this.defer = when.defer()
  this.images = []
  this.currentImg = 0
  this.play = false
  this.loop = false

  var that = this

  if (typeof this.json === 'string') {
    this.loadJson().then(function (result) {
      that.json = result
      that.itemLoaded++
      that.checkIfItemIsloaded()
    })
  } else {
    this.itemLoaded++
  }

  if (typeof this.bin === 'string') {
    this.loadBin().then(function (result) {
      that.bin = result
      that.itemLoaded++
      that.checkIfItemIsloaded()
    })
  } else {
    this.itemLoaded++
  }

  if (this.itemLoaded === 2) {
    this.init()
  }
}

ImageSequence.prototype = {
  init: function () {
    var images = this.json.images

    for (let i = 0; i < images.length; i++) {
      const image = images[i]
      let buff = this.bin.slice(image.bufferPos, image.bufferPos + image.bufferLength)

      let arrayBufferView = new Uint8Array(buff)
      let blob = new Blob([arrayBufferView], { type: 'image/jpeg' })
      let urlCreator = window.URL || window.webkitURL
      let imageUrl = urlCreator.createObjectURL(blob)
      let img = new Image()
      img.src = imageUrl
      this.images.push(img)
    }

    this.defer.resolve(this.images)
  },

  getPromise: function () {
    return this.defer.promise
  },

  loadJson: function () {
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

  loadBin: function () {
    var defer = when.defer()
    var oReq = new XMLHttpRequest()
    oReq.open('GET', this.bin, true)
    oReq.responseType = 'arraybuffer'
    oReq.onload = function (e) {
      defer.resolve(oReq.response)
    }
    oReq.send()
    return defer.promise
  },

  update: function () {
    if (this.images.length == 0) {
      return
    }
    if (this.play) {
      this.currentImg++
      if (this.loop) {
        if (this.currentImg > this.images.length - 1) {
          this.currentImg = 0
        }
      } else {
        this.currentImg = Math.min(this.currentImg, this.images.length - 1)
      }
    }
    this.canvas.width = this.images[0].width
    this.canvas.height = this.images[0].height
    this.ctx.drawImage(this.images[this.currentImg], 0, 0, this.canvas.width, this.canvas.height)
  },

  checkIfItemIsloaded: function () {
    if (this.itemLoaded === 2) {
      this.init()
    }
  },
}

module.exports = ImageSequence
